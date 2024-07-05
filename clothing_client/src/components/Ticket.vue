

<template>
    <div class="ticket-promotion-code">
        <div class="ticket-img">
            <img src="/images/amongus-pink.png" alt="">
        </div>
        <div class="promotion-ticket-content">
            <div class="ticket-name">
                {{ props.ticket.tenChuongTrinh}}
            </div>
            <div class="ticket-description">
                <span>{{ props.ticket.moTa }}</span>
                <span class="ticket-price">{{ discount }}</span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.ticket-promotion-code {
    width: 100%;
    display: flex;
    padding: 1rem;
    justify-content: space-between;
    border-radius: 5px;
    background-color: #8b8b8b;
    border: 1px solid rgb(228, 197, 0);
    box-shadow: 1px 1px 1px 1px gold;
}
.ticket-promotion-code .promotion-ticket-content{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}
.promotion-ticket-content .ticket-name{
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.promotion-ticket-content .ticket-description {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.promotion-ticket-content .ticket-description span:first-child{
    width: 80%;
    overflow: hidden;
    text-align: left;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    line-height: 1.4em;
    height: 4.2em;
}
.promotion-ticket-content .ticket-description span:last-child{
    width: 12%;
    font-size: 35px;
    font-weight: bold;
    text-align: center;
    color: red;
}

.ticket-img {
    width: 20%;
    height: 100px;
}
</style>

<script setup>
import {computed} from 'vue'
import { shortCurrency } from '@/utils/util.function';
const props = defineProps({
    ticket: {
        type: Object,
        required: true,
    }
})
const discount = computed(()=>{
    return props.ticket.donVi =="PERCENT" ? props.ticket.giaTriGiam + "%" : shortCurrency(props.ticket.giamGia)
})
</script>