import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAdmin } from '../features/auth/authSlice';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { admin } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const [isAdding, setIsAdding] = useState(false);

    // Fetch users function
    const fetchUsers = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${admin.token}` }
            };
            const url = search ? `http://localhost:5000/api/admin/users?search=${search}` : 'http://localhost:5000/api/admin/users';
            const res = await axios.get(url, config);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (!admin) {
            navigate('/admin');
        } else {
            fetchUsers();
        }
    }, [admin, search, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${admin.token}` } };
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
                fetchUsers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setEditFormData({ name: user.name, email: user.email });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSaveEdit = async (id) => {
        // Basic Validation
        if (!editFormData.name.trim() || !editFormData.email.trim()) {
            return alert('Name and Email are required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editFormData.email)) {
            return alert('Please enter a valid email address');
        }
        try {
            const config = { headers: { Authorization: `Bearer ${admin.token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${id}`, editFormData, config);
            setEditingId(null);
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert('Error updating user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
            return alert('Please fill in all fields');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            return alert('Please enter a valid email address');
        }

        if (newUser.password.length < 6) {
            return alert('Password must be at least 6 characters');
        }
        try {
            const config = { headers: { Authorization: `Bearer ${admin.token}` } };
            await axios.post('http://localhost:5000/api/admin/users', newUser, config);
            setNewUser({ name: '', email: '', password: '' });
            setIsAdding(false);
            fetchUsers();
            alert('User added successfully');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error adding user');
        }
    };

    return (
        <div className="container mt-20">
            <header className="header">
                <h1>Admin Dashboard</h1>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn">Search</button>
                    </form>
                    <button className="btn" onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Close' : 'Add User'}
                    </button>
                    <button className="btn btn-reverse" onClick={() => { dispatch(logoutAdmin()); navigate('/admin'); }}>Logout</button>
                </div>
            </header>

            {isAdding && (
                <div className="card mb-20">
                    <h2>Add New User</h2>
                    <form onSubmit={handleAddUser}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-block">Create User</button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr key={u._id}>
                                <td>{i + 1}</td>
                                <td>
                                    {editingId === u._id ? (
                                        <input
                                            className="form-control"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        />
                                    ) : (
                                        u.name
                                    )}
                                </td>
                                <td>
                                    {editingId === u._id ? (
                                        <input
                                            className="form-control"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        />
                                    ) : (
                                        u.email
                                    )}
                                </td>
                                <td>
                                    {editingId === u._id ? (
                                        <div className="btn-group">
                                            <button className="btn btn-small" onClick={() => handleSaveEdit(u._id)}>Save</button>
                                            <button className="btn btn-reverse btn-small" onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="btn-group">
                                            <button className="btn btn-small" onClick={() => handleEdit(u)}>Edit</button>
                                            <button className="btn btn-danger btn-small" onClick={() => handleDelete(u._id)}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
