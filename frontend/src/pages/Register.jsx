import { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { register as registerUser, reset } from '../features/auth/authSlice'; // Renamed register to avoid conflict

function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess || user) {
            navigate('/dashboard');
        }
    }, [user, isSuccess]);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const onSubmit = (data) => {
        dispatch(registerUser(data));
    };

    return (
        <div className='form-container'>
            <section className='heading'>
                <h1>Create an Account</h1>
                <p>Register to get started</p>
            </section>

            <section className='form'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            className={errors.name ? 'form-control input-error' : 'form-control'}
                            id='name'
                            placeholder='Enter your name'
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className='error-text'>{errors.name.message}</p>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            className={errors.email ? 'form-control input-error' : 'form-control'}
                            id='email'
                            placeholder='Enter your email'
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

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={errors.password ? 'form-control input-error' : 'form-control'}
                                id='password'
                                placeholder='Enter password'
                                style={{ paddingRight: '40px' }}
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
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                {showPassword ? <FaRegEyeSlash size={20} color="#777" /> : <FaRegEye size={20} color="#777" />}
                            </span>
                        </div>
                        {errors.password && <p className='error-text'>{errors.password.message}</p>}
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block' disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                </form>

                {isError && <div className='alert-error'>{message}</div>}

                <div className='form-footer'>
                    <p>
                        Already have an account? <Link to='/login'>Login</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Register;
