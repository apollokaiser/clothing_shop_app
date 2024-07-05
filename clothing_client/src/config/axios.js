
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

instance.interceptors.response.use((response) =>{
    const data = response.data;
    console.log(response);
    if(data.status === 200) return response;
    if(data.status == 401){
      const auth = authStore();
      const {accessToken} = storeToRefs(auth);
      auth.refreshTokenRequest().then(result =>{
        if(result) {
          //lấy được --> thực hiện lại request
          const config  = response.config;
          config.headers.Authorization = 'Bearer'+ accessToken.value;
          config.baseURL = "http://localhost:8080/api";
          return instance(config);
        } else {
          console.log("expired refresh token....");
          //không thể lấy lại access token ==> login lại
          auth.logout();
          return {status: 401, message: "acess token cannot refresh anymore! Plese login again"}
        }
      })
    }
    return response;

  }, (error)=>error)

export default instance;