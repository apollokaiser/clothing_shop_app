<template>
    <div class="container order-container">
        <v-window v-model="step">
            <v-window-item :value="1">
                <div class="order-main">
                    <div class="order-header">
                        <h1>Xác nhận thuê trang phục</h1>
                    </div>
                    <div class="order-content mt-4">
                        <div class="order-info">
                            <div>Thông tin khách gửi</div>
                            <div class="order-customer">
                                <span>Khách hàng: </span>
                                <span>{{ user.name }}</span>
                            </div>
                            <div class="order-customer">
                                <span>Người nhận: </span>
                                <span>{{ order.tenNguoiNhan }}</span>
                            </div>
                            <div class="order-address">
                                <span>Nơi nhận: </span>
                                <span>{{ order.diaChiNguoiNhan }}</span>
                            </div>
                            <div class="order-phone">
                                <span>Số điện thoại :</span>
                                <span>{{ order.sdtNguoiNhan }}</span>
                            </div>
                            <div class="order-date">
                                <span>Ngày đặt hàng: </span>
                                <span>{{ new Date().toLocaleString() }}</span>
                            </div>
                            <div class="order-date">
                                <span>Ngày nhận hàng: </span>
                                <span>{{ new Date(order.ngayNhan).toLocaleString() }}</span>
                            </div>
                        </div>
                        <div class="order-item">
                            <div>Danh sách sản phẩm đã đặt hàng</div>
                            <div class="order-product">
                                <OrderOutfitItem v-for="item in orderItem" :key="item.id" :product="item" />
                            </div>
                        </div>
                        <!-- <div class="order-promotion">
                    <div>Các ưu đãi được áp dụng</div>
                    <div class="order-promotion-item">
                        <ul style="list-style-type: disc;">
                            <li>Ưu đãi giảm giá 15K cho đơn hàng trên 100.000đ</li>
                            <li>Ưu đãi phiếu khuyến mãi 10%</li>
                        </ul>
                    </div>
                </div> -->
                        <div class="order-payment">
                            <div>Chọn phương thức đặt cọc</div>
                            <div class="order-payment-method">
                                <form>
                                    <label>
                                        <input v-model="paymentMethod" type="radio" name="radio" value="1" checked>
                                        <span>Đặt cọc khi nhận hàng</span>
                                    </label>
                                    <label>
                                        <input v-model="paymentMethod" type="radio" name="radio" value="2">
                                        <span>Đăt cọc online</span>
                                    </label>
                                </form>
                            </div>
                        </div>
                        <div class="order-total">
                            <div>Tổng tiền</div>
                            <div class="order-total-amount">
                                <span>{{ convertToVND(totalPrice - totalDiscount) }}</span>
                            </div>
                        </div>
                        <div class="order-submit">
                            <button @click.prevent="paymentHandle" type="submit">Xác nhận đặt hàng</button>
                        </div>
                    </div>
                </div>
            </v-window-item>
            <v-window-item :value="2">
                <div class="waiting-checkout d-flex justify-content-center align-items-center flex-column">
                    <h1>Đang chờ xác nhận đặt trang phục...</h1>
                    <h3>Vui lòng không thoát trang hoặc đóng website trong quá trình đặt cọc</h3>
                    <button @click.prevent="step = 1">Trở lại</button>
                </div>
            </v-window-item>
            <v-window-item :value="3">
                <div class="payment-success d-flex justify-content-center align-items-center flex-column">
                    <h1>Đã thanh toán thành công</h1>
                    <h3>Cảm ơn bạn đã đặt trang phục với chúng tôi</h3>
                    <button @click.prevent="window.location.href='http://localhost:5173'">Quay về trang chủ</button>
                </div>
            </v-window-item>
            <v-window-item :value="4">
                <div class="payment-success d-flex justify-content-center align-items-center flex-column">
                    <h1>Đặt hàng thất bại</h1>
                    <h3>Vui lòng kiểm tra tài khoản trước khi thanh toán </h3>
                    <button @click.prevent="step=1">Quay lại</button>
                </div>
            </v-window-item>
        </v-window>

        <Loading v-if="requestPending.pending" />
        <Result v-if="requestPending.error || requestPending.success" :success="requestPending.success"
            :error="requestPending.error">
            <span>Thanh toán thành công{{ requestPending.message }}</span>
        </Result>
    </div>
</template>

