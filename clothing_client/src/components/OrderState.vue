<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useCartStore } from '@/stores/cart.store';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
const cart = useCartStore();
const {preOrder} = storeToRefs(cart)
const router = useRouter();
const route = useRoute();
const count  = ref(5);
const props = defineProps({
    orderId: {
        type: String,
        required: true
    },
})
onBeforeMount(() => {
    // must has preOrder to load this page
    // if(!preOrder.value.identity) {
    //     router.push({name:'homePage'})
    // }
})
const returnCount = computed(()=>{
    setTimeout(()=>{
        count.value = count.value - 1;
    }, 1000);
    if(count.value == 0 ) router.push({name:'homePage'})
    return count.value;
})
</script>

<template>
    <div class="mt-4">
        <div class="container">
            <div class="row">
                <div class="col-12 ">
                    <div class="message-box">
                        <div v-if="route.query.status='success'" class="status-container">
                            <div style="padding-left: 5%; padding-right: 5%">
                                <hr />
                            </div>
                            <br>
                            <h1 class="monserrat-font" style="color: Grey">Cảm ơn vì đã đến</h1>
                            <br>

                            <div class="confirm-green-box">
                                <br>
                                <h5>Đặt cọc thành công!</h5>
                                <p>Đơn thuê trang phục #${{ route.params.orderId }} đã hoàn thành !</p>
                                <p>Hãy chắc rằng bạn sẽ không bỏ lỡ cuộc gọi xác nhận của chúng tôi trong thời gian tới ! Trân trọng !</p>
                            </div>
                            <br>
                            <button @click.prevent="router.push({name:'homePage'})" id="create-btn" class="btn btn-ouioui-secondary margin-left-5px">Trở lại trang chủ ({{ returnCount }})</button>
                        </div>
                        <div v-else>
                            <div style="padding-left: 5%; padding-right: 5%">
                                <hr />
                            </div>
                            <br>
                            <h1 class="monserrat-font" style="color: Grey">Opps ! Có điều gì đó đã xảy ra</h1>
                            <br>

                            <div class="confirm-green-box">
                                <br>
                                <h5>Đơn thuê trang phục #${{ route.params.orderId }} đã không thể thực hiện !</h5>
                                <p></p>
                                <p>Hãy chắc rằng bạn không có gì bất ổn với tài khoản thanh toán của mình Trân trọng !</p>
                            </div>
                            <br>
                            <button @click.prevent="router.push({name:'homePage'})" id="create-btn" class="btn btn-ouioui-secondary margin-left-5px">Trở lại trang chủ ({{ returnCount }})</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped>
/* Write page CSS here*/
.message-box {
    display: flex;
    justify-content: center;
    /* padding-top: 20vh; */
    padding-bottom: 20vh;
}

.status-container {
    background: white;
    height: 480px;
    width: 90%;
    /* box-shadow: 5px 5px 10px grey; */
    text-align: center;
}

.confirm-green-box {
    width: 100%;
    height: 140px;
    background: #d7f5da;
}


.monserrat-font {
    font-family: 'Montserrat', sans-serif;
    letter-spacing: 2px;
}





/* --------------- site wide START ----------------- */
.main {
    width: 80vw;
    margin: 0 10vw;
    height: 50vh;
    overflow: hidden;

}

body {
    font-family: 'Montserrat', sans-serif;
}

/*
 * Setting the site variables, example of how to use
 * color:var(--text-1);
 *
 */

:root {
    --background-1: #ffffff;
    --background-2: #E3E3E3;
    --background-3: #A3CCC8;
    --text-1: #000000;
    --text-2: #ffffff;
    --text-size-reg: calc(20px + (20 - 18) * ((100vw - 300px) / (1600 - 300)));
    --text-size-sml: calc(10px + (10 - 8) * ((100vw - 300px) / (1600 - 300)));
}

.verticle-align {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-style {
    padding: 0;
    margin: 0;
}


/* ------------------ site wide END ----------------- */

/* ----- RESPONSIVE OPTIONS MUST STAY AT BOTTOM ----- */

/* SM size and above unless over ridden in bigger sizes */
@media (min-width: 576px) {
    /* sm size */

}

/* MD size and above unless over ridden in bigger sizes */
@media (min-width: 768px) {}

/* LG size and above unless over ridden in bigger sizes */
@media (min-width: 992px) {}

/* XL size and above */
@media (min-width: 1200px) {}
</style>