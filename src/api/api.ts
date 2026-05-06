import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import auth from '@react-native-firebase/auth';
import { BASE_URL, BASE_URL_TWO } from '@env';

const apiClient = axios.create({
  baseURL: BASE_URL_TWO,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attaches Firebase ID token as Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken();
      console.log("Firebase Token: ", token);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('Unauthorized — token may have expired.');
    } else if (status === 403) {
      console.warn('Forbidden — insufficient permissions.');
    } else if (status !== undefined && status >= 500) {
      console.error('Server error:', error.response?.data);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
