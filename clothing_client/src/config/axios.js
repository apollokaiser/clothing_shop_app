
import axios from 'axios';
import { authStore } from '@/stores/user.store';
import { storeToRefs } from 'pinia';




const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000,
});
instance.interceptors.request.use((config) => {
  const auth = authStore();
  const { accessToken } = storeToRefs(auth);
  if (accessToken.value)
    config.headers.Authorization = `Bearer ${accessToken.value}`;
  return config;
});
let isRun = false;
instance.interceptors.response.use(async (response) => {
  const data = response.data;
  if (data.status !=401) return response;
  if (data.status === 401 && !isRun) {
    if(!isRun) isRun = true;
    const auth = authStore();
    const { accessToken } = storeToRefs(auth);
    try {
      const result = await auth.refreshTokenRequest();
      if (result) {
        // Lấy được token mới, thực hiện lại request
        const config = response.config;
        config.headers.Authorization = 'Bearer ' + accessToken.value;
        config.baseURL = "http://localhost:8080/api";
        return instance(config);
      } else {
        console.log("expired refresh token....");
        // Không thể lấy lại access token, đăng xuất
        auth.logout();
        return Promise.reject({ status: 401, message: "Access token cannot refresh anymore! Please login again" });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}, (error) => {
  return Promise.reject(error);
});
export default instance;