<script setup>
import startWebSocket from '@/config/websocket';
import Loading from './Loading.vue';
import Result from './Admin/Result.vue';
import OrderOutfitItem from '@/components/OrderOutfitItem.vue'
import { useCartStore } from '@/stores/cart.store';
import { usePromotionStore } from '@/stores/promotion.store';
import { authStore } from '@/stores/user.store';
import { useOrderStore } from '@/stores/order.store';
import { storeToRefs } from 'pinia';
import convertToVND from '@/utils/convertVND';
import { saveOrder } from '@/data.function/postData';
import { useRouter } from 'vue-router';
import { computed, reactive, ref } from 'vue';
import Swal from 'sweetalert2';
const auth = authStore();
const cart = useCartStore();
const khuyenMai = usePromotionStore();
const donThue = useOrderStore();
const { user, isLoggedIn } = storeToRefs(auth);
const { order } = storeToRefs(donThue);
const { cartItems, totalPrice, cartDetail } = storeToRefs(cart);
const { totalDiscount } = storeToRefs(khuyenMai);
const router = useRouter();
const step = ref(1);
const orderStatus = ref("")
const requestPending = reactive({
    pending: false,
    success: false,
    error: false,
    message: ''
})
const props = defineProps({
    uid: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
})
const getPaymentMessage = (data) => {
    if(data.status ==200) {
        orderStatus.value = data;
        step.value = 3;
        cart.clearCart();
    } else {
        orderStatus.value = data;
        step.value = 4;
    }
}
const paymentMethod = ref(1);
const paymentHandle = async () => {
    let orderUser = isLoggedIn.value ? user.value : null;
    const response = await saveOrder(cartItems.value, cartDetail.value, order.value, orderUser, paymentMethod.value);
    if (paymentMethod.value = 2) {
        step.value = 2;
        if(response && response.status == 200) {
            window.open(response.data.paymentUrl, "_blank");
            startWebSocket(getPaymentMessage);
        } else {
            Swal.fire({
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại!',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    } else {
        if (response.status == 200) {
            (async () => {
                const { value: success } = await Swal.fire({
                    title: 'Thông báo',
                    text: 'Bạn đã đăt dịch vụ thành công',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                if (success) {
                    cart.clearCart();
                    router.push({ name: 'homePage' });
                }
            })()
        } else {
            Swal.fire({
                title: 'Thông báo',
                text: 'Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại!',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }

}
const orderItem = computed(() => cartItems.value.filter(item => item.check))
</script>

<style scoped>
.order-container {
    min-height: 100vh;
}

.order-container .order-main {
    width: 100%;
    padding: 20px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.order-main h1 {
    font-size: 30px;
}

.order-content {
    padding: 20px;
    width: 40%;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.order-content .order-info,
.order-content .order-item,
.order-content .order-promotion,
.order-content .order-payment {
    margin: 5px 0;
    padding: 5px;
}

.order-info .order-customer span {
    display: inline-block;
}

.order-info .order-address {
    display: flex;
    flex-direction: column;
}

.order-content .order-info>div:first-child,
.order-content .order-item>div:first-child,
.order-content .order-promotion>div:first-child,
.order-content .order-payment>div:first-child {
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 5px;
}

.order-payment-method form {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

.order-payment-method label {
    display: flex;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.375em;
}

.order-payment-method label input {
    position: absolute;
    left: -9999px;
}

.order-payment-method label input:checked+span {
    background-color: #ee58a6;
    /* #414181 */
    color: white;
}

.order-payment-method label input:checked+span:before {
    box-shadow: inset 0 0 0 0.4375em rgb(144, 0, 160);
    /* #00005c */
}

.order-payment-method label span {
    display: flex;
    align-items: center;
    padding: 0.375em 0.75em 0.375em 0.375em;
    border-radius: 99em;
    transition: 0.25s ease;
    color: #414181;
}

.order-payment-method label span:hover {
    background-color: #d6d6e5;
}

.order-payment-method label span:before {
    display: flex;
    flex-shrink: 0;
    content: "";
    background-color: #fff;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    margin-right: 0.375em;
    transition: 0.25s ease;
    box-shadow: inset 0 0 0 0.125em #00005c;
}

.order-submit {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 10px;
    background-color: #ee58a6;
}

.order-submit button {
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: 500;
    border-radius: 10px;
}

.waiting-checkout,
.payment-success {
    height: 300px;
}

.waiting-checkout h1,
.payment-success h1 {
    color: #ee58a6;
}

.waiting-checkout button,
.payment-success button {
    display: inline-block;
    margin-top: 20px;
    font-size: 20px;
    padding: 5px 20px;
    font-weight: 600;
    transition: all 0.4s linear;
}

.waiting-checkout button:hover,
.payment-success button:hover {
    cursor: pointer;
    color: #ee58a6;
    border-bottom: 1px solid #ee58a6;
}
</style>
