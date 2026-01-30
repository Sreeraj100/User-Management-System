import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const [isAdding, setIsAdding] = useState(false);

    // ... (existing functions)

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
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
                    <button className="btn btn-reverse" onClick={() => { dispatch(logout()); navigate('/admin'); }}>Logout</button>
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
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
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
