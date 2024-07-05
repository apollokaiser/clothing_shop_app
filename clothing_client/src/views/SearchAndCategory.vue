<template>
    <div class="mt-2">
        <RouterView />
        <div class="search-content-container container">
            <div v-if="outfit.length == 0" class="no-outfit">
                <div class="notification-content">
                    <div class="notification-message">Hiện không có sản phẩm nào !</div>
                    <div class="notification-img">
                        <img src="/images/toppng.com-bunny-ramen-cute-gifs-kawaii-png-kawaii-kawaii-bunny-bunny-eating-noodles-gif-500x636.png"
                            alt="">
                    </div>
                    <Link to="/"><button class="button" role="button">Trở lại ngay</button>
                    </Link>
                </div>
            </div>
            <div v-else class="has-outfit">
                <Outfit v-for="item in outfit" :key="item.id" :outfit="item" />
                <!--outfit -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-content-container {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.search-content-container .no-outfit {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
.search-content-container .has-outfit{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.search-content-container .no-outfit .notification-content {
    display: flex;
    width: 40%;
    height: 40%;
    align-items: center;
    padding: 12px;
    justify-content: center;
    flex-direction: column;
}

.search-content-container .no-outfit .notification-content .notification-message {
    padding: 5px;
    background-color: #ccc;
    border-radius: 10px;
    position: relative;
    color: brown;
    font-family: "JetBrains Mono", monospace;
    border: 1px solid #a6a4a4;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

}

.notification-message::after {
    width: 20px;
    height: 10px;
    content: "";
    background-color: #ccc;
    position: absolute;
    bottom:0%;
    left: 0%;
    transform: rotate(60deg);
}

.search-content-container .no-outfit .notification-img {
    width: 100%;
    height: 150px;
    padding: 20px;

}

.search-content-container .no-outfit div:first-child {
    font-size: 24px;
    color: #999;
}

.search-content-container .no-outfit a {
    font-size: 18px;
    color: blue;
}

.button {
    align-items: center;
    appearance: none;
    background-color: #EEF2FF;
    border-radius: 8px;
    border-width: 2px;
    border-color: #536DFE;
    box-shadow: rgba(83, 109, 254, 0.2) 0 2px 4px, rgba(83, 109, 254, 0.15) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    color: #536DFE;
    cursor: pointer;
    display: inline-flex;
    font-family: "JetBrains Mono", monospace;
    height: 56px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 24px;
    padding-right: 24px;
    position: relative;
    text-align: center;
    text-decoration: none;
    transition: box-shadow 0.15s, transform 0.15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow, transform;
    font-size: 20px;
}

.button:focus {
    outline: none;
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(83, 109, 254, 0.4) 0 2px 4px, rgba(83, 109, 254, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button:hover {
    box-shadow: rgba(83, 109, 254, 0.3) 0 4px 8px, rgba(83, 109, 254, 0.2) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
}

.button:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
}
</style>
<script setup>
import { RouterView } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import Outfit from '@/components/Outfit.vue';
import { search } from '@/data.function/getData';
import Link from '@/components/Link.vue';
const route = useRoute();
const router = useRouter();
const outfit = ref([]);
onBeforeMount(() => {
    if (route.path.includes('danh-muc')) {
        // get Category  
    } else if (route.path.includes('tim-kiem')) {
        let keyword = route.params.keyword;
        if (keyword) {
            search(keyword).then(response => {
                if (response.status == 200)
                 console.log(response);
                    outfit.value = response.data.trangphucs;
            })
        }
    } else {
        router.push("/");
    }
})
</script>