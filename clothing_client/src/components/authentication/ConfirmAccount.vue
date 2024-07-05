<template>
    <div v-if="isSuccess" class="confirm-page">
        <div class="confirm-container">
            <span class="confirm-title">Xác thực thành công !!</span>
            <p class="confirm-content">Hãy trở lại trang chính để có thể đăng nhập và trải nghiệm nào !!
            </p>
            <div class="confirm-action">
                <Link to="/"><button class="back-to-home"> Trở lại</button></Link>
            </div>
        </div>
    </div>
    <div v-if="isExpired" class="confirm-page">
        <div class="confirm-container">
            <span class="confirm-title">Xác thực thất bại !!</span>
            <p class="confirm-content">Mã xác thực đã hết hạn !! Hệ thống đã gửi mã xác thực mới ! Vui lòng thử lại !
            </p>
            <div class="confirm-action">
                <Link to="/"><button class="back-to-home"> Trở lại</button></Link>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Link from '../Link.vue';
import { activationAccount } from '@/auth.function/auth';

const route = useRoute();
const router = useRouter();

const isSuccess = ref(false);
const isExpired = ref(false);
onBeforeMount(()=>{
    if(!route.query.token || route.query.token=="")
        router.push({path:"/auth/confim/blank"})
    activationAccount(route.query.token).then(response=>{
        
        if(response.status==200){
            isSuccess.value = true;
        } else {
            isExpired.value = true;
        }
    })
})
onMounted(() => {
    console.log(route.query.token)
})
</script>

<style scoped>
.confirm-page{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 198, 230, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.confirm-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 254px;
    padding: 0 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    background: #fff;
    border-radius: 20px;
}

.confirm-container>* {
    margin: 0;
}

.confirm-title {
    font-size: 23px;
    font-weight: 900;
    color: #333;
}

.confirm-content {
    font-size: 13px;
    line-height: 18px;
    color: #333;
}

.confirm-action {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.confirm-action input {
    margin-top: 10px;
    outline: 0;
    background: rgb(255, 255, 255);
    box-shadow: transparent 0px 0px 0px 1px inset;
    padding: 0.6em;
    border-radius: 14px;
    border: 1px solid #333;
    color: black;
}

.confirm-action button {
    border: 0;
    background: #111;
    color: #fff;
    padding: 0.68em;
    border-radius: 14px;
    font-weight: bold;
}

.back-to-home:hover {
    opacity: 0.8;
}
</style>