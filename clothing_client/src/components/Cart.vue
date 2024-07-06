<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import Link from "./Link.vue";
import Ticket from "./Ticket.vue";
import CartItem from "./CartItem.vue";
import PropmotionItem from "./PropmotionItem.vue";
import Order from "./Order.vue";
import { useCartStore } from "@/stores/cart.store";
import { usePromotionStore } from "@/stores/promotion.store";
import { storeToRefs } from "pinia";
import convertToVND from "@/utils/convertVND";
import { getPromotionCode } from "@/data.function/getData";
import { shortCurrency } from "@/utils/util.function";

const cart = useCartStore();
const { cartItems, totalPrice } = storeToRefs(cart);
const khuyenMai = usePromotionStore();
const { myPromotion, promotionCode, totalDiscount, paymentPromotion } =
  storeToRefs(khuyenMai);
const requestPending = reactive({
  getCode: false,
});
const hasCart = ref(false);
onBeforeMount(() => {
  if (cartItems.value.length == 0) cart.loadCartInstance();
});
onMounted(() => {
  hasCart.value = cart.cartItems.length > 0 ? true : false;
});
watch(
  cartItems,
  (value) => {
    if (value.length > 0) {
      hasCart.value = true;
    } else {
      hasCart.value = false;
    }
  },
  {
    deep: true,
  }
);
const checkCode = () => {
  if (promotionCode.value.code && promotionCode.value.code != "") {
    requestPending.getCode = true;
    getPromotionCode(promotionCode.value.code).then((res) => {
      if (res.status == 200) {
        promotionCode.value.promotion = res.data.phieuKhuyenMai;
        promotionCode.value.expired = false;
        promotionCode.value.invalid = false;
      } else if (res.status == 3007) {
        promotionCode.value.promotion = "";
        promotionCode.value.expired = true;
      } else {
        promotionCode.value.promotion = "";
        promotionCode.value.invalid = true;
      }
      requestPending.getCode = false;
    });
  } else {
    alert("Vui lòng nhập mã code !");
  }
};
const ticketCodeValue = computed(() => {
  return promotionCode.value.promotion.donVi == "PERCENT"
    ? promotionCode.value.promotion.giaTriGiam + "%"
    : shortCurrency(promotionCode.value.promotion.giaTriGiam);
});
const confirmPromotionCode = () => {
  if (promotionCode.value.promotion == "") return;
  if (!promotionCode.value.invalid && !promotionCode.value.expired) {
    promotionCode.value.check = true;
  }
};
</script>

