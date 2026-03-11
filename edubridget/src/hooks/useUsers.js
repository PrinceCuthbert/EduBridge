// src/hooks/useUsers.js
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner"; // Move toast here!
import * as userService from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Move submitting state here!

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // UNIFIED SAVE FUNCTION
  const saveUser = useCallback(async (id, formData) => {
    setSubmitting(true);
    try {
      if (id) {
        // Edit Mode
        const updatedUser = await userService.updateUser(id, formData);
        setUsers(prev => prev.map(u => (u.id === id ? updatedUser : u)));
        toast.success("User updated successfully");
      } else {
        // Create Mode
        const newUser = await userService.createUser(formData);
        setUsers(prev => [...prev, newUser]);
        toast.success("User created successfully");
      }
      return true; // Return true so the View knows it can close the modal
    } catch (err) {
      toast.error(err.message || "Failed to save user");
      return false; // Return false so the View keeps the modal open
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteUser = useCallback(async (user) => {
    // Handle the toast confirmation and delete logic entirely inside the hook
    toast(`Delete ${user.identity.firstName}?`, {
      description: "This will permanently remove the user.",
      action: {
        label: "Confirm Delete",
        onClick: async () => {
          try {
            await userService.deleteUser(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
            toast.success("User deleted successfully");
          } catch (err) {
            toast.error("Failed to delete user");
          }
        },
      },
    });
  }, []);

  return {
    users,
    loading,
    submitting, // Expose submitting state
    saveUser,   // Expose unified save
    deleteUser
  };
}