import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../features/auth/authSlice';
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        profileImage: ''
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchProfile();
        }
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const res = await axios.get('http://localhost:5000/api/users/me', config);
            setProfile({
                name: res.data.name,
                email: res.data.email,
                profileImage: res.data.profileImage
            });
        } catch (error) {
            console.error(error);
        }
    };

    const onLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile(); // Reset fields
        setFile(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('email', profile.email);
        if (file) {
            formData.append('profileImage', file);
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const res = await axios.put('http://localhost:5000/api/users/profile', formData, config);

            dispatch(updateUser({ ...res.data })); // Update redux state if needed (usually name/email)
            setProfile({
                name: res.data.name,
                email: res.data.email,
                profileImage: res.data.profileImage
            });
            setIsEditing(false);
            setFile(null);
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>User Dashboard</h1>
                <button className="btn btn-logout" onClick={onLogout}>Logout</button>
            </header>

            <div className="profile-card">
                <div className="profile-image-container">
                    {profile.profileImage ? (
                        <img src={`http://localhost:5000/${profile.profileImage}`} alt="Profile" className="profile-img" />
                    ) : (
                        <div className="profile-placeholder">No Image</div>
                    )}
                </div>

                {!isEditing ? (
                    <div className="profile-details">
                        <h2>{profile.name}</h2>
                        <p>{profile.email}</p>
                        <button className="btn btn-edit" onClick={handleEdit}>Edit Profile</button>
                    </div>
                ) : (
                    <form className="edit-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Image</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-save">Save</button>
                            <button type="button" className="btn btn-cancel" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
