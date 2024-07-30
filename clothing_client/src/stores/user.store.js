import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { decode } from '@/auth.function/JwtDecoder';
import { login, refreshAccessToken, getInfo, googleSignIn, updateUser } from '@/auth.function/auth';
import { addAddress, deleteAddress, setDefault, editAddress } from '@/data.function/postData';
import { ROLES } from '@/utils/constant';
import { useRouter } from 'vue-router';
export const authStore = defineStore("authStore", () => {
    const user = ref({
        uid: null,
        email: null,
        name: null,
        phone: null,
        address: [],
        isNew: false,
        scope: [],
        gioHangs: 0,
        taiKhoan: ""
    })
    const router = useRouter();
    const isLoggedIn = ref(false);
    const loginRequest = ref(false);
    const showMsg = ref(false);
    const accessToken = ref(localStorage.getItem("accessToken"));
    const refreshToken = ref(localStorage.getItem("refreshToken"));
    watch(accessToken, (value) => {
        if (!value) {
            localStorage.removeItem("accessToken");
        } else {
            localStorage.setItem("accessToken", value);
        }
    })
    watch(refreshToken, (value) => {
        if (!value) {
            isLoggedIn.value = false;
            loginRequest.value = false;
            user.value = {
                uid: "",
                email: "",
                name: "",
                phone: "",
                address: [],
                isNew: false
            };
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("CART_")
        } else {
            localStorage.setItem("refreshToken", value);
        }
    })
    watch(isLoggedIn, () => {
        getUserInfo().then()
    })
    const updateUserInfo = async (updateInfo) => {
        const response = await updateUser(user.value.email, updateInfo.name, updateInfo.phone);
        if (response && response.status == 200) {
            accessToken.value = response.data.access_token;
            localStorage.setItem("accessToken", accessToken.value);
            if (updateInfo.name && updateInfo.name != "" && updateInfo.phone != user.value.name) {
                user.value.name = updateInfo.name;
            }
            if (updateInfo.phone && updateInfo.phone != "" && updateInfo.phone != user.value.phone) {
                user.value.phone = updateInfo.phone;
            }
            return true;
        } else return false;
    }
    const isAdmin = computed(() => {
        if (user.value.uid != null && user.value.uid != "") {
            return user.value.scope.includes(ROLES.ADMIN)
        }
        return false;
    })
    const getUser = () => {
        if (!accessToken.value) return;
        const claims = decode(accessToken.value);
        if (claims && claims != 999) {
            user.value.uid = claims.uid;
            user.value.email = claims.sub;
            user.value.name = claims.name || null;
            user.value.scope = claims.scope.split(" ");
            isLoggedIn.value = true;
        }
        else { //access token is not valid or expired
            refreshTokenRequest().then(result => result)
        }
    }
    const getUserInfo = async () => {
        if (!user.value.uid) return;
        const response = await getInfo(user.value.uid);
        if (response && response.status === 200) {
            user.value.phone = response.data.user_info.sdt || "Không có";
            user.value.address = response.data.user_info.diaChis;
            user.value.isNew = response.data.user_info.khachMoi;
            user.value.gioHangs = response.data.user_info.gioHangs;
            user.value.taiKhoan = response.data.user_info.taiKhoan;
        }
    }
    const loginWithAccount = async (userInfo) => {
        const response = await login(userInfo);
        if (response && response.status === 200) {
            accessToken.value = response.data.access_token;
            refreshToken.value = response.data.refresh_token;
            //TODO: optimize here
            user.value.email = userInfo.email;
            let claims = decode(accessToken.value);
            user.value.name = claims.name || null;
            user.value.uid = claims.uid;
            user.value.scope = claims.scope.split(" ");
            isLoggedIn.value = true;
            loginRequest.value = false;
            showMsg.value = true;
            setTimeout(() => {
                showMsg.value = false;
                if (user.value.scope.includes(ROLES.ADMIN)) {
                    router.push("/chuyen-doi-tai-khoan");
                }
            }, 2000);
            return true;
        } else return response;
    }
    const signInGoogle = async (code) => {
        const response = await googleSignIn(code);
        if (response && response.status === 200) {
            accessToken.value = response.data.access_token;
            refreshToken.value = response.data.refresh_token;
            let claims = decode(accessToken.value);
            user.value.email = claims.sub;
            user.value.name = claims.name;
            user.value.uid = claims.uid;
            user.value.scope = claims.scope.split(" ");
            isLoggedIn.value = true;
            loginRequest.value = false;
            showMsg.value = true;
            setTimeout(() => {
                showMsg.value = false;
            }, 2000);
            return true;
        }
        else return response;
    }
    const logout = () => {
        accessToken.value = null;
        refreshToken.value = null;
    }
    const refreshTokenRequest = async () => {
        const currentTimeMillis = Date.now();
        const currentTimeSeconds = Math.floor(currentTimeMillis / 1000);
        if (refreshToken.value && refreshToken.value.split('-').reverse().at(0) > currentTimeSeconds) {
            const response = await refreshAccessToken(refreshToken.value);
            if (response && response.status === 200) {
                accessToken.value = response.data.access_token;
                let claims = decode(accessToken.value);
                user.value.uid = claims.uid;
                user.value.email = claims.sub;
                user.value.name = claims.name || null;
                user.value.scope = claims.scope.split(" ");
                isLoggedIn.value = true;
                localStorage.setItem("accessToken", accessToken.value);
                return true;
            } else {
                logout();
                return false;
            }
        }
    }
    const addNewAddress = async (address) => {
        const response = await addAddress(address);
        if (response && response.status == 200) {
            if (address.isDefault)
                user.value.address.forEach(item => item.isDefault = false);
            user.value.address.push(response.data.address);
            return true;
        } else return false;
    }
    const updateAdress = async (address) => {
        let info = {
            id: address.id,
            name: address.tenDiaChi,
            address: address.diaChi,
            isDefault: address.isDefault,
            provinceId: address.detail.provinceId,
            districtId: address.detail.districtId,
            wardId: address.detail.wardId
        }
        const response = await editAddress(info);
        if (response && response.status == 200) {
            let index = user.value.address.findIndex(item=> item.id ===info.id);
            if(index !=-1) {
                user.value.address[index] = address;
            }
            if (address.isDefault){
                user.value.address.forEach(item => {
                    if(item.id != info.id)
                    item.isDefault = false
                });
            }
            user.value.address.forEach(item => {
                if (item.id == address.id) item.isDefault = address.isDefault;
            })
            return true;
        } else return false;
    }
    const deleteUserAddress = async (id) => {
        const response = await deleteAddress(id);
        if (response) {
            user.value.address = user.value.address.filter(item => item.id != id);
            return true;
        } else return false;
    }
    const setDefaultAddress = async (id, defauValue) => {
        const response = await setDefault(id, defauValue);
        if (response) {
            if (defauValue)
                user.value.address.forEach(item => item.isDefault = item.id == id ? defauValue : false);
            else
                user.value.address.forEach(item => {
                    if (item.id == id) item.isDefault = defauValue;
                })
            return true;
        } else return false;
    }
    return {
        user,
        isLoggedIn,
        loginRequest,
        accessToken,
        refreshToken,
        updateUserInfo,
        isAdmin,
        showMsg,
        loginWithAccount,
        logout,
        signInGoogle,
        refreshTokenRequest,
        getUser,
        getUserInfo,
        addNewAddress,
        deleteUserAddress,
        setDefaultAddress,
        updateAdress
    }

})