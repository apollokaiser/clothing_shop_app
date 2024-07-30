<template>
    <div class="product-container col-lg-2 col-md-6 col-6 my-2">
        <div class="propduct-main">
            <div class="product-proview-image" :title="props.outfit.tenTrangPhuc">
                <div class="image" :class="{'static-img':staticTransition}">
                    <img v-for="item in props.outfit.hinhAnhs" :key="item.id" :src="item" :alt="item">
                </div>
                <div class="quick-view-product">
                    <i class="fa fa-eye" aria-hidden="true"></i> <!--quick view modal-->
                </div>
                <!--add click event-->
            </div>
            <div class="product-detail col-sm-12 d-flex flex-column">
                <Link :to="{name:'outfit', params:{slug:convertToSlug(props.outfit.tenTrangPhuc), id:props.outfit.id}}">
                <h3>{{ props.outfit.tenTrangPhuc }} </h3>
                </Link>
                <div class="product-action col-sm-12">
                    <div class="product-price col-sm-6">{{ convertToVND(props.outfit.giaTien)}}</div>
                    <div class="product-add-cart d-flex col-sm-6">
                        <span>Thêm giỏ hàng</span>
                        <i class="fa fa-cart-arrow-down ms-1" aria-hidden="true"></i>
                    </div>
                    <!--price-->
                    <!--cart-->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Link from './Link.vue';
import { convertToSlug } from '@/utils/util.function';
import convertToVND from '@/utils/convertVND';
const props = defineProps({
    outfit: {
        type: Object,
        required: true
    }
})
const staticTransition = computed(() => props.outfit.hinhAnhs?.length == 1)
</script>

<style scoped>
.product-container {
    max-width: 200px;
    min-height: 260px;
    max-height: 380px;
    transition: all 0.5s ease-in-out;
    border-radius: 10px;
}

.product-container:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
}
.propduct-main{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
}

.propduct-main .product-proview-image img {
    padding: 10px;
    object-fit: cover;
    transition: all 0.5s ease;
}

.product-proview-image {
    overflow: hidden;
    position: relative;
}

.quick-view-product {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all 0.5s linear;
    cursor: pointer;
}

.image {
    display: flex;
    flex-wrap: nowrap;
    height: 300px;
}

.propduct-main .product-proview-image:hover img {
    transform: translateX(-100%);

}
.propduct-main .product-proview-image:hover .static-img img {
    transform: unset !important;

}


.propduct-main .product-proview-image:hover .quick-view-product {
    opacity: 1;
}

.product-detail h3 {
    text-wrap: wrap;
    padding: 5px 12px;
    text-align: left;
    font-size: 15px;
    font-weight: 500;
    white-space: initial;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    line-height: 1.4em;
    height: 3em;
}

.product-action {
    display: flex;
    padding: 0 12px;
}

.product-action>div {
    flex: 1 1 auto;
    font-size: 14px;
}
.product-action .product-price {
    font-weight: bold;
    color: #ff0084;
    margin-right: 10px;
}
.product-add-cart span{
   font-size: 12px;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;

}

</style>