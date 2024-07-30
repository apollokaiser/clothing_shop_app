<script setup>
import Outfit from "@/components/Outfit.vue";
import { onBeforeMount, ref, computed, watch} from "vue";
import { getOutFitDetail,getRelateOutfit,getAttenttion } from "@/data.function/getData";
import Link from "@/components/Link.vue";
import Attention from "@/components/Attention.vue";
import OutfitDetail from "@/components/OutfitDetail.vue";
import { useResource } from '@/stores/resource.store';
import { useInitStore } from "@/stores/init.store";
import { storeToRefs } from "pinia";
const init = useInitStore();
const resource = useResource();
const {outfit, attention} = storeToRefs(init)
const thisCategory = computed(()=>{
    if(resource.getCategory.length >0)
    return resource.getCategory.find(item=> item.maLoai ==outfits.value.theLoai)?.tenLoai;
    else return "";
})
const outfits = ref("");
const props = defineProps({
    id:{
        type: String,
        required: true,
    }
});
const relateOutfit = ref([]);
const ettentionOutfit = ref([]);
onBeforeMount(async() => {
   const response = await getOutFitDetail(props.id);
    outfits.value = response;
const result = await getRelateOutfit(response.theLoai)
    relateOutfit.value = result;
    if(init.getAttenttion.length > 0 && init.getAttenttionOutfit.length >0 ) {
        ettentionOutfit.value = init.getAttenttionOutfit;
    } else if(init.getAttenttion.length > 0 && init.getAttenttionOutfit.length == 0) {
        getAttenttion(init.getAttenttion).then(response=> {
           outfit.value = response;
            ettentionOutfit.value = response;
        })
    }
});
</script>

<template>
    <div class="mt-5">
        <div class="outfit-link mb-5">
            <div class="container breadcumb">
                <Link to="/"><span>Trang chủ</span></Link>
                <span class="mx-1">/</span>
                <span>{{ thisCategory }}</span>
                <span class="mx-1">/</span>
                <span>{{
                    outfits.tenTrangPhuc
                }}</span>
            </div>
        </div>
            <OutfitDetail v-if="outfits" :id="props.id" :details="outfits" :quickview="false"/>
        <div class="container">
            <div class="outfit-description question">
                <div class="question-box">
                    <div class="question-title">Bạn đang có những thắc mắc ?</div>
                </div>
                <div class="question-content col-sm-9">
                    <div class="question-item">
                        <div class="question-item-collapse" data-bs-toggle="collapse" href="#answer1" role="button"
                            aria-expanded="false" aria-controls="answer1">
                            <span>Làm sao để tôi đặt đơn hàng mua / thuê online?</span>
                            <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </div>
                        <div class="collapse answer" id="answer1">
                            Khách hàng đặt đơn mua / thuê online với một trong các hình thức sau: - Thêm
                            sản phẩm vào giỏ hàng trên website www.sandoutfit.com và điền đầy đủ thông
                            tin, nhân viên Sand sẽ gọi xác nhận đơn và giao hàng đúng hẹn. - Liên hệ số
                            hotline / zalo 0934907714 hoặc Chat với tư vấn viên trên fanpage của Sand
                            Outfit để được tư vấn đặt hàng online.
                        </div>
                    </div>
                    <div class="question-item">
                        <div class="question-item-collapse" data-bs-toggle="collapse" href="#answer2" role="button"
                            aria-expanded="false" aria-controls="answer2">
                            <span>Làm sao để tôi đặt đơn hàng mua / thuê online?</span>
                            <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </div>
                        <div class="collapse answer" id="answer2">
                            Khách hàng đặt đơn mua / thuê online với một trong các hình thức sau: - Thêm
                            sản phẩm vào giỏ hàng trên website www.sandoutfit.com và điền đầy đủ thông
                            tin, nhân viên Sand sẽ gọi xác nhận đơn và giao hàng đúng hẹn. - Liên hệ số
                            hotline / zalo 0934907714 hoặc Chat với tư vấn viên trên fanpage của Sand
                            Outfit để được tư vấn đặt hàng online.
                        </div>
                    </div>
                    <div class="question-item">
                        <div class="question-item-collapse" data-bs-toggle="collapse" href="#answer3" role="button"
                            aria-expanded="false" aria-controls="answer3">
                            <span>Làm sao để tôi đặt đơn hàng mua / thuê online?</span>
                            <i class="fa fa-chevron-down" aria-hidden="true"></i>
                        </div>
                        <div class="collapse answer" id="answer3">
                            Khách hàng đặt đơn mua / thuê online với một trong các hình thức sau: - Thêm
                            sản phẩm vào giỏ hàng trên website www.sandoutfit.com và điền đầy đủ thông
                            tin, nhân viên Sand sẽ gọi xác nhận đơn và giao hàng đúng hẹn. - Liên hệ số
                            hotline / zalo 0934907714 hoặc Chat với tư vấn viên trên fanpage của Sand
                            Outfit để được tư vấn đặt hàng online.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="relative-outfit container">
            <div class="relative-header">Sản phẩm liên quan</div>
            <div class="outfit-container">
                <Outfit v-for="outfit in relateOutfit" :key="outfit.id" :outfit="outfit"></Outfit>
            </div>
        </div>
        <div class="history-outfit container">
            <div class="history-header">Sản phẩm đã xem</div>
            <Attention v-if="ettentionOutfit.length >0" :outfits="ettentionOutfit"></Attention>
        </div>
    </div>
