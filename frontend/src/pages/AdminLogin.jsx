import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginAdmin, reset } from '../features/auth/authSlice';

function AdminLogin() {
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
        if (isSuccess && user && user.isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [user, isSuccess]);

    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const onSubmit = (data) => {
        dispatch(loginAdmin(data));
    };

    return (
        <div className='form-container'>
            <section className='heading'>
                <h1>Admin Login</h1>
                <p>Sign in to manage users</p>
            </section>

            <section className='form'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            className={errors.email ? 'form-control input-error' : 'form-control'}
                            id='email'
                            placeholder='Enter admin email'
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
                            placeholder='Enter admin password'
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className='error-text'>{errors.password.message}</p>}
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block' disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login as Admin'}
                        </button>
                    </div>
                </form>

                {isError && <div className='alert-error'>{message}</div>}
            </section>
        </div>
    );
}

export default AdminLogin;
