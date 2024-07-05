<template>
    <div class="promotion-news-item">
        <div class="promotion-news-description">
            <span>{{ props.promotion.tenKhuyenMai }}</span>
            <p>{{ props.promotion.moTa }}</p>
        </div>
        <div class="promotion-new-expired">
            <span>Hết hạn: {{ date }}</span>
          <Link :to="{name:'promotion-info', params:{ id:props.promotion.maKhuyenMai}}"><span>Xem chi tiết</span></Link>
          <span class="delete-promotion" @click="removePromotion">Xóa</span>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import Link from '../Link.vue';
import { deletePromotion } from '@/data.function/postData';
import { useResource } from '@/stores/resource.store';
const resource = useResource()
const props = defineProps({
    promotion:{
        type: Object,
        required: true
    }
})
const date = computed(()=>{
    let date = new Date(props.promotion.ngayKetThuc *1000);
    if(props.promotion.ngayKetThuc ==0) return "Không"
    const year = date.getFullYear();
const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên cần cộng thêm 1
const day = date.getDate();
   return `${day}/${month}/${year}`
})
const removePromotion = () =>{
    // Xóa khuyến mãi tại đây
    deletePromotion(props.promotion.maKhuyenMai).then(result =>{
        if(result.status ==200) {
            alert("Xóa thành công")
        } else {
            alert("Xóa thất bại")
        }
    });
}
</script>
<style scoped>
        .promotion-news-item {
        margin-top:7px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        border-bottom: 1px solid #ccc;
    }
    .promotion-news-item p{
        margin-bottom: 0.5rem;
    }
    .promotion-news-description {
        display: flex;
        flex-direction: column;
        width: 80%;
    }
    .promotion-news-description p {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .promotion-news-description>span:first-child {
        color:red;
        font-weight: bold;
    }
    .promotion-new-expired {
        min-width: 200px;
        display: flex;
        flex-direction: column;
    }
    .delete-promotion {
        margin-top: 0.5rem;
        cursor: pointer;
        color: red;
        text-decoration: underline;
    }
</style>
