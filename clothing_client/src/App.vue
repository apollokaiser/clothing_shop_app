<script setup>
import { RouterView } from 'vue-router'
import { authStore } from './stores/user.store';
import { useCartStore } from './stores/cart.store';
import { usePromotionStore } from './stores/promotion.store';
import { useResource } from './stores/resource.store';
import {useInitStore} from './stores/init.store';

const auth = authStore();
const promotion = usePromotionStore();
const resource = useResource();
promotion.loadPromotionInstance();
promotion.paymentPromotionInstance();
auth.getUser()
resource.loadPromotion();
const cart = useCartStore();
cart.loadCartInstance();
const init = useInitStore();
init.loadInitInstance();
</script>

<template>
  <div>
    <RouterView />
  </div>
  <div class="trash" style="display: none;">
  </div>
</template>
