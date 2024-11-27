import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.response.use(null, async (error) => {
    if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        if (retryAfter) {
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return axiosInstance(error.config);
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;
