import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const AdminVectorImage = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    state: '',
    image: null
  });
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all states
  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/state/getAllStatesAdmin`);
      setStates(response.data?.data || []);
      setTotalPages(Math.ceil((response.data?.total || 0) / limit));
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error(error.response?.data?.message || 'Failed to load states');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, [page]);

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

  // Create new state
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.state.trim()) {
      toast.error('State name is required');
      return;
    }
    if (!formData.image) {
      toast.error('Image is required');
      return;
    }

    setActionLoading('create');
    try {
      const data = new FormData();
      data.append('state', formData.state);
      data.append('image', formData.image);

      await axiosInstance.post('/api/state/createState', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('State created successfully');
      setShowModal(false);
      resetForm();
      fetchStates();
    } catch (error) {
      console.error('Error creating state:', error);
      toast.error(error.response?.data?.message || 'Failed to create state');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete state
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this state?')) return;

    setActionLoading(`delete-${id}`);
    try {
      await axiosInstance.delete(`/api/state/deleteState?id=${id}`);
      toast.success('State deleted successfully');
      fetchStates();
    } catch (error) {
      console.error('Error deleting state:', error);
      toast.error(error.response?.data?.message || 'Failed to delete state');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (id, currentStatus) => {
    setActionLoading(`toggle-${id}`);
    try {
      await axiosInstance.put('/api/state/updateStateActiveStatus', {
        id: id,
        active: !currentStatus
      });
      toast.success(`State ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchStates();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ state: '', image: null });
    setImagePreview(null);
    setCurrentId(null);
    setEditMode(false);
  };

  // Open modal for create/edit
  const openModal = (stateData = null) => {
    if (stateData) {
      setEditMode(true);
      setCurrentId(stateData.id);
      setFormData({ state: stateData.state, image: null });
      setImagePreview(stateData.imageUrl);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">State Management</h1>
            <p className="text-gray-600 mt-2">Manage states with vector images</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add State
          </button>
        </div>

        {/* States Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : states.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No states found</p>
              <button
                onClick={() => openModal()}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create your first state
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Image</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">State Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {states.map((state) => (
                  <tr key={state._id} className="hover:bg-gray-50 transition-colors">
                    {/* Image Column */}
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-16">
                        <img
                          src={state.image.url}
                          alt={state.state}
                          className={`w-full h-full object-cover rounded-lg border-2 transition-all duration-300 ${
                            !state.active ? 'grayscale opacity-50 border-gray-300' : 'border-emerald-200'
                          }`}
                        />
                        {!state.active && (
                          <div className="absolute inset-0 bg-gray-900/30 rounded-lg flex items-center justify-center">
                            <X className="w-8 h-8 text-white opacity-80" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* State Name Column */}
                    <td className="py-4 px-6">
                      <span className={`font-medium text-base ${
                        state.active ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {state.state}
                      </span>
                    </td>

                    {/* Status Toggle Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(state._id, state.active)}
                          disabled={actionLoading === `toggle-${state._id}`}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            state.active ? 'bg-emerald-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                              state.active ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        
                        {actionLoading === `toggle-${state._id}` ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <span className={`text-sm font-medium ${
                            state.active ? 'text-emerald-700' : 'text-gray-500'
                          }`}>
                            {state.active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(state._id)}
                          disabled={actionLoading === `delete-${state._id}`}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete State"
                        >
                          {actionLoading === `delete-${state._id}` ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? 'Edit State' : 'Add New State'}
              </h2>
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
              {/* State Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g., Karnataka, Maharashtra"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, SVG up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!editMode}
                    />
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
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
                    'Create State'
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

export default AdminVectorImage;
