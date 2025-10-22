import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, PowerOff, Loader2, FolderTree } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/category/getAllCategoriesAdmin');
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create new category
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.category.trim()) {
      toast.error('Category name is required');
      return;
    }
    if (!formData.image) {
      toast.error('Image is required');
      return;
    }

    setActionLoading('create');
    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('image', formData.image);

      await axiosInstance.post('/api/category/createCategory', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Category created successfully');
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setActionLoading(`delete-${id}`);
    try {
      await axiosInstance.delete(`/api/category/deleteCategory?id=${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (id, currentStatus) => {
    setActionLoading(`toggle-${id}`);
    try {
      await axiosInstance.put('/api/category/updateCategoryActiveStatus', {
        id,
        active: !currentStatus
      });
      toast.success(`Category ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchCategories();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ category: '', image: null });
    setImagePreview(null);
  };

  // Open modal
  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderTree className="w-7 h-7 md:w-8 md:h-8 text-emerald-600" />
              Category Management
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Manage trip categories with images
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No categories found</p>
            <p className="text-gray-400 text-sm mb-4">Create your first category to get started</p>
            <button
              onClick={openModal}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Category Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-full object-cover"
                  />
                  {/* Active Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        category.active
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 truncate">
                    {category.category}
                  </h3>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Toggle Status Button */}
                    <button
                      onClick={() => handleToggleStatus(category._id, category.active)}
                      disabled={actionLoading === `toggle-${category._id}`}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        category.active
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                      }`}
                      title={category.active ? 'Disable' : 'Enable'}
                    >
                      {actionLoading === `toggle-${category._id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : category.active ? (
                        <>
                          <PowerOff className="w-4 h-4" />
                          <span className="hidden sm:inline">Disable</span>
                        </>
                      ) : (
                        <>
                          <Power className="w-4 h-4" />
                          <span className="hidden sm:inline">Enable</span>
                        </>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={actionLoading === `delete-${category._id}`}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      {actionLoading === `delete-${category._id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Beach, Mountains, Desert"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-56 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading === 'create' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
