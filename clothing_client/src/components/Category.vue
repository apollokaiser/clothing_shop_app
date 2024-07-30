<template>
    <div>
        <div class="wrap-link my-5">
            <div class="container breadcumb">
                <Link to="/"><span>Trang chủ</span></Link>
                <span class="mx-1">/</span>
                <Link :to="{name:'category',params:{slug: props.slug, id:props.id}}"><span>{{ thisCategory?.tenLoai }}</span></Link>
            </div>
        </div>
        <div class="container">
        <h3 class="category-title">Bạn đang xem trang phục {{ thisCategory?.tenLoai }}</h3>
    </div>
    </div>
</template>
<script setup>
    import { computed } from 'vue';
import Link from './Link.vue';
    import { useResource } from '@/stores/resource.store';
    const resource = useResource()
    const props = defineProps({
        id:{
            type: String,
            required: true
        },
        slug:{
            type: String,
            required: true
        }
    })
    function findCategoryById(root, maLoai) {
    if (root.maLoai == maLoai) {
        return root;
    }
    if (root.children) {
        for (const child of root.children) {
            const result = findCategoryById(child, maLoai);
            if (result) {
                return result;
            }
        }
    }
    return null;
}
    const thisCategory = computed(()=>{
        let category = null;
        resource.getCategory.forEach(item=>{
            if(!category) {
                category = findCategoryById(item, props.id);
            }
        })
        return category;
    })
</script>
<style scoped>
    .wrap-link {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    align-items: center;
}

.wrap-link .breadcumb {
    font-size: 15px;
    font-style: italic;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif, sans-serif;
}
.category-title {
    font-family: "Lemonada", cursive;
}
</style>