<template>
  <div class="cart container mt-3">
    <div v-if="!hasCart" class="cart-empty">
      <div class="cart-notification">
        <h1>Giỏ hàng của bạn đang trống</h1>
        <h3>Hãy chọn thêm sản phẩm để mua sắm nhé !</h3>
        <Link to="/"
          ><span class="btn-return"
            ><span>Trở lại ngay</span
            ><i class="fa fa-angle-double-right" aria-hidden="true"></i></span
        ></Link>
      </div>
    </div>
    <div v-if="hasCart" class="hascart">
      <div class="card-container">
        <div class="cart-header">
          <div class="cart-header-item">
            <Link to="/"
              ><i class="fa fa-long-arrow-left" aria-hidden="true"></i
            ></Link>
            <h3>Giỏ hàng của bạn</h3>
          </div>
        </div>
        <div class="cart-main">
          <div class="cart-option">
            <div class="cart-select-all">
              <div class="cntr">
                <input
                  class="hidden-xs-up"
                  id="cbx"
                  type="checkbox"
                  checked=""
                />
                <label class="cbx" for="cbx"></label>
              </div>
              <span>Chọn tất cả</span>
            </div>
          </div>
          <div class="cart-content mt-3">
            <CartItem v-for="item in cartItems" :key="item.id" :item="item" />
          </div>
        </div>
      </div>
      <div class="promotion-container">
        <div class="promotion-main">
          <div
            class="promotion-header d-flex justify-content-between align-items-baseline"
          >
            <div>KHUYẾN MÃI</div>
            <div data-bs-toggle="modal" data-bs-target="#prmotionCode">
              Nhập mã
              <i class="fa fa-angle-double-right ms-1" aria-hidden="true"></i>
            </div>
          </div>
          <div
            class="propmotion-content d-flex flex-column justify-content-center align-items-start"
          >
            <PropmotionItem
              v-for="item in myPromotion"
              :key="item.id"
              :promotion="item"
              :category="true"
            />
            <PropmotionItem
              v-for="item in paymentPromotion"
              :key="item.maKhuyenMai"
              :promotion="item"
              :payment="true"
            ></PropmotionItem>
          </div>
          <div class="promotion-apply">
            <div class="promotion-apply-main">
              <div v-if="promotionCode.check" class="promotion-card">
                <img src="/images/discount.png" alt="" />
                <span>{{ ticketCodeValue }}</span>
                <i
                  @click="promotionCode.check = false"
                  class="fa fa-times"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>
          <div
            class="promotion-footer d-flex justify-content-end align-items-baseline"
          >
            <div>Xem các ưu đãi khác</div>
            <div>Tất cả</div>
          </div>
        </div>

        <div class="payment-main">
          <div
            class="payment-header d-flex justify-content-between align-items-baseline"
          >
            <div>Thành tiền</div>
            <div>{{ convertToVND(totalPrice) }}</div>
          </div>
          <div
            class="payment-content d-flex flex-column justify-content-center align-items-start"
          >
            <div class="total-discount">
              <span>Tổng ưu dãi</span>
              <span>{{ convertToVND(totalDiscount) }}</span>
            </div>
            <div class="total-payment">
              <span>Tổng thuê</span>
              <span>{{ convertToVND(totalPrice - totalDiscount) }}</span>
            </div>
          </div>
          <div
            class="payment-footer d-flex justify-content-end align-items-baseline"
          >
            <button data-bs-toggle="modal" data-bs-target="#order">
              Tính ngay
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--add coupon modal-->
    <div
      class="modal fade"
      id="prmotionCode"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="prmotionCodeLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-promotion-header">
              <div class="modal-promotion-title">
                Có mã ưu đãi ? Nhập ngay nào !
              </div>
              <div class="funny-img">
                <img
                  src="/images/toppng.com-bunny-ramen-cute-gifs-kawaii-png-kawaii-kawaii-bunny-bunny-eating-noodles-gif-500x636.png"
                  alt=""
                />
              </div>
            </div>
            <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
          </div>
          <div class="modal-body">
            <div class="promotion-code-container">
              <div class="promotion-role">
                <ul>
                  <li>
                    - Mã khuyến mãi được áp dụng mõi khách hàng duy nhất 1 lần
                  </li>
                  <li>
                    - Khuyễn mãi chỉ áp dụng trong khoảng thời gian nhất định
                    hoặc đến khi hết số lượng nhập
                  </li>
                </ul>
              </div>
              <div class="input-code">
                <label for="input-code">Nhập tại đây</label>
                <em class="error-ticket-code" v-if="promotionCode.invalid">
                  Mã code không hợp lệ! Vui lòng thử lại
                </em>
                <em class="error-ticket-code" v-if="promotionCode.expired">
                  Ưu đãi đã hết hạn hoặc không còn lượt nhập
                </em>
                <div class="input-code-field">
                  <input
                    v-model="promotionCode.code"
                    placeholder="Type here..."
                    id="input-code"
                    name="text"
                    type="text"
                  />
                  <button @click.prevent="checkCode">
                    <span v-if="requestPending.getCode" class="loader"></span>
                    <span v-else>Kiểm tra</span>
                  </button>
                </div>
              </div>
              <div class="promotion-ticket-container">
                <Ticket
                  v-if="promotionCode.promotion != ''"
                  :ticket="promotionCode.promotion"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Trở lại
            </button>
            <button
              @click.prevent="confirmPromotionCode"
              data-bs-dismiss="modal"
              type="button"
              class="btn btn-primary"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end modal-->
    <Order />
  </div>
</template>
<style scoped>
.cart-empty,
.hascart {
  width: 100%;
  min-height: 70vh;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
}

.cart-empty {
  justify-content: center;
}

.promotion-container {
  width: 35%;
  min-height: 70vh;
  padding: 20px 22px;
}

.promotion-container .promotion-main,
.payment-main {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 10px 15px;
}

.payment-main {
  margin-top: 20px;
}

.promotion-container .promotion-main .promotion-header,
.promotion-container .promotion-main .promotion-footer,
.payment-main .payment-header,
.payment-main .payment-footer {
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px solid #ec4899;
  color: blue;
  font-weight: 500;
}

