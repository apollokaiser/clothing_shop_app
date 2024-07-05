import { defineStore } from "pinia"
import { ref } from "vue"

export const useAdminStore = defineStore("admin", ()=>{
    const categoryPromotion = ref([])
    
    const pushCategory = (id) =>{
        categoryPromotion.value.push(id)
    }
    const removeCategory = (id)=>{
        if(categoryPromotion.value.length >0)
        categoryPromotion.value = categoryPromotion.value.filter(item=>item!==id)
    }
    const resetCategory = () =>{
        categoryPromotion.value = []
    }
    return {
        categoryPromotion,
        pushCategory,
        removeCategory,
        resetCategory
    }
})