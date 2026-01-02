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
    const [editFormData, setEditFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchUsers();
    }, [user]);

    const fetchUsers = async (searchTerm = '') => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const url = searchTerm ? `http://localhost:5000/api/admin/users?search=${searchTerm}` : 'http://localhost:5000/api/admin/users';
            const res = await axios.get(url, config);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(search);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
                fetchUsers(search);
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
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${id}`, editFormData, config);
            setEditingId(null);
            fetchUsers(search);
        } catch (error) {
            console.error(error);
            alert('Error updating user');
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-search">Search</button>
                    </form>
                    <button className="btn btn-logout" onClick={() => { dispatch(logout()); navigate('/admin'); }}>Logout</button>
                </div>
            </header>

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
                    {users.map((u,i) => (
                        <tr key={u._id}>
                            <td>{i}</td>
                            <td>
                                {editingId === u._id ? (
                                    <input
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
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    />
                                ) : (
                                    u.email
                                )}
                            </td>
                            <td>
                                {editingId === u._id ? (
                                    <>
                                        <button className="btn btn-save-sm" onClick={() => handleSaveEdit(u._id)}>Save</button>
                                        <button className="btn btn-cancel-sm" onClick={handleCancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-edit-sm" onClick={() => handleEdit(u)}>Edit</button>
                                        <button className="btn btn-delete-sm" onClick={() => handleDelete(u._id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
