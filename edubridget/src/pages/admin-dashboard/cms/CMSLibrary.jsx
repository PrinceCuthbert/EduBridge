import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Link,
  CheckCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "../../../services/fileService";
import Modal from "../../../components/Modal";
import { MOCK_LIBRARY_RESOURCES } from "../../../data/mockData";
import { useCMSManager } from "@/hooks/useCMSManager";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminTable from "../../../components/admin/AdminTable";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";

export default function CMSLibrary() {
  const {
    items: filteredResources,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    editingItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
  } = useCMSManager(
    MOCK_LIBRARY_RESOURCES,
    {
      title: "",
      type: "E-book",
      author: "",
      year: new Date().getFullYear().toString(),
      pages: "",
      category: "",
      link: "",
      fileUrl: "",
    },
    ["title", "category"],
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file: path } = await uploadFile(file);
    setFormData({ ...formData, fileUrl: path });
    toast.success("File uploaded successfully");
  };

  const columns = [
    {
      header: "Resource",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
            <FileText size={20} className="text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">
              {item.title}
            </div>

            <div className="text-xs text-slate-500">{item.category}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      render: (item) => (
        // CHANGED: Rounded-lg -> rounded-full pill shape. Removed uppercase.
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          {item.type}
        </span>
      ),
    },
    {
      header: "Author",
      render: (item) => (
        <span className="text-sm text-slate-700">{item.author}</span>
      ),
    },
    {
      header: "Year",
      render: (item) => (
        <span className="text-sm text-slate-500 font-medium">{item.year}</span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit">
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id, "Resource")}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        title="Digital Library"
        subtitle="Manage educational resources and e-books"
        count={filteredResources.length}
        primaryAction={{
          label: "Add Resource",
          icon: Plus,
          onClick: handleAdd,
        }}
      />

      <AdminFilterBar
        searchPlaceholder="Search by title or category..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminTable
        columns={columns}
        data={filteredResources}
        isLoading={false}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Resource" : "Add New Resource"}
        size="lg">
        <form
          onSubmit={(e) => handleSubmit(e, "Resource")}
          className="space-y-6">
          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="Resource Title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-900">
                    <option value="E-book">E-book</option>
                    <option value="Journal">Journal</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Exam Paper">Exam Paper</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                />
              </div>
            </div>

            {/* Conditional Input based on Type */}
            {formData.type === "E-book" ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Link to Book (URL)
                </label>
                <div className="relative">
                  <Link
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/book.pdf"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-blue-600 underline"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Upload File
                </label>
                <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                  />
                  <div className="space-y-3 pointer-events-none flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-700">
                        Click to upload file
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                    {formData.fileUrl && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                        <CheckCircle size={12} /> File selected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Author Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Author
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                />
              </div>
              {/* Year Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Year
                </label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
              {editingItem ? "Update Resource" : "Add Resource"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
