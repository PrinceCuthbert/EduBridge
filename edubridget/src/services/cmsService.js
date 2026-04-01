import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const processFiles = async (data, collectionName) => {
  const processed = { ...data };
  for (const [key, value] of Object.entries(processed)) {
    if (value instanceof File) {
      console.log(`[cmsService] Uploading ${key} to Storage...`);
      const fileName = `${Date.now()}_${value.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `cms/${collectionName}/${fileName}`);
      await uploadBytes(storageRef, value);
      processed[key] = await getDownloadURL(storageRef);
    }
  }
  return processed;
};

/**
 * A generic factory that creates typed Firestore CRUD services.
 * Every write logs the outgoing payload so you can verify data shape.
 *
 * @param {string} collectionName - Firestore collection name
 */
export const createCmsService = (collectionName) => {
  const colRef = collection(db, collectionName);

  return {
    /** Fetch all documents in the collection */
    getAll: async () => {
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    /** Create a new document */
    create: async (data) => {
      const processedData = await processFiles(data, collectionName);
      const payload = {
        ...processedData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      console.log(`[cmsService] CREATE → ${collectionName}`, payload);
      const docRef = await addDoc(colRef, payload);
      return { id: docRef.id, ...processedData };
    },

    /** Update an existing document by id */
    update: async (id, data) => {
      const processedData = await processFiles(data, collectionName);
      const payload = {
        ...processedData,
        updated_at: serverTimestamp(),
      };
      console.log(`[cmsService] UPDATE → ${collectionName}/${id}`, payload);
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, payload);
      return { id, ...processedData };
    },

    /** Delete a document by id */
    delete: async (id) => {
      const docRef = doc(db, collectionName, id);
      
      // Clean up orphaned storage files
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        for (const value of Object.values(data)) {
          if (typeof value === 'string' && value.includes('firebasestorage.googleapis.com')) {
            try {
              const fileRef = ref(storage, value);
              await deleteObject(fileRef);
              console.log(`[cmsService] DELETED Storage file: ${value}`);
            } catch (err) {
              console.warn('[cmsService] Failed to delete storage file:', err);
            }
          }
        }
      }

      console.log(`[cmsService] DELETE → ${collectionName}/${id}`);
      await deleteDoc(docRef);
      return id;
    },
  };
};

// ─── Named service instances ──────────────────────────────────────────────────
export const scholarshipService = createCmsService("scholarships");
export const blogService        = createCmsService("blogs");
export const mediaService       = createCmsService("media");
