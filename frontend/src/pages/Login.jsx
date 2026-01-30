import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login, reset } from '../features/auth/authSlice';

function Login() {
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
            if (user && user.isAdmin) {
                navigate('/admin/dashboard');
            } else if (user) {
                navigate('/dashboard');
            }
        }
    }, [user, isSuccess]);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const onSubmit = (data) => {
        dispatch(login(data));
    };

    return (
        <div className='form-container'>
            <section className='heading'>
                <h1>Welcome Back</h1>
                <p>Login to your account</p>
            </section>

            <section className='form'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            className={errors.email ? 'form-control input-error' : 'form-control'}
                            id='email'
                            placeholder='Enter your email'
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className='error-text'>{errors.email.message}</p>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            className={errors.password ? 'form-control input-error' : 'form-control'}
                            id='password'
                            placeholder='Enter your password'
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className='error-text'>{errors.password.message}</p>}
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block' disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                {isError && <div className='alert-error'>{message}</div>}

                <div className='form-footer'>
                    <p>
                        Don't have an account? <Link to='/register'>Register</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Login;
