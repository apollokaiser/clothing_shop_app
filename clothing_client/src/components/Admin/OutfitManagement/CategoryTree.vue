<template>
    <nav class="tree-nav">
        <details v-for=" cat in props.categories" :key="cat.maLoai" :class="{ 'is-expandable': cat.children != null }"
            class="tree-nav__item">
            <summary @dblclick="showCatInfo(cat)" class="tree-nav__item-title">{{ cat.tenLoai }}</summary>
            <details class="tree-nav__item">
                <summary class="tree-nav__item-title add__category_btn" @click="addCategory(cat.maLoai, cat.forAccessary)"> Thêm danh mục <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                </summary>
            </details>
            <CategoryTree @showCategoryInfo="cat=>emits('showCategoryInfo', cat)" @add-category="addCategory" v-if="cat.children != null" :categories="cat.children"></CategoryTree>
        </details>
    </nav>
</template>
<script setup>
const props = defineProps({
    categories: {
        type: Object,
        required: true
    }
})
const chooseTimer = null;
const emits = defineEmits(['addCategory', "showCategoryInfo"])
const addCategory = (id,forAccessary) =>{
    if(chooseTimer) {
        clearTimeout(chooseTimer);
        chooseTimer = null;
        return;
    }
    setTimeout(()=>{
        emits('addCategory', id, forAccessary);
    },200)
}
const showCatInfo = (cat) =>{
    console.log(cat);
        emits("showCategoryInfo", cat);
}
</script>
<style>
summary {
    display: block;
    cursor: pointer;
    outline: 0;
}

summary::-webkit-details-marker {
    display: none;
}
.tree-nav__item {
    display: block;
    white-space: nowrap;
    color: #ccc;
    position: relative;
}

.tree-nav__item.is-expandable::before {
    border-left: 1px solid #333;
    content: "";
    height: 100%;
    left: 0.8rem;
    position: absolute;
    top: 2.4rem;
    height: calc(100% - 2.4rem);
}

.tree-nav__item .tree-nav__item {
    margin-left: 2.4rem;
}

.tree-nav__item.is-expandable[open]>.tree-nav__item-title::before {
    font-family: "ionicons";
    transform: rotate(90deg);
}

.tree-nav__item.is-expandable>.tree-nav__item-title {
    padding-left: 2.4rem;
}

.tree-nav__item.is-expandable>.tree-nav__item-title::before {
    position: absolute;
    will-change: transform;
    transition: transform 300ms ease;
    font-family: "ionicons";
    color: #fff;
    font-size: 1.1rem;
    content: "\f125";
    left: 0;
    display: inline-block;
    width: 1.6rem;
    text-align: center;
}

.tree-nav__item-title {
    cursor: pointer;
    display: block;
    outline: 0;
    color: #fff;
    font-size: 1.5rem;
    line-height: 3.2rem;
}

.tree-nav__item-title .icon {
    display: inline;
    padding-left: 1.6rem;
    margin-right: 0.8rem;
    color: #666;
    font-size: 1.4rem;
    position: relative;
}

.tree-nav__item-title .icon::before {
    top: 0;
    position: absolute;
    left: 0;
    display: inline-block;
    width: 1.6rem;
    text-align: center;
}

.tree-nav__item-title::-webkit-details-marker {
    display: none;
}
.add__category_btn {
    color: orange;
}
</style>