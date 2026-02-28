import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAdmin } from '../features/auth/authSlice';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function AdminDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { admin } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const {
        register,
        handleSubmit,
        reset: resetAddUserForm,
        formState: { errors },
    } = useForm();

    const {
        register: registerEdit,
        handleSubmit: handleEditSubmit,
        reset: resetEditForm,
        formState: { errors: editErrors },
    } = useForm();

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
        resetEditForm({ name: user.name, email: user.email });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const onSubmitEditUser = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${admin.token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${editingId}`, data, config);
            setEditingId(null);
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert('Error updating user');
        }
    };

    const onSubmitAddUser = async (data) => {
        try {
            const config = { headers: { Authorization: `Bearer ${admin.token}` } };
            await axios.post('http://localhost:5000/api/admin/users', data, config);
            resetAddUserForm();
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
                    <form onSubmit={handleSubmit(onSubmitAddUser)}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className={errors.name ? 'form-control input-error' : 'form-control'}
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className='error-text'>{errors.name.message}</p>}
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className={errors.email ? 'form-control input-error' : 'form-control'}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {errors.email && <p className='error-text'>{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className={errors.password ? 'form-control input-error' : 'form-control'}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                                        message: 'Password must contain at least one letter and one number',
                                    },
                                })}
                            />
                            {errors.password && <p className='error-text'>{errors.password.message}</p>}
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
                                {editingId === u._id ? (
                                    <td colSpan="3">
                                        <form onSubmit={handleEditSubmit(onSubmitEditUser)} style={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: '10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    className={editErrors.name ? 'form-control input-error' : 'form-control'}
                                                    {...registerEdit('name', { required: 'Name is required' })}
                                                />
                                                {editErrors.name && <p className='error-text'>{editErrors.name.message}</p>}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    className={editErrors.email ? 'form-control input-error' : 'form-control'}
                                                    {...registerEdit('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Invalid email',
                                                        },
                                                    })}
                                                />
                                                {editErrors.email && <p className='error-text'>{editErrors.email.message}</p>}
                                            </div>
                                            <div className="btn-group" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                <button type="submit" className="btn btn-small">Save</button>
                                                <button type="button" className="btn btn-reverse btn-small" onClick={handleCancelEdit}>Cancel</button>
                                            </div>
                                        </form>
                                    </td>
                                ) : (
                                    <>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-small" onClick={() => handleEdit(u)}>Edit</button>
                                                <button type="button" className="btn btn-danger btn-small" onClick={() => handleDelete(u._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
