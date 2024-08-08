<template>
    <li>
        <li class="my-2" :class="{ 'sub-cat': hasSubMenu, 'no-cat':!hasSubMenu, 'active':choose }" @dblclick="showCollapse" @click="chooseCategory">
            <svg v-if="choose" class="me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
       <span>{{ props.item.tenLoai }}</span> 
    </li>
    <Transition name="fade">
        <ul class="sub-cat-list" v-if="hasSubMenu && show" :id="props.item.maLoai">
            <ListCategory v-for="child in props.item.children" :key="child.maLoai" :item="child" />
        </ul>
    </Transition>
    </li>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';
const admin = useAdminStore()
const {choosedCategory} = storeToRefs(admin)
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    single:{
        type: Boolean,
        required: false
    },
    accessary:{
        type: Boolean,
        required: false,
        default: true
    }
})
const init = ref(false);
let chooseTimer = null;
const choose = ref(false)
const show = ref(false);
const hasSubMenu = computed(() => {
    return props.item.children && props.item.children.length > 0;
})
onBeforeMount(()=>{
    if(choosedCategory.value.length >0) {
        init.value = true;
        choose.value = choosedCategory.value.some(item=>item.maLoai == props.item.maLoai)
    }
})
watch(choosedCategory, value =>{
    if(value.length > 0) {
        choose.value = value.some(item=>item.maLoai == props.item.maLoai)
    } else {
        choose.value = false;
    }
 
}, {deep:true})
const showCollapse = ()=>{
    if(hasSubMenu.value)
    show.value = !show.value;
}
const chooseCategory = () =>{
    
    if(chooseTimer){
        clearTimeout(chooseTimer);
        chooseTimer = null;
        return;
    } 
    if(!props.accessary && props.item.forAccessary) {
        let text = '<p>Bạn không thể chọn danh mục đạo cụ biểu diễn trong các trường hợp sau:</p><div><ul><li> <strong>Trang phục cập nhật đang chứa các phần trang phục</strong> </li></ul></div>'
        Swal.fire({
            title: 'Cảnh báo',
            html: text,
            icon: 'warning',
            confirmButtonText: 'OK'
        })
        return;
    }
    chooseTimer = setTimeout(()=>{
        if(props.single && choosedCategory.value.length > 0) { //kiểm tra xem đang chọn cho trang phục và đã có chọn chưa
            //nếu đã có chọn rồi
            if(!choose.value == true) { // nếu đang muốn chọn thêm, tức là trang thái choose trước đó đang chưa chọn (false)
                alert("chỉ chọn 1")
            } else {
                init.value = false;
                choose.value = !choose.value;
                chooseTimer = null;
            }
        } else {
            init.value = false;
            choose.value = !choose.value;
            chooseTimer = null;
        }
    },200)
}
watch(choose, value=>{
    //kiểm tra xem có phải là khởi tạo ban đầu không --> ko làm gì cả
    if(!init.value){ 
        if(value==true){
            if(choosedCategory.value.length > 0 && props.single == true) {
               alert("Chỉ chọn 1")
            }else 
                admin.pushCategory(props.item)
        } else {
            if(props.single == true) admin.resetCategory();
           else admin.removeCategory(props.item.maLoai);
    }
}
})
</script>
<style lang="css" scoped>
.fade-enter-active {
  transition: all 0.5s ease;
}
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.sub-cat-list {
    border-left: 1px solid #ccc;
}
.sub-cat-list li a {
    padding: 5px 22px;
    text-align: left;
    display: block;
    font-size: 14px;
    color: #252a2b;
    opacity: 0.85;
}
.sub-cat-list li.sub-cat{
    padding-right: 30px;
}
li>li.sub-cat {
   font-weight: 500; 
}
li>.sub-cat-list {
    padding: 12px 12px;
    margin-left:100px;
    font-weight:initial;
}

li.active {
    background-color: green;
    color: white;
}

</style>