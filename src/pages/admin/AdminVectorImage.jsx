import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
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
      toast.success(`State ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
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
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
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
                    <td className="py-4 px-6">
                      <img
                        src={state.image.url}
                        alt={state.state}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{state.state}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          state.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {state.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(state._id, state.active)}
                          disabled={actionLoading === `toggle-${state._id}`}
                          className={`p-2 rounded-lg transition-colors ${
                            state.active
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
                          }`}
                          title={state.active ? 'Disable' : 'Enable'}
                        >
                          {actionLoading === `toggle-${state.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : state.active ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(state._id)}
                          disabled={actionLoading === `delete-${state._id}`}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          {actionLoading === `delete-${state.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
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
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editMode ? 'Edit State' : 'Add New State'}
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* State Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State Name *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter state name"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
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
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading === 'create' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
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
