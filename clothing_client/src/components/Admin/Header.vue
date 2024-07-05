<template>
    <div class="admin-header">
        <div class="admin-quick-action">
            <div class="create-payment">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                <span>Đặt cọc</span>
                </button>
                <button v-if="updatePromotion" data-bs-toggle="modal" data-bs-target="#addPromotion">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                <span>Thêm khuyến mãi</span>
                </button>
            </div>
        </div>
        <div class="admin-notice-bar">
            <div class="admin-notice-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <div class="chat-box-admin">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <div class="admin-account">
                <div class="admin-account-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div class="account-action">
                    <ul>
                        <li>Tài khoản</li>
                        <li>Đăng xuất 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9l6 6-6 6"/><path d="M4 4v7a4 4 0 0 0 4 4h11"/></svg>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <AddPromotion v-if="updatePromotion"></AddPromotion>
    </div>
</template>
<style lang="css" scoped>
    .admin-header {
        display: flex;
        justify-content:space-between;
        align-content: center;
        width: 100%;
        height: 100px;
        border-bottom: 1px solid #ccc;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
        padding:10px;
    }
    .admin-quick-action,
    .admin-notice-bar {
        width: 50%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .admin-notice-bar {
        margin-right: 20px;
        gap:20px;
        justify-content: flex-end;
    }
    .admin-notice-bar>div {
        cursor: pointer;
    }
    .create-payment button {
        padding:10px;
        background-color: #4caf50;
        color: #fff;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        border-radius: 5px;
        margin-right: 10px;
        font-weight: bold;
        font-size: 16px;
    }
    .create-payment button:hover {
        background-color: #3e8e41;
    }
    .create-payment button svg {
        margin-right: 5px;
    }
    .admin-account {
        width: fit-content;
        display: flex;
        border:1px solid #ccc;
        align-items: center;
        padding: 5px;
        border-radius:50%;
        cursor: pointer;
        position: relative;
    }
    .admin-account::after {
        content: "";
        position: absolute;
        left:0;
        bottom: 0;
        height: 32px;
        width: 100%;
        transform: translateY(100%);
    }
    .account-action {
        position: absolute;
        top: 120%;
        left: 0%;
        transform: translateX(-70%);
        color: #fff;
        font-weight: 500;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #eee;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        display: none;
        width: 200px;
        height: auto;
        z-index:9999;
    }
    .admin-account:hover .account-action {
        display:block;
    }
    .admin-account .account-action ul{
        padding-left: 0;
    }
    .admin-account .account-action ul li{
        display: block;
        padding: 5px 10px;
        text-align: right;
    }
    .admin-account .account-action ul li:hover{
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>

<script setup>
import { authStore } from "@/stores/user.store";
const auth = authStore()
const {user} = storeToRefs(auth);
import { ROLES } from "@/utils/constant";
const updatePromotion = computed(()=>{
    if(user.value.scope.includes(ROLES.ADMIN)) {
        let accept_role = [ROLES.SUPER_ACCOUNT, ROLES.FULL_CONTROL, ROLES.PROMOTION_UPDATE]
        if(user.value.scope.some(role =>{
            return accept_role.includes(role)
        })){
            return true;
        } else {
            return false;
        }
    } 
    return false;
})
import AddPromotion from "./AddPromotion.vue"
import { storeToRefs } from "pinia";
import { computed } from "vue";
</script>