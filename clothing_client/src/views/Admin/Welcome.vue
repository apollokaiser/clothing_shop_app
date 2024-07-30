<template>
  <div class="admin-change-display">
    <div class="background"></div>
    <div class="change-role-container">
      <div class="change-role-header">
        <h1>CHÀO MỪNG TRỞ LẠI</h1>
        <p>Bạn muốn truy cập với tư cách :</p>
        <div class="profiles">
          <div @click="accessPending(false)" class="profile-detail">
            <div class="profile-detail-img">
              <img src="/images/amongus-pink.png" alt="" />
            </div>
            <div>Người dùng</div>
          </div>
          <div @click="accessPending(true)" class="profile-detail">
            <div class="profile-detail-img">
              <img src="/images/amongus-pink.png" alt="" />
            </div>
            <div>Người quản lý</div>
          </div>
        </div>
      </div>
      <div class="profiles-img">
        <img src="/images/security.png" alt="" />
      </div>
    </div>
    <section v-if="requestPending" class="dots-container">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </section>
  </div>
</template>
<style scoped>
.admin-change-display {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: monospace, serif;
  position: relative;
}
.background {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  background-color: #ffd451;
  z-index: -100;
}
.background::before {
  position: absolute;
  content: "";
  top: -35px;
  left: 0;
  width: 100%;
  height: 35px;
  background: url("/images/bg_yellow.png");
  background-size: contain;
  background-repeat: repeat;
  z-index: -100;
}
.change-role-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-role-header {
  animation: slide-in 0.7s linear backwards;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(200%);
  }
  100% {
    opacity: 1;
    transform: translatex(0%);
  }
}
.change-role-container .profiles-img {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  margin-left: 30px;
  animation: fade 0.6s linear backwards;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.profiles {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.profile-detail {
  width: 160px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.profile-detail-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  padding: 5px 7px;
  transition: all 0.3s linear;
}
.profiles .profile-detail > div {
  transition: all 0.3 linear;
}
.profile-detail:hover .profile-detail-img {
  transform: scale(1.1);
}
.profile-detail:hover > div:last-child {
  transform: scale(0.9);
}
.profile-detail:active {
  transform: scale(1.05);
}
.dots-container {
  position: fixed;
  top: 0;
  left:0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index:999;
}

.dot {
  height: 20px;
  width: 20px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: #b3d4fc;
  animation: pulse 1.5s infinite ease-in-out;
}

.dot:last-child {
  margin-right: 0;
}

.dot:nth-child(1) {
  animation-delay: -0.3s;
}

.dot:nth-child(2) {
  animation-delay: -0.1s;
}

.dot:nth-child(3) {
  animation-delay: 0.1s;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    background-color: #b3d4fc;
    box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
  }

  50% {
    transform: scale(1.2);
    background-color: #6793fb;
    box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
  }

  100% {
    transform: scale(0.8);
    background-color: #b3d4fc;
    box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
  }
}
</style>

<script setup>
import { ref } from "vue";
import {useRouter} from 'vue-router'
const router = useRouter();
const requestPending = ref(false);
const accessPending = (admin=false) => {
  requestPending.value = true;
  setTimeout(() => {
    requestPending.value = false;
    if (admin==true) {
      router.push({name:'content'})
    } else {
      router.push("/")
    }
  }, 2000);
};
</script>
