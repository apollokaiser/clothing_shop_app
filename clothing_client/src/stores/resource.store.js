import { getPromotions } from "@/data.function/getData";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useResource = defineStore("resource", ()=>{
    const category = ref([])
    const promotions = ref([])
    const getCategory = computed(()=>{
        return category.value;
    })
    const setCategory = (data)=>{
        category.value = data;
    };
    const getCategoryChildren = (id)=>{
        return category.value.find(item=>item.maLoai === id);
    }
    const getPromotion = (id) =>{
        return promotions.value.find(item=>item.maKhuyenMai ==id);
}
    const setPromotion = (data)=>{
        promotions.value = data;
    }
    const pushPromotion = (data) =>{
        promotions.value.push(data)
    }
    const removePromotion = (id)=>{
        if(promotions.value.length >0)
        promotions.value = promotions.value.filter(item=>item!==id)
    }
    const resetPromotion = () =>{
        promotions.value = []
    }
    const loadPromotion = ()=>{
        getPromotions().then(res=>{
            setPromotion(res)
        })
    }
    return {
        category,
        promotions,
        getCategory,
        setCategory,
        getCategoryChildren,
        setPromotion,
        loadPromotion,
        getPromotion,
        pushPromotion,
        removePromotion,
        resetPromotion,
    }
})