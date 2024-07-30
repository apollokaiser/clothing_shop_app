<template>
  <div class="promotion-admin-container container">
    <div class="promotion-content">
      <div class="promotion-wrap">
        <div class="promotion-news">
        <div class="d-flex justify-content-between align-items-center"><span>Danh sách khuyến mãi hiện có</span>
          <span @click="getAll">Xem tất cả</span>
        </div>
        <div class="promotion-news-content">
          <PropmotionItem @delete="getDeleteId"
            v-for="item in promotions"
            :key="item.maKhuyenMai"
            :promotion="item"
          ></PropmotionItem>
        </div>
        <div class="add-promotion"  data-bs-toggle="modal" data-bs-target="#addPromotion">
            Thêm khuyến mãi
        </div>
      </div>
      </div>
    </div>
    <div class="category-promotion">
    <div class="category-wrap">
        <div class="category-news">
          <div>Danh mục khuyến mãi</div>
          <div class="category-news-content">
            <div class="category-news-item">
                <div class="category-descrition">
                    Trang phục truyền thống
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <div class="category-news-item">
                <div class="category-descrition">
                    Trang phục hiện đại
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            <div class="category-news-item">
                <div class="category-descrition">
                    Trang phục kỷ yếu
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
          </div>
        </div>
    </div>
    </div>
    <AddPromotion v-if="updatePromotion"></AddPromotion>
  </div>
</template>
<script setup>
import { ROLES } from "@/utils/constant";
import AddPromotion from "./PromotionManagement/AddPromotion.vue"
import { onBeforeMount, ref,computed } from "vue";
import { getPromotions, getAllPromotion } from "@/data.function/getData";
import PropmotionItem from "./PromotionManagement/PromotionItem.vue";
import { useResource } from "@/stores/resource.store";
import { usePromotionStore } from "@/stores/promotion.store";
import { authStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
const khuyenMai = usePromotionStore();
const resource = useResource();
const promotions = ref([]);
const auth = authStore()
const {user} = storeToRefs(auth);
onBeforeMount(() => {
  getPromotions().then((res) => {
    promotions.value = res;
    resource.setPromotion(res);
  });
});
const getAll =()=>{
  getAllPromotion().then(res=>{
    promotions.value = res;
    resource.setPromotion(res);
  })
}
const getDeleteId = (id) =>{
  promotions.value = promotions.value.filter(p=> p.maKhuyenMai != id);
}
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
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(165, 165, 165); 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #435c70; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #50697f; 
}

.promotion-admin-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.promotion-content {
  width: 65%;
  padding: 20px;
}
.category-promotion {
  width: 35%;
  padding: 20px;
}
.promotion-wrap,
.category-wrap {
    background-color: #435c70;
    padding: 20px;
}
.category-news {
  width: 100%;
  font-family: sans-serif;
  padding: 1.5rem;
}
.promotion-news {
  width: 100%;
  font-family: sans-serif;
  padding: 1.5rem;
}
.promotion-news > div >span:first-child,
 .category-news > div:first-child {
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  margin-bottom: 12px;
}
.promotion-news > div >span:last-child{
  color: #fff;
  display: inline-block;
  padding:0px 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.promotion-news-content,
 .category-news-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap:2px;
  align-items: flex-start;
  height: 60vh;
  overflow: hidden;
  overflow-y: auto;
}
.category-news-item {
    background-color: #50697f;
    padding: 15px;
    width: 100%;
    color:#fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}
.category-news-item>div:first-child {
    font-weight: bold;
}
.category-news-item> svg {
    padding: 5px;
    background-color: #435c70;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
}
.category-news-item> svg:hover {
    background-color: #435c86;
}
.add-promotion {
    background-color: #fff;
    padding: 10px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: bold;
}

.add-promotion:hover {
    background-color: orange;
    color: #fff;
}
</style>
