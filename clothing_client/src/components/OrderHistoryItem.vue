<template>
  <div class="order-item">
    <div class="order-preview" data-bs-toggle="collapse" href="#order-detail" role="button" aria-expanded="false" aria-controls="order-detail">
      <div class="order-date">
        <span>{{
          new Date(props.order.ngayThue * 1000).toLocaleString()
        }}</span>
      </div>
      <div class="order-state">
        <span class="me-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="2"></circle>
            <path
              d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
            ></path>
          </svg>
        </span>
        <span :style="state">{{ props.order.trangThai.trangThai }}</span>
      </div>
      <div class="order-total">
        <span class="me-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="10" cy="20.5" r="1" />
            <circle cx="18" cy="20.5" r="1" />
            <path
              d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"
            />
          </svg>
        </span>
        <span>{{ convertToVND(props.order.tongThue) }}</span>
      </div>
    </div>
    <div class="collapse mt-2" id="order-detail">
      <div class="order-detail-content">
            <div class="order-name">
                <span>Người nhận:</span>
                <span>{{props.order.tenNguoiNhan}}</span>
            </div>
            <div class="order-address">
                <span>Địa chỉ:</span>
                <span>{{props.order.diaChiNguoiNhan}}</span>
            </div>
            <div class="order-phone">
                <span>Số điện thoại:</span>
                <span>{{props.order.sdtNguoiNhan}}</span>
            </div>
            <div class="order-items">
                <div>Sản phẩm thuê</div>
                <div v-for="item in props.order.chiTiet" :key="item.maTrangPhuc" class="order-product-item">
        <div class="order-item-description">
           <Link :to="{name:'outfit', params:{slug:convertToSlug(item.trangPhuc.tenTrangPhuc), id:item.maTrangPhuc}}"><div class="order-item-name">{{ item.trangPhuc.tenTrangPhuc }}</div></Link> 
            <div class="order-item-detail">
                <span>Kích thước : <em>{{ item.maKichThuoc || 'Không' }}</em></span>
                <span>Mã: <em>{{ item.maTrangPhuc }}</em></span>
            </div>
        </div>
        <div class="order-item-price">
            <span><em>{{ convertToVND(item.tongTien) }}</em></span>
            <span>x <em>{{item.soLuong }}</em></span>
        </div>
    </div>
            </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import convertToVND from "@/utils/convertVND";
import { computed, reactive } from "vue";
import Link from "@/components/Link.vue";
import {convertToSlug} from '@/utils/util.function'
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});
const state = computed(() => {
  switch (props.order.trangThai.maTrangThai) {
    case 1:
      return { color: "orange" };
    case 2:
      return { color: "red" };
    case 3:
      return { color: "green" };
    default:
      return { color: "red" };
  }
});
</script>
<style scoped>
.order-item {
  width: 100%;
  border-left: 1px solid #ccc;
}
.order-preview {
  display: flex;
  justify-content: space-around;
}
.order-total {
  display: flex;
  align-items: baseline;
}
.order-detail-content {
    padding: 20px;
}
.order-detail-content .order-name,
 .order-detail-content .order-address,
 .order-detail-content .order-phone {
    display: flex;
    align-items: baseline;
    margin-bottom: 5px;
}
.order-detail-content .order-name span:first-child,
.order-detail-content .order-address span:first-child,
.order-detail-content .order-phone span:first-child {
    min-width: 150px;
}
.order-items {
    margin-top: 10px;
}
.order-items>div:first-child{
    font-family: monospace;
    font-size: 23px;
    color: #777;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
}
.order-product-item {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin:5px 0;
}
.order-item-description,
.order-item-price {
    width: 70%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}.order-item-description .order-item-name {
    overflow: hidden;
    text-align: left;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    line-height: 1.4em;
    height: 3em;
    font-size: 14px;
    font-weight: bold;
}
.order-item-price {
    width: 20%;
    justify-content: flex-start;
    align-items: flex-end;
}
.order-item-detail {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
}
</style>
