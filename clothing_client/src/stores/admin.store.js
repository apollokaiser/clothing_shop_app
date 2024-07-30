import { defineStore } from "pinia"
import { ref } from "vue"

export const useAdminStore = defineStore("admin", ()=>{
    const choosedCategory = ref([])
    const choosedOutfit = ref([]);
    const pushCategory = (id) =>{
        choosedCategory.value.push(id)
    }
    const pushOutfit = (id) =>{
        choosedOutfit.value.push(id)
    }
    const removeCategory = (id)=>{
        if(choosedCategory.value.length >0)
        choosedCategory.value = choosedCategory.value.filter(item=>item.maLoai!=id)
    }
    const removeOutfit = (id)=>{
        
        if(choosedOutfit.value.length >0)
        choosedOutfit.value = choosedOutfit.value.filter(item=>item!=id)
    }
    const resetCategory = () =>{
        choosedCategory.value = []
    }
    const resetOutfit = () =>{
        choosedOutfit.value = []
    }
    const setAllOutfit =(ids)=>{
        choosedOutfit.value = ids;
    }
    return {
        choosedCategory,
        pushCategory,
        removeCategory,
        resetCategory,
        choosedOutfit,
        pushOutfit,
        removeOutfit,
        resetOutfit,
        setAllOutfit
    }
})