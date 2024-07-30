<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  ...RouterLink.props,
  inactiveClass: String,
  exactActiveClass: String, // Thêm exactActiveClass
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    exact
    v-slot="{ isActive, isExactActive, href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isExactActive ? exactActiveClass : (isActive ? activeClass : inactiveClass)"
    >
      <slot />
    </a>
  </router-link>
</template>
<style scoped>
/* .active {
  color: red;
} */
</style>