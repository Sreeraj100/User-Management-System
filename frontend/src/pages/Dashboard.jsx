import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../features/auth/authSlice';
import axios from 'axios';
import { useForm } from 'react-hook-form';

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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
            fetchProfile();
        }
    }, [user]);

    const onLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleEdit = () => {
        setIsEditing(true);
        setValue('name', profile.name);
        setValue('email', profile.email);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFile(null);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
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

            dispatch(updateUser({ ...res.data }));
            setProfile({
                name: res.data.name,
                email: res.data.email,
                profileImage: res.data.profileImage
            });
            setIsEditing(false);
            setFile(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>User Dashboard</h1>
                <button className="btn" onClick={onLogout}>Logout</button>
            </header>

            <div className="profile-card">
                <div className="profile-image-container">
                    {profile.profileImage ? (
                        <img src={`http://localhost:5000/${profile.profileImage}`} alt="Profile" className="profile-img" />
                    ) : (
                        <div className="no-image-placeholder">
                            No Image
                        </div>
                    )}
                </div>

                {!isEditing ? (
                    <div className="profile-details">
                        <h2>{profile.name}</h2>
                        <p>{profile.email}</p>
                        <button className="btn" onClick={handleEdit}>Edit Profile</button>
                    </div>
                ) : (
                    <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
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
                            <label>Profile Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn">Save</button>
                            <button type="button" className="btn btn-reverse" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