.payment-main .payment-header,
.payment-main .payment-footer {
  color: initial;
  border-bottom: none;
}

.payment-footer {
  padding-right: 10px;
}

.payment-footer button {
  border: none;
  display: block;
  position: relative;
  padding: 0.7em 2.4em;
  font-size: 18px;
  background: transparent;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  color: royalblue;
  z-index: 1;
  font-family: inherit;
  font-weight: 500;
}

.payment-footer button span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 4px solid royalblue;
}

.payment-footer button span::before {
  content: "";
  display: block;
  position: absolute;
  width: 8%;
  height: 500%;
  background: var(--lightgray);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-60deg);
  transition: all 0.3s;
}

.payment-footer button:hover span::before {
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100%;
  background: royalblue;
}

.payment-footer button:hover {
  color: white;
}

.payment-footer button:active span::before {
  background: #2751cd;
}

.promotion-header div:nth-child(2) {
  cursor: pointer;
}

.promotion-header div:nth-child(2):hover > i {
  transform: translateX(5px);
}

.promotion-header div:nth-child(2) > i {
  transition: all 0.3s ease;
}

.promotion-footer {
  width: 70%;
  border-bottom: unset !important;
}

.promotion-footer > div:first-child {
  margin-right: 20px;
}

.promotion-container .promotion-main .propmotion-content,
.payment-main .payment-content {
  width: 100%;
  margin-top: 10px;
}

.total-discount,
.total-payment {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 2px solid #2751cd;
}

.total-payment {
  border-bottom: none;
}

.total-payment span {
  font-size: 25px;
  font-weight: 500;
  color: darkred;
}

.promotion-apply {
  width: 100%;
  padding: 5px 15px;
  background-color: #eee;
  min-height: 20px;
}

.promotion-apply-main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.promotion-card {
  width: 90px;
  height: 20px;
  display: inline-flex;
  position: relative;
  z-index: 10;
}

.promotion-card img {
  object-fit: cover;
  z-index: 11;
}

.promotion-card span {
  position: absolute;
  top: 40%;
  left: 48%;
  transform: translate(-50%, -50%);
  z-index: 12;
  font-size: 13px;
  font-weight: 500;
  color: blue;
}

.promotion-card i {
  display: inline-block;
  position: absolute !important;
  top: -4px;
  right: 2%;
  font-weight: 200;
  transform: scale(0.8);
  color: #475569;
  z-index: 12;
  padding: 1px 2px;
  transition: all 0.2s ease-in-out;
}

.promotion-card i:hover {
  background-color: rgb(255, 166, 0);
  border-radius: 50%;
}

.hascart {
  align-items: flex-start;
}

.card-container {
  width: 60%;
}

.cart-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid purple;
}

.cart-header h3 {
  font-size: 20px;
  font-weight: 700;
}

.cart-header-item {
  width: 65%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #ec4899;
}

.cart-header-item i {
  cursor: pointer;
  font-size: 20px;
}

