<template>
    <a v-if="isExtenal" :href="to"><slot/></a>
    <!-- <router-link v-else v-bind="$props" custom="">
        <slot/>
        </router-link> -->
        <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>
<script setup>
import {computed} from 'vue'
import {RouterLink} from 'vue-router'
const props = defineProps({
    ...RouterLink.props,
    inactiveClass: String
})
 const isExtenal = computed(()=>{
    return typeof props.to === 'string' && props.to.startsWith('http');
})
</script>
<style>
    .active {
       /* Add your styles for active class here */
 
    }
    .inactive {
       /* Add your styles for inactive class here */
    }
</style>