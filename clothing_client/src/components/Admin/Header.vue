<template>
    <div class="admin-header">
    <div class="admin-header-container container">
        <div class="admin-brand-name">
        <span>ÁNH DƯƠNG STORE</span>
        </div>
        <div class="admin-quick-action">
            <div class="home-link">
        <Link to="/admin/" v-bind="$attrs" class="d-flex flex-column justify-content-center align-items-center" exact-active-class="active" inactive-class="inactive">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>
                <span>Trang chính</span>
        </Link>
            </div>
            <div class="report">
        <Link :to="{name:'report'}" v-bind="$attrs" exact-active-class="active" inactive-class="inactive" class="d-flex flex-column justify-content-center align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                <span>Báo cáo</span>
        </Link>
            </div>
            <div class="product">
            <Link :to="{name:'admin-product-list'}" v-bind="$attrs" exact-active-class="active" inactive-class="inactive" class="d-flex flex-column justify-content-center align-items-center"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0"/></svg>
                <span>Trang phục</span>
            </Link>
            </div>
            <div class="promotion">
            <Link :to="{name:'admin-promotion'}" v-bind="$attrs" exact-active-class="active" inactive-class="inactive" class="d-flex flex-column justify-content-center align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                <span>Khuyến mãi</span>
            </Link>
            </div>
            <div class="promotion">
            <Link :to="{name:'staff-list'}" v-bind="$attrs" exact-active-class="active" inactive-class="inactive" class="d-flex flex-column justify-content-center align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Nhân viên</span>
            </Link>
            </div>
        </div>
        <div class="admin-notice-bar">
            <div class="admin-account">
                <div class="admin-account-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div class="account-action">
                    <ul>
                        <li>Tài khoản</li>
                        <li @click="logout">Đăng xuất 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
    </div>
    </div>
</template>
<style lang="css" scoped>
.active span{
    color: orange;
    position: relative;
    
}
.active span::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: orange;
    animation: float-linear infinite linear 5s  ;
}
@keyframes float-linear{
    0% {
        width: 0%;
    } 50%{
        width: 100%;
    } 100%{
        width: 0%;
    }
}

.active svg{
    fill: orange;
}

    .admin-header {
        display: flex;
        justify-content:space-between;
        align-content: center;
        width: 100%;
        height: 100px;
        background-color: #567086;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
        padding:10px;
    }
    .admin-header-container {
        display: flex;
        justify-content:space-between;
        align-content: baseline;
        flex-wrap: wrap;
        padding:10px;
    }
    .admin-brand-name {
        font-size:25px;
        font-weight: bold;
        color: #fff;
        text-transform: uppercase;
        width: 250px;
    }
    .admin-quick-action {
        width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .admin-quick-action>div{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding:10px;
        color: #fff;
        border: none;
        cursor: pointer;
        margin-right: 10px;
        font-weight: bold;
        font-size: 16px;
        font-family: monospace;
    }
    .admin-notice-bar {
        margin-right: 20px;
        width: 10%;
        gap:20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .admin-notice-bar>div {
        cursor: pointer;
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
        background-color:#567086;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
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
import Link from "../Link.vue";
import { useRouter } from "vue-router";
const router = useRouter()
const auth = authStore()
const logout = ()=>{
    auth.logout();
    router.push("/")

}

</script>