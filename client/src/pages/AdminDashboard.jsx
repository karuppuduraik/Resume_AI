import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserPlus, FaEdit, FaTrash, FaSearch, FaUser, FaSpinner, 
  FaCrown, FaEnvelope, FaCalendarAlt, FaTimes, FaShieldAlt 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null if creating, user object if editing
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalRole, setModalRole] = useState('');
  const [modalPremium, setModalPremium] = useState('none');
  const [modalPassword, setModalPassword] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/users?search=${search}`);
      if (res.success) {
        setUsers(res.data);
      } else {
        setError(res.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // Open modal for Creating
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setModalName('');
    setModalEmail('');
    setModalRole('user');
    setModalPremium('none');
    setModalPassword('');
    setModalError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setModalName(user.name);
    setModalEmail(user.email);
    setModalRole(user.role);
    setModalPremium(user.premiumStatus || 'none');
    setModalPassword(''); // keep blank unless updating
    setModalError('');
    setIsModalOpen(true);
  };

  // Submit Modal (Create or Edit)
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      if (editingUser) {
        // Edit flow
        const updateData = { name: modalName, email: modalEmail, role: modalRole, premiumStatus: modalPremium };
        if (modalPassword) updateData.password = modalPassword;

        const res = await api.put(`/admin/users/${editingUser._id}`, updateData);
        if (res.success) {
          setSuccess('User updated successfully!');
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setModalError(res.message || 'Failed to update user');
        }
      } else {
        // Create flow
        if (!modalPassword) {
          setModalError('Password is required for new users');
          setModalLoading(false);
          return;
        }

        const res = await api.post('/admin/users', {
          name: modalName,
          email: modalEmail,
          role: modalRole,
          premiumStatus: modalPremium,
          password: modalPassword
        });

        if (res.success) {
          setSuccess('User created successfully!');
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setModalError(res.message || 'Failed to create user');
        }
      }
    } catch (err) {
      setModalError(err.message || 'Something went wrong');
    } finally {
      setModalLoading(false);
      // Auto clear success message
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Open delete confirm
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/admin/users/${userToDelete._id}`);
      if (res.success) {
        setSuccess('User and associated data deleted successfully!');
        setIsDeleteOpen(false);
        fetchUsers();
      } else {
        setError(res.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const regularCount = totalUsers - adminCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-brandText-light dark:text-brandText-dark font-poppins flex items-center gap-2">
            <FaShieldAlt className="text-primary" /> Admin Panel
          </h1>
          <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1 font-inter">
            Monitor users, adjust system roles, and manage credentials.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto self-start"
        >
          <FaUserPlus /> Add User
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark p-6 rounded-2xl shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase">Total Users</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><FaUser /></div>
          </div>
          <span className="text-3xl font-bold text-brandText-light dark:text-brandText-dark font-poppins">{totalUsers}</span>
        </div>
        <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark p-6 rounded-2xl shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase">Administrators</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><FaCrown /></div>
          </div>
          <span className="text-3xl font-bold text-brandText-light dark:text-brandText-dark font-poppins">{adminCount}</span>
        </div>
        <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark p-6 rounded-2xl shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase">Regular Accounts</span>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600"><FaUser /></div>
          </div>
          <span className="text-3xl font-bold text-brandText-light dark:text-brandText-dark font-poppins">{regularCount}</span>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r-lg text-sm text-green-700 dark:text-green-300">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Search & Actions bar */}
      <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-4 mb-6 shadow-premium">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="premium-input pl-10 w-full"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl shadow-premium overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-brandTextSecondary-light dark:text-brandTextSecondary-dark gap-2">
            <FaSpinner className="animate-spin text-3xl text-primary" />
            <span>Loading user directory...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
            No users matched your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brandBorder-light dark:border-brandBorder-dark bg-amber-50/10 dark:bg-white/5">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark">User</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark">Email</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark">Premium</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark">Joined On</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-brandTextSecondary-light dark:text-brandTextSecondary-dark text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandBorder-light dark:divide-brandBorder-dark">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-amber-50/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {u.profilePicture || u.avatar ? (
                          <img 
                            src={u.profilePicture || u.avatar} 
                            alt={u.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-brandBorder-light dark:border-brandBorder-dark"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-brandText-light dark:text-brandText-dark flex items-center gap-1.5">
                            {u.name}
                            {u.role === 'admin' && <FaCrown className="text-amber-500 text-xs" title="Admin Account" />}
                          </div>
                          <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark">ID: {u._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brandText-light dark:text-brandText-dark font-medium">
                      <span className="flex items-center gap-1.5"><FaEnvelope className="text-xs text-brandTextSecondary-light" /> {u.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {u.premiumStatus === 'approved' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 w-fit">
                          <FaCrown className="text-[10px]" /> Premium
                        </span>
                      ) : u.premiumStatus === 'requested' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/20">
                            Pending
                          </span>
                          <button
                            onClick={async () => {
                              try {
                                const res = await api.put(`/admin/users/${u._id}`, { 
                                  name: u.name, 
                                  email: u.email, 
                                  role: u.role, 
                                  premiumStatus: 'approved' 
                                });
                                if (res.success) {
                                  setSuccess('User premium access approved!');
                                  fetchUsers();
                                }
                              } catch(e) {}
                            }}
                            className="text-xs px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer font-bold transition-colors"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                      <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-xs" /> {new Date(u.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary transition-colors duration-200 cursor-pointer"
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(u)}
                          disabled={u._id === currentUser._id}
                          className={`p-1.5 transition-colors duration-200 cursor-pointer ${
                            u._id === currentUser._id 
                              ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                              : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-red-500'
                          }`}
                          title={u._id === currentUser._id ? "You cannot delete your own account" : "Delete User"}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium transition-all">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-brandText-light"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold font-poppins text-brandText-light dark:text-brandText-dark mb-4">
              {editingUser ? 'Edit User Profile' : 'Register New User'}
            </h3>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded text-xs text-red-700 dark:text-red-300">
                {modalError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="premium-label text-xs">Full Name</label>
                <input
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="premium-input"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="premium-label text-xs">Email Address</label>
                <input
                  type="email"
                  required
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  className="premium-input"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="premium-label text-xs">System Role</label>
                <select
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value)}
                  className="premium-input"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="premium-label text-xs">Premium Membership</label>
                <select
                  value={modalPremium}
                  onChange={(e) => setModalPremium(e.target.value)}
                  className="premium-input"
                >
                  <option value="none">Standard Account</option>
                  <option value="requested">Pending Request</option>
                  <option value="approved">Approved (Premium Access)</option>
                </select>
              </div>

              <div>
                <label className="premium-label text-xs">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  className="premium-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-brandBorder-light dark:border-brandBorder-dark text-brandTextSecondary-light dark:text-brandTextSecondary-dark text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark shadow-glass flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  {modalLoading && <FaSpinner className="animate-spin text-xs" />}
                  {editingUser ? 'Save Changes' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CASCADE DELETE CONFIRM MODAL */}
      {isDeleteOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium transition-all">
            <h3 className="text-xl font-bold font-poppins text-red-500 mb-2">Warning: Cascade Deletion</h3>
            <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark mb-6 leading-relaxed">
              Are you sure you want to delete user <strong>{userToDelete.name}</strong> ({userToDelete.email})? 
              <br/><br/>
              <span className="text-red-600 dark:text-red-400 font-semibold font-poppins">
                ⚠️ THIS ACTION IS PERMANENT. Deleting this account will instantly wipe all resumes, cover letters, and ATS reports associated with this user.
              </span>
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-brandBorder-light dark:border-brandBorder-dark text-brandTextSecondary-light dark:text-brandTextSecondary-dark text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 shadow-glass flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                {deleteLoading && <FaSpinner className="animate-spin text-xs" />}
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
