import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAttenttion as getOutfitAttention } from "@/data.function/getData";


export const useInitStore = defineStore("init", () => {
    const attention = ref([])
    const outfit = ref([])
    const getAttenttion = computed(()=>{
        if(attention.value.length > 0) return attention.value;
        else return [];
    })
    const loadInitInstance = () =>{
        let storage = JSON.parse(localStorage.getItem("attention"));
        if(!storage || typeof storage !== "object" ){
            attention.value = [];
            return;
        }
        attention.value = storage;
    }
    const addAttenttion = (id)=>{
        if(attention.value.indexOf(id)== -1) 
        attention.value.push(id);
        localStorage.setItem("attention", JSON.stringify(attention.value));
    }
    const loadAttention = async() =>{
        if(attention.value.length === 0) return;
        const response = await getOutfitAttention(attention.value);
        if(!response) return;
        outfit.value = response;
    }
    const getAttenttionOutfit = computed(()=>{
        return outfit.value;
    })
    return {
        attention,
        outfit,
        loadInitInstance,
        getAttenttion,
        getAttenttionOutfit,
        addAttenttion,
        loadAttention
    }

});