import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, FolderTree, X } from 'lucide-react';
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
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
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
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      !category.active ? 'grayscale opacity-50' : ''
                    }`}
                  />
                  {/* Inactive Overlay */}
                  {!category.active && (
                    <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
                      <X className="w-12 h-12 text-white opacity-80" />
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-3 truncate ${
                    category.active ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {category.category}
                  </h3>

                  {/* Toggle Switch */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${
                      category.active ? 'text-emerald-700' : 'text-gray-500'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                    
                    <button
                      onClick={() => handleToggleStatus(category._id, category.active)}
                      disabled={actionLoading === `toggle-${category._id}`}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        category.active ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                          category.active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    
                    {actionLoading === `toggle-${category._id}` && (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-2" />
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={actionLoading === `delete-${category._id}`}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Category"
                  >
                    {actionLoading === `delete-${category._id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g., Beach, Mountains, Desert"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-56 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
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
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  {actionLoading === 'create' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Category</span>
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
