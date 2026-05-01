import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ Cookie
    const token = Cookies.get('access_token');
    
    // Nếu có token, tự động gắn vào Header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: Chạy SAU KHI nhận data từ Server về
axiosInstance.interceptors.response.use(
  (response) => {
    // Chỉ lấy phần data của response cho gọn code FE
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung ở đây (vd: Token hết hạn thì tự động logout)
    if (error.response?.status === 401) {
      Cookies.remove('access_token');
      // Có thể thêm logic redirect về trang login ở đây
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;