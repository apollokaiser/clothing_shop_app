<template>
  <div>
    <div class="wrap-link mb-5">
      <div class="container breadcumb">
        <Link to="/"><span>Trang chủ</span></Link>
        <span class="mx-1">/</span>
        <span>Tìm kiếm trang phục</span>
        <span class="mx-1">/</span>
        <span>Hello</span>
      </div>
    </div>
    <div class="container">
        <h3>Tìm kiếm thông tin trang phục: {{ props.keyword }}</h3>
    </div>
  </div>
</template>
<script setup>
import Link from "./Link.vue";
const props = defineProps({
    keyword: { type: String, required: true }
  });
</script>
<style scoped>
.wrap-link {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  align-items: center;
}

.wrap-link .breadcumb {
  font-size: 15px;
  font-style: italic;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif,
    sans-serif;
}
</style>
