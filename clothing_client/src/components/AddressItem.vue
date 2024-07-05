<template>
    <div class="address-item">
        <div class="address-content">
          <div class="address-img">
            <img src="/images/address-house.png" alt="" />
          </div>
          <div class="address-info">
            <div class="name">{{props.address.tenDiaChi}}
              <span v-if="props.address.isDefault" class="default-address ms-2">mặc định</span>
            </div>
            <div class="address-text">{{props.address.diaChi}}</div>
          </div>
        </div>
        <div class="change-address-btn">
          <svg
          @click="toggleAction"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"
            ></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
        </div>
        <Transition name="slide-in">
        <div v-if="action.showUpdate" class="address-action">
              <div @click="setDefault" class="set-default">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/></svg>
                <span>Mặc định</span>
              </div>
              <div @click="deleteAddress" class="delete-address">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                <span>Xóa</span>
              </div>
              <div class="update-address">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                <span>Cập nhật</span>
              </div>
              <div @click="toggleAction" class="cancel-action">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
        </div>
        </Transition>
      </div>
</template>
<style scoped>
.slide-in-leave-active {
  transition: transform 0.5s ease;
}
.slide-in-enter-active {
  transition: transform 1s ease;
}
.slide-in-enter {
  transform: translateX(100%);
}
.slide-in-leave-to {
  transform: translateX(100%);
}
.address-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  margin-bottom: 10px;
  overflow: hidden;
}
.address-item .address-action {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ee58a6;
  color: white;
  z-index:100;
  gap:20px;
}
.address-action svg{
  width: 24px;
  height: 24px;
  fill: white;
  margin-right: 5px;
}
.address-action>div{
  cursor: pointer;
  transition: all -.3s ease;
}
.address-action>div:hover{
  color: rebeccapurple;
}
.address-item .address-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #3f9efd;
}
.address-content {
  width: 70%;
}
.address-content > div {
  display: inline-block;
  margin-right: 10px;
  vertical-align: center;
}
.address-info .name {
  font-weight: bold;
  font-size: 17px;
}
.address-info .address-text {
  font-style: italic;
  font-size: 14px;
}
svg {
  cursor: pointer;
  fill: coral;
}
.default-address {
  display: inline-block;
  padding: 1px 4px;
  border:1px solid #ff1f1f;
  color: #ff1f1f;
  border-radius: 5px;
  font-weight: initial;
  font-family: monospace;
}

</style>

<script setup>
import { reactive, watch } from 'vue';
import { authStore } from '@/stores/user.store';
const auth = authStore();
    const props =  defineProps({
        address: {
            type: Object,
            required: true
        }
    })
    const action = reactive({
      showMessage:false,
      success:false,
      message:"",
      showUpdate:false
    })
   const emit =  defineEmits(["showMessage"])
    const toggleAction = () => {
      action.showUpdate =!action.showUpdate;
    }
    const deleteAddress = ()=>{
      auth.deleteUserAddress(props.address.id).then(result=> {
        if(result) {
          action.success = true;
          action.message = "Xóa địa chỉ thành công"
          action.showMessage = true;
        } else {
          action.success = false;
          action.message = "Đổi địa chỉ thất bại"
          action.showMessage = true;
        }
      })
    }
    const setDefault = ()=>{
      let setDefault = null;
      if(props.address.isDefault)
        setDefault = false;
      else setDefault = true;
      auth.setDefaultAddress(props.address.id, setDefault).then(result=> {
        if(result) {
          action.success = true;
          action.message = "Đổi mặc định thành công"
          action.showMessage = true;

        } else {
          action.success = false;
          action.message = "Đổi mặc định thất bại"
          action.showMessage = true;
        }
      })
    }
    watch(action, value =>{
      if(value.showMessage){
        console.log("emit-here ....");
       emit('showMessage', value)
      }
    },
    {
      deep: true,
      immediate:true
    })
</script>