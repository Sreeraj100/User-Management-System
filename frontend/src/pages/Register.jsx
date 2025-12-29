import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

function Register() {
    const [localError, setLocalError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            // Error handled in UI
        }

        if (isSuccess || user) {
            navigate('/dashboard');
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

        if (!name || !email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        const userData = {
            name,
            email,
            password,
        };

        dispatch(register(userData));
    };

    return (
        <div className='form-container'>
            <section className='heading'>
                <h1>Register</h1>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='text'
                            className='form-control'
                            id='name'
                            name='name'
                            value={name}
                            placeholder='Enter your name'
                            onChange={onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Enter your email'
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
                            placeholder='Enter password'
                            onChange={onChange}
                        />
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block' disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Submit'}
                        </button>
                    </div>
                    {localError && <div className='alert-error'>{localError}</div>}
                    {isError && !localError && <div className='alert-error'>{message}</div>}
                </form>
                <p>
                    Already have an account? <Link to='/login'>Login</Link>
                </p>
            </section>
        </div>
    );
}

export default Register;
