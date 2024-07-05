import axios from "@/config/axios";

export const login = async(user)=>{
    const response = await axios.post("/auth/login", {
        email:user.email,
        password:user.password
    })
    if(response.status==200){
        if(response.data.status ==200){
            localStorage.setItem("accessToken", response.data.data.access_token)
            localStorage.setItem("refreshToken", response.data.data.refresh_token)
        }
        return response.data;
    }
    else {
        return null;
    }
}
export const register = async(user) =>{
    const response = await axios.post("/auth/register", {
        email:user.email,
        password:user.password
    })
    if(response && response.status==200){
        return response.data;
    }
    else {
        return null;
    }
}
export const activationAccount = async(token)=>{
    const response = await axios.get(`/auth/validate?token=${token}`);
    if(response && response.status==200){
        return response.data;
    } else {
        return null;
    }
}
export const refreshAccessToken = async(refreshToken) =>{
    const response = await axios.get(`/auth/refresh?token=${refreshToken}`);
    if(response && response.status === 200) {
        return response.data;
    } else return null;

}
export const getInfo = async(uid) =>{
        const response = await axios.get(`/user/info?uid=${uid}`);
        if(response.status === 200) {
            return response.data;
        } else return null;
    
}
export const googleSignIn = async (code)=>{
    const response = await axios.get(`/auth/oauth2/login/auth/google?code=${code}`);
    if(response.status === 200){
        return response.data;
    } else {
        return null;
    }
}
export const updateUser = async (email, name, phone)=>{
    const response = await axios.post("/user/change-info", {
        email,name,phone
    });
    console.log(response);
    if(response.status === 200){
        return response.data;
    } else {
        return null;
    }

}