</template>

<style scoped>
.outfit-link {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    align-items: center;
}

.outfit-link .breadcumb {
    font-size: 15px;
    font-style: italic;
    font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif, sans-serif;
}

.outfit-detail-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}

.outfit-detail-container .outfit-detail-img {
    padding: 3px;
    overflow: hidden;
    cursor: pointer;
}

.outfit-preview-img {
    position: relative;
    overflow: hidden;
    padding: 20px 20px 10px 20px;
}

.outfit-detail-container .outfit-detail-img .outfit-img img {
    transition: all 0.5s ease;
    object-fit: cover;
    padding: 20px;
}

.outfit-img {
    display: flex;
    flex-wrap: nowrap;
}

.outfit-img:hover {
    transform: translateX(-100%);
}

.slide-btn {
    position: absolute;
    top: 50%;
    font-size: 18px;
}

.slide-btn.next-img {
    right: 0%;
    transition: all 0.5s;
}

.slide-btn.prev-img {
    left: 0%;
    transition: all 0.5s;
}

.outfit-detail-img:hover .slide-btn.next-img,
.outfit-detail-img:hover .slide-btn.prev-img {
    transform: scale(1.4);
}

.outfit-carousel-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    height: auto;
}

.outfit-carousel-img .outfit-carousel-item {
    padding: 3px;
    border: 1px solid #ccc;
    width: 20%;
    overflow: hidden;
    border-radius: 5px;
}

.outfit-carousel-img .outfit-carousel-item img {
    object-position: center;
    object-fit: cover;
}

.outfit-detail-content {
    padding: 20px;
    border-left: 1px solid #ccc;
    margin-left: 20px;
    flex: 1 1 auto;
}

.outfit-title {
    font-weight: bold;
    text-align: left;
    word-break: keep-all;
}

.outfit-title h3 {
    font-size: 20px;
}

.outfit-price>span:first-child,
.outfit-accessory>span:first-child,
.outfit-quatity>span:first-child,
.outfit-size>span:first-child {
    min-width: 120px;
    font-weight: bold;
}

.outfit-price>span:last-child {
    font-size: 27px;
    font-weight: bold;
    color: red;
    margin-top: 25px;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.select-accessory,
.outfit-size-box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 30px;
}

.outfit-size-box .size-item {
    position: relative;
    display: inline-block;
    margin-right: 5px;
}

.size-item i {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    color: rgb(252, 70, 100);
}

.outfit-size-box .size-item label {
    min-width: 35px !important;
    height: 35px;
    text-align: center;
    line-height: 35px;
    white-space: nowrap;
    font-size: 12px;
    border: 1px solid #ccc;
    cursor: pointer;
    position: relative;
    padding: 0 10px;
}

.outfit-size-box .size-item .sd {
    border: 2px solid rgb(252, 70, 100);
}

.outfit-size-box .size-item .sd i {
    display: inline-block;
}

.select-accessory .accessory-item {
    padding: 5px 15px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.outfit-quatity {
    margin-top: 30px;
}

.outfit-add-cart {
    margin-top: 50px;
    flex-wrap: wrap;
}

.btn {
    color: purple;
    text-transform: uppercase;
    text-decoration: none;
    border: 2px solid purple;
    padding: 10px 20px;
    font-size: 17px;
    font-weight: bold;
    background: transparent;
    position: relative;
    transition: all 1s;
    overflow: hidden;
}

.btn:hover {
    color: white;
}

.btn::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0%;
    top: 0;
    left: -40px;
    transform: skewX(45deg);
    background-color: purple;
    z-index: -1;
    transition: all 1s;
}

.btn:hover::before {
    width: 160%;
}

.outfit-description {
    margin: 50px 0;
}

.outfit-description .des-title-box,
.question .question-box {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}

.outfit-description .des-title-box .des-title,
.question .question-box .question-title {
    padding: 0 0 10px 0;
    border-bottom: 2px solid black;
    display: inline-block;
    text-transform: uppercase;
}

.outfit-description .des-content {
    text-align: justify;
    word-break: keep-all;
    margin: 30px 0;
}

.question-content {
    text-align: justify;
    word-break: keep-all;
    margin: 5px 0;
}

.question-item {
    margin: 5px 0;
    padding: 10px 0;
    border-bottom: 1px dashed #ccc;
}

.question-item-collapse {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.question-item-collapse span {
    font-size: 16px;
    font-weight: bold;
}

.answer {
    padding: 10px 20px 0 5px;
    font-size: 14px;
    margin-top: 5px;
    border-top: 1px dashed black;
}

.relative-outfit,
.history-outfit {
    margin-bottom: 50px;
}

.relative-header,
.history-header {
    font-size: 25px;
    font-weight: 500;
}

.outfit-container {
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
}
</style>
