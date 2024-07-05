import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '@/views/Admin/Admin.vue'
import { authStore } from '@/stores/user.store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    props: true,
    children: [
      {
        path: '',
        name: "homePage",
        component: () => import("@/components/HomePage.vue")
      },
      {
        path: 'dang-ky',
        name: "register",
        component: () => import("@/components/authentication/Register.vue")
      },
      {
        path: 'tai-khoan-nguoi-dung/:username/:uid',
        name: "account",
        component: () => import("@/components/Account.vue"),
        props: route => ({ ...route.params }),
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "account_profile",
            component: () => import("@/components/AccountProfile.vue"),
            meta: { transition: 'fade' }
          },
          {
            path:"thong-tin-dia-chi",
            name: "address",
            component: () => import("@/components/AddressPage.vue"),
            meta: { transition: 'fade' }
          },
          {
            path: "lich-su-thue",
            name: "lich-su-thue",
            component: () => import("@/components/OrderHistory.vue"),
            meta: { transition: 'fade' }
          }
        ]
      },
      {
        path: 'trang-phuc/:slug/:id',
        name: 'outfit',
        component: () => import("@/views/OutfitDetailPage.vue"),
        props: route => ({ ...route.params })
      },
      {
        path: 'gio-hang-cua-toi/:uid/:slug',
        name: "cart",
        component: () => import("@/components/Cart.vue"),
        props: route => ({ ...route.params }),
      },
      {
        path: 'thanh-toan/:uid/:slug',
        name: "payment",
        component: () => import("@/components/Payment.vue"),
        props: route => ({ ...route.params }),
        children: [
          {
            path: 'thanh-toan-thanh-cong',
            name: "order_success",
            component: () => import("@/components/OrderSuccess.vue")
          }
        ]
      },
      {
        path: '/danh-sach',
        name: 'search-and-category',
        component: () => import("@/views/SearchAndCategory.vue"),
        children: [
          {
            path: 'danh-muc/:id/:slug',
            name: "category",
            component: () => import("@/components/Category.vue"),
            props: route => ({ ...route.params })
          },
          {
            path: 'tim-kiem/:keyword',
            name: "search",
            component: () => import("@/components/Search.vue"),
            props: route => ({ ...route.params })
          }
        ]

      }
      //some one here
    ]
  },
  {
    path: '/auth',
    name: "authentication",
    component: () => import("@/views/Authentication.vue"),
    props: route => ({ ...route.params }),
    children: [
      {
        path: 'confirm',
        name: "confirm",
        component: () => import("@/components/authentication/ConfirmAccount.vue"),
        props: route => ({ ...route.params })
      },
      {
        path: 'thay-doi-mat-khau',
        name: 'reset-password',
        component: () => import("@/components/authentication/ResetPassword.vue"),
        props: route => ({ ...route.params })
      }
    ]
  },
  {
    path: '/chuyen-doi-tai-khoan',
    name: "welcome",
    component: () => import("@/views/Admin/Welcome.vue"),
    meta: { requiresAuth: true, adminRequire:true },
  },
  {
    path:'/admin',
    name: "admin",
    component: Admin,
    meta: { requiresAuth: true, adminRequire:true },
    children:[
      {
        path:'',
        name:'content',
        component: () => import("@/components/Admin/Content.vue"),
      },
      {
        path:'/khuyen-mai/danh-sach-khuyen-mai',
        name:'promotion',
        component: () => import("@/components/Admin/PromotionComponent.vue"),
      },
      {
        path:'/khuyen-mai/thong-tin-khuyen-mai/:id',
        name:'promotion-info',
        component: () => import("@/components/Admin/PromotionDetail.vue"),
        props: route => ({...route.params }),
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    component: () => import('@/views/NotFound.vue'),
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // linkActiveClass: 'nav-active-link',
  scrollBehavior(to, from, savedPosition) {
    if (to.path == "/") return savedPosition;
    return { top: 0, left: 0 };
    // else return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve({ left: 0, top: 0 })
    //     }, 500)
    // })
  }
})
router.beforeEach((to,from,next)=>{
  const auth = authStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !auth.isLoggedIn) {
    next('/');
  } else {
    if(to.matched.some(record => record.meta.adminRequire) && !auth.isAdmin) {
      next('/');
    }
    next();
  }
})

export default router
