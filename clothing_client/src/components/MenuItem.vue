<template>
    <li :class="{ 'sub-menu': hasSubMenu, 'font-effect-fire': props.item.khuyenMai }">
        <Link :to="{path: props.item.slug}">
        {{ props.item.tenLoai }}
        <i v-if="hasSubMenu" class="fa fa-chevron-down" aria-hidden="true"></i>
        </Link>
        <ul class="sub-menu-list" v-if="hasSubMenu">
            <MenuItem v-for="child in props.item.children" :key="child.maLoai" :item="child" />
        </ul>
    </li>
</template>

<script setup>
import { computed } from 'vue';
import Link from './Link.vue';
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})
const hasSubMenu = computed(() => {
    return props.item.children && props.item.children.length > 0;
})
</script>

<style scoped>
</style>