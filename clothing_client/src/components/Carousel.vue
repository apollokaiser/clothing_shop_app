<template>
   <div id="outfit_banner" class="carousel slide my-2 carousel-fade" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active" data-bs-interval="2000">
      <img src="/images/slide1.jpg" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item" data-bs-interval="2000">
      <img src="/images/slide2.jpg" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item" data-bs-interval="2000">
      <img src="/images/slide3.jpg" class="d-block w-100" alt="...">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#outfit_banner" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#outfit_banner" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
</template>
<script setup>

</script>
<style scoped>
#outfit_banner {
  width: 100%;
  padding: 2px;
  border-radius: 5px;
  border: 1px solid #eee;
}
  .carousel-item {
    height: 500px;
    overflow: hidden;
    white-space: nowrap;
  }
  .carousel-item img {
   object-fit: fill;
   object-position: top center;
    width: 100%;
    height: 100%;
  }
  .carousel-control-prev>span,
  .carousel-control-next>span {
   transform: scale(2.0);
  }
</style>