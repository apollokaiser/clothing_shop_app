<template>
    <div class="promotion-news-item">
        <div class="promotion-news-description">
          <Link :to="{name:'promotion-info', params:{ id:props.promotion.maKhuyenMai}}"><span :title="props.promotion.tenKhuyenMai">{{ props.promotion.tenKhuyenMai }}</span></Link>
            
            <p>{{ props.promotion.moTa }}</p>
        </div>
        <div class="promotion-new-expired">
            <span>Hết hạn: {{ date }}</span>
          <span class="delete-promotion" @click="removePromotion">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </span>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import Link from '@/components/Link.vue';
import { deletePromotion } from '@/data.function/postData';
import { useResource } from '@/stores/resource.store';
import Swal from 'sweetalert2';
const resource = useResource()
const props = defineProps({
    promotion:{
        type: Object,
        required: true
    }
})
const emit = defineEmits(['delete'])
const deletePro = ref(false)
const date = computed(()=>{
    let date = new Date(props.promotion.ngayKetThuc *1000);
    if(props.promotion.ngayKetThuc ==0) return "Không"
    const year = date.getFullYear();
const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 nên cần cộng thêm 1
const day = date.getDate();
   return `${day}/${month}/${year}`
})
watch(deletePro, value =>{
    if(value) emit('delete', props.promotion.maKhuyenMai);
    deletePro.value = false;
})
const removePromotion = () =>{
    // Xóa khuyến mãi tại đây
    deletePromotion(props.promotion.maKhuyenMai).then(result =>{
        if(result.status ==200) {
            deletePro.value = true;
           (async () => {
           const {value:success} = await Swal.fire({
            title: 'Xóa thành công',
            icon:'success',
            confirmButtonText: 'OK'
           })
           })()
        } else {
            (async () => {
            const {value: error} = await Swal.fire({
            title: 'Xóa thất bại',
            icon: 'error',
            confirmButtonText: 'OK'
            })
            })()
        }
    });
}
</script>
<style scoped>
        .promotion-news-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #50697f;
        padding:10px;
    }
    .promotion-news-item p{
        margin-bottom: 0.5rem;
    }
    .promotion-news-description {
        display: flex;
        flex-direction: column;
        width: 60%;
    }
    .promotion-news-description a {
        display:block;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #fff;
    }
    .promotion-news-description a span {
        display:block;
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #fff;
    }

    .promotion-news-description p {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #fff;
    }
    .promotion-news-description span:first-child {
        color:orange;
        font-weight: bold;
    }
    .promotion-new-expired {
        min-width: 200px;
        display: flex;
        justify-content: space-between;
        color: #fff;
    }
    .delete-promotion {
        margin-top: 0.5rem;
        cursor: pointer;
        color: red;
        text-decoration: underline;
    }
</style>