.cart-empty .cart-notification {
  width: 50%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.cart-notification h1 {
  color: rgb(252, 70, 100);
  font-size: 30px;
}

.cart-main {
  display: flex;
  padding: 20px;
  width: 100%;
  flex-direction: column;
}

.cart-option {
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
  align-items: center;
}

.cart-option .cart-select-all {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.sync-cart-data {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.cart-content {
  width: 100%;
}

.btn-return {
  display: flex;
  align-items: center;
  justify-content: baseline;
  padding: 0.9rem 1.8rem;
  font-size: 16px;
  font-weight: 700;
  color: rgb(252, 70, 100);
  border: 3px solid rgb(252, 70, 100);
  cursor: pointer;
  position: relative;
  background-color: transparent;
  text-decoration: none;
  overflow: hidden;
  z-index: 1;
  font-family: inherit;
}

.btn-return i {
  margin-left: 10px;
  font-size: 20px;
}

.btn-return::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(252, 70, 100);
  transform: translateX(-100%);
  transition: all 0.3s;
  z-index: -1;
}

.btn-return:hover::before {
  transform: translateX(0);
}

.btn-return:hover {
  color: white;
}

.switch {
  position: relative;
  height: 1.5rem;
  width: 3rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 9999px;
  background-color: rgba(100, 116, 139, 0.377);
  transition: all 0.3s ease;
}

.switch:checked {
  background-color: rgba(236, 72, 153, 1);
}

.switch::before {
  position: absolute;
  content: "";
  left: calc(1.5rem - 1.6rem);
  top: calc(1.5rem - 1.6rem);
  display: block;
  height: 1.6rem;
  width: 1.6rem;
  cursor: pointer;
  border: 1px solid rgba(100, 116, 139, 0.527);
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 3px 10px rgba(100, 116, 139, 0.327);
  transition: all 0.3s ease;
}

.switch:hover::before {
  box-shadow: 0 0 0px 8px rgba(0, 0, 0, 0.15);
}

.switch:checked:hover::before {
  box-shadow: 0 0 0px 8px rgba(236, 72, 153, 0.15);
}

.switch:checked:before {
  transform: translateX(100%);
  border-color: rgba(236, 72, 153, 1);
}

.cbx {
  position: relative;
  top: 1px;
  width: 25px;
  height: 25px;
  border: 1px solid #475569;
  border-radius: 20px;
  transition: background 0.2s ease;
  cursor: pointer;
  display: block;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.cbx:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 8px;
  width: 7px;
  height: 14px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transition: all 0.3s ease;
  transition-delay: 0.15s;
}

#cbx:checked ~ .cbx {
  border-color: transparent;
  background: #ec4899;
  animation: jelly 0.4s ease;
}

#cbx:checked ~ .cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.cntr {
  position: relative;
}

/* @keyframes jelly {
  from {
    transform: scale(1, 1);
  }

  20% {
    transform: scale(1.3, 0.7);
  }

  40% {
    transform: scale(0.7, 1.3);
  }

  60% {
    transform: scale(1.1, 0.9);
  }

  80% {
    transform: scale(0.9, 1.1);
  }

  to {
    transform: scale(1, 1);
  }
} */

.hidden-xs-up {
  display: none !important;
}

.modal-header {
  border-bottom: none !important;
  padding: 1rem 1rem 0 1rem;
}

.modal-promotion-header {
  width: 100%;
  position: relative;
  padding: 10px;
}

.modal-promotion-header > div.modal-promotion-title {
  position: absolute;
  top: 0%;
  right: 30%;
}

.modal-promotion-header .modal-promotion-title {
  padding: 10px;
  border-radius: 10px;
  background-color: #ccc;
  text-align: center;
  position: relative;
}

.modal-promotion-header .modal-promotion-title::after {
  width: 20px;
  height: 10px;
  content: "";
  background-color: #ccc;
  position: absolute;
  bottom: 0;
  left: 0%;
  transform: rotate(60deg);
}

.funny-img {
  width: 80%;
  text-align: left;
  height: 100px;
  padding: 10px;
}

.funny-img img {
  object-fit: cover;
}

.modal-body {
  padding: 0 0.5rem 0.5rem 0.5rem;
}

.promotion-code-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.promotion-role {
  width: 100%;
  color: coral;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 0.5rem;
  font-style: italic;
}

.promotion-code-container .input-code {
  width: 100%;
}

.promotion-code-container .input-code .error-ticket-code {
  display: block;
  color: red;
  font-size: 12px;
  text-align: center;
  padding: 0.3rem;
}

.promotion-code-container .input-code label {
  display: block;
  text-align: center;
  padding-bottom: 0.5rem;
}

.input-code-field {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-code-field input {
  font-family: monospace;
  text-transform: uppercase;
  max-width: 250px;
  outline: none;
  border: 1px solid #dadada;
  padding: 10px;
  margin-right: 20px;
  border-radius: 5px;
  background-color: #f3f7fe;
  transition: 0.3s;
  color: #3b82f6;
}

.input-code-field input:focus {
  border: 1px solid #3b82f6;
  box-shadow: 0 0 0 4px #3b83f65f;
}

.input-code-field button {
  font-family: monospace;
  width: 100px;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.loader {
  display: inline-block;
  width: 60px;
  aspect-ratio: 4;
  background: radial-gradient(circle closest-side, #ffffff 90%, #ffffff00) 0 /
    calc(100% / 3) 100% no-repeat;
  animation: loading 1s steps(3) infinite;
}

@keyframes loading {
  to {
    background-position: 150%;
  }
}

.promotion-ticket-container {
  width: 100%;
  padding: 1rem;
}
</style>
