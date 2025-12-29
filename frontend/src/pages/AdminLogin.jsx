import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, reset } from '../features/auth/authSlice';

function AdminLogin() {
    const [localError, setLocalError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            // Error handled in UI
        }

        if (isSuccess && user && user.isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(reset());
        }
    }, [dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        const userData = {
            email,
            password,
        };

        dispatch(loginAdmin(userData));
    };

    return (
        <div className='form-container'>
            <section className='heading'>
                <h1>Admin Login</h1>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Enter admin email'
                            onChange={onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Enter admin password'
                            onChange={onChange}
                        />
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block' disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login as Admin'}
                        </button>
                    </div>
                    {localError && <div className='alert-error'>{localError}</div>}
                    {isError && !localError && <div className='alert-error'>{message}</div>}
                </form>
            </section>
        </div>
    );
}

export default AdminLogin;
