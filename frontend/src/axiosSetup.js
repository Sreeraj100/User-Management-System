import axios from 'axios';
import { store } from './app/store';
import { logout, logoutAdmin } from './features/auth/authSlice';

export const setupInterceptors = () => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 401) {
                const requestUrl = error.config && error.config.url;

                // Check URL to decide which session to logout based on the API route
                if (requestUrl && requestUrl.includes('/admin')) {
                    store.dispatch(logoutAdmin());
                } else {
                    store.dispatch(logout());
                }
            }
            return Promise.reject(error);
        }
    );
};
