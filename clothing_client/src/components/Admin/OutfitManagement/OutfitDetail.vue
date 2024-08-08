<template>
  <div class="outfit-news-item">
  <div v-if="props.outfit.hasOrderCount" class="has-order-signal">
  </div>
    <div class="choose-item me-2">
      <div v-if="updateOutfit" class="content">
        <label class="checkBox">
          <input v-model="checkOutfit" type="checkbox" id="ch1" />
          <div class="transition"></div>
        </label>
      </div>
    </div>
    <div class="outfit-img">
      <img
        :src="props.outfit.hinhAnhs[0]"
        alt=""
      />
    </div>
    <div class="outfit-news-description d-flex flex-column">
      <div class="outfit-id">Mã: <span>{{props.outfit.id }}</span></div>
      <Link  :to="{name:'update-outfit', params:{id:props.outfit.id}}" v-bind="$attrs">
     <span>{{ props.outfit.tenTrangPhuc }}</span>
  </Link>
    </div>
    
    <div class="outfit-new-quantity">
      <span><i v-if="!props.outfit.hasPiece">Số lượng: </i> <span>{{ quantity }}</span></span>
      <span v-if="updateOutfit" class="delete-outfit" @click="removeOutfit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="orange"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="arcs"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </span>
    </div>
  </div>
</template>
<script setup>
import Link from '@/components/Link.vue';
import { authStore } from '@/stores/user.store';
import { useAdminStore } from "@/stores/admin.store";
import { ROLES } from '@/utils/constant';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { deleteOutfit } from '@/data.function/postData';
const auth = authStore();
const admin = useAdminStore();
const { user } = storeToRefs(auth);
const {choosedOutfit} = storeToRefs(admin);
const checkOutfit = ref(false);
const emit = defineEmits(["delete"])
const deleteCommand = ref(false);
onBeforeMount(() => {
});
const props = defineProps({
  outfit:{
    type: Object,
    required: true,
  }
})
watch(choosedOutfit, value =>{
  if(value.length==0) {
    checkOutfit.value = false;
  }
  if(value.includes(props.outfit.id)) {
    checkOutfit.value = true;
  }
}, {
  deep: true,
})
watch(checkOutfit, (newValue, oldValue)=>{
  if(!oldValue && newValue && !choosedOutfit.value.includes(props.outfit.id)) {
    admin.pushOutfit(props.outfit.id);
  } else if(oldValue && !newValue && choosedOutfit.value.length) {
    admin.removeOutfit(props.outfit.id);
  }
})
watch(deleteCommand, value=>{
  if(value) {
    emit('delete', props.outfit.id)
  }
})
const quantity = computed(()=>{
  if(props.outfit.hasPiece) return "Xem thêm"
  else return props.outfit.soLuong;
})
const updateOutfit = computed(() => {
  if (user.value.scope.includes(ROLES.ADMIN)) {
    let accept_role = [
      ROLES.SUPER_ACCOUNT,
      ROLES.FULL_CONTROL,
      ROLES.OUTFIT_UPDATE,
    ];
    if (
      user.value.scope.some((role) => {
        return accept_role.includes(role);
      })
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
});
const removeOutfit =()=>{
  if(updateOutfit.value) {
    if(props.outfit.hasOrderCount >0) {
      alert("Trang phục không thể xóa")
        return ;
    }
    deleteOutfit(props.outfit.id).then(result=>{
      if(result) {
        deleteCommand.value = true;
      } else {
        alert("Xóa trang phục thất bại")
      }
    })
  } else {
    alert("Vì 1 lý do nào đó mà bạn không có quyền xóa trang phục này")
  }
}
</script>
<style scoped>
.outfit-news-item {
  width: 100%;
  display: flex;
  min-height: 120px;
  justify-content: space-between;
  align-items: center;
  background-color: #50697f;
  padding: 10px;
  position:relative;
  overflow: hidden;
}
.outfit-news-item .has-order-signal{
  position: absolute;
  top: -10px;
  left: -10px;
  width:20px;
  height: 20px;
  background-color: #f44336;
  transform: rotate(-50deg);
}
.outfit-news-item a{
  display: block;
  width: 60%;
}
.outfit-img {
  min-width: 80px;
  max-width: 80px;
  height: auto;
  min-height: 90px;
  padding: 1px;
  border: 1px solid #ccc;
  margin-right: 10px;
}
.outfit-news-item p {
  margin-bottom: 0.5rem;
}
.outfit-news-description {
  display:block;
  width: 40%;
}
.outfit-news-description a span:first-child {
  color: orange;
  font-weight: bold;
  display: block;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.outfit-id {
  color: #fff !important;
  margin-bottom: 0.5rem;
}
.outfit-new-quantity {
  min-width: 170px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #fff;
}
.delete-outfit {
  margin-top: 0.5rem;
  cursor: pointer;
}
.clear {
  clear: both;
}

.checkBox {
  display: block;
  cursor: pointer;
  width: 25px;
  height: 25px;
  border: 3px solid rgba(255, 255, 255, 0);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 0px 2px #fff;
}

.checkBox div {
  width: 50px;
  height: 50px;
  background-color: #213442;
  top: -52px;
  left: -52px;
  position: absolute;
  transform: rotateZ(45deg);
  z-index: 100;
}

.checkBox input[type="checkbox"]:checked + div {
  left: -10px;
  top: -10px;
}

.checkBox input[type="checkbox"] {
  position: absolute;
  left: 50px;
  visibility: hidden;
}

.transition {
  transition: 300ms ease;
}

</style>
