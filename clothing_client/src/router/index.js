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
        component: () => import("@/components/HomePage.vue"),
        meta: { transition: 'fade' }
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
        props: route => ({ ...route.params }),
        meta: { transition: 'fade' }
      },
      {
        path: 'gio-hang-cua-toi/:uid/:slug',
        name: "cart",
        component: () => import("@/components/Cart.vue"),
        props: route => ({ ...route.params }),
      },
      {
        path: 'thanh-toan',
        name: "payment",
        component: () => import("@/views/PaymentPage.vue"),
        props: route => ({ ...route.params }),
        meta: { requiresAuth: true, transition: 'fade',checkOrder: true },
        children:[
          {
            path:"thong-tin-thanh-toan/:uid/:slug",
            name: "payment-info",
            component: () => import("@/components/Payment.vue"),
            props: route => ({ ...route.params }),
            meta: { transition: 'fade',checkOrder: true }
          },
          {
            path:"trang-thai-thanh-toan/:orderId",
            name: "order-success",
            component: () => import("@/components/OrderState.vue"),
            props: route => ({ ...route.params }),
            meta: { transition: 'fade',checkOrder: true }
          },
        ]
      },
      {
        path:"thong-tin-thue-trang-phuc/:uid/:slug",
        name:"order-confirm",
        component: () => import("@/components/Order.vue"),
        props: route => ({ ...route.params }),
        meta: { requiresAuth: true, transition: 'fade', checkOrder: true}
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
        path:"dat-coc/:oid",
        name: "payment-confirm",
        component: () => import("@/components/Admin/Deposit.vue"),
        props: route => ({...route.params }),
      },
      {
        path:"don-thue/:id",
        name: "order",
        component: () => import("@/components/Admin/OrderManagement/OrderInfo.vue"),
        props: route => ({...route.params }),
      },
      {
        path:'bao-cao',
        name:'report',
        component: () => import("@/components/Admin/Report.vue"),
      },
      {
        path:'nhan-vien',
        name:'admin-staff',
        component: () => import("@/components/Admin/Admin_Staff.vue"),
        children:[
          {
            path:'',
            name:'staff-list',
            component: () => import("@/components/Admin/AdminManagement/StaffContent.vue"),
          },
          {
            path:'thong-tin-nhan-vien/:aid',
            name:'staff-info',
            component: () => import("@/components/Admin/AdminManagement/StaffDetail.vue"),
            props: route => ({...route.params }),
            meta: { transition: 'fade' }
          },
          {
            path:'them-nhan-vien',
            name:'add-staff',
            component: () => import("@/components/Admin/AdminManagement/AddStaff.vue"),
            meta: { transition: 'fade' }
          },
          {
            path:'cap-nhat-nhan-vien/:id',
            name:'update-staff',
            component: () => import("@/components/Admin/AdminManagement/UpdateStaff.vue"),
            props: route => ({...route.params }),
          }
        ]
      }
      ,
      {
        path:'trang-phuc',
        name:'admin-product',
        component: () => import("@/components/Admin/Admin_OutfitPage.vue"),
        children:[
          {
            path:'',
            name:'admin-product-list',
            component: () => import("@/components/Admin/OutfitManagement/Outfit_Content.vue"),
          },
          {
            path:'them-trang-phuc',
            name:'add-outfit',
            component: () => import("@/components/Admin/OutfitManagement/AddOutfit.vue"),
          },
          {
            path:'thong-tin-trang-phuc/:id',
            name:'outfit-info',
            component: () => import("@/components/Admin/OutfitManagement/OutfitInfo.vue"),
            props: route => ({...route.params }),
          },

          {
            path:'cap-nhat-trang-phuc/:id',
            name:'update-outfit',
            component: () => import("@/components/Admin/OutfitManagement/update.vue"),
            props: route => ({...route.params }),
          },
        ]
      },
      {
        path:'danh-muc-trang-phuc',
        name:'admin-category',
        component: () => import("@/components/Admin/OutfitManagement/Category.vue"),
      },
      {
        path:'khuyen-mai/danh-sach-khuyen-mai',
        name:'admin-promotion',
        component: () => import("@/components/Admin/PromotionComponent.vue"),
      },
      {
        path:'/khuyen-mai/thong-tin-khuyen-mai/:id',
        name:'promotion-info',
        component: () => import("@/components/Admin/PromotionManagement/PromotionDetail.vue"),
        props: route => ({...route.params }),
      },
      {
        path:"/admin-other-tasks",
        name: 'admin-other-tasks',
        component: () => import("@/views/Admin/OtherTasks.vue"),
        children:[
          {
            path:'banner',
            name:'admin-banner',
            component: () => import("@/components/Admin/BannerManager.vue"),
          }
        ]
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
  mode: 'history', // or 'hash'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //  linkActiveClass: 'nav-active-link',
  linkExactActiveClass:"active",
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
  } else if(to.matched.some(record => record.meta.adminRequire) && !auth.isAdmin) {
      next('/');
    }
    // else if(from.matched.some(record => record.meta.checkOrder) && !to.matched.some( record => record.meta.checkOrder)) {
    //   const cart = useCartStore();
    //   if(to.name=="cart"){
    //     cart.cancelPreOrder();
    //     next();
    //   }
    //   else {
    //     Swal.fire({
    //       title: "Thông báo",
    //       text: "Bạn đang đang thực hiện thuê trang phục,hủy ngay ?",
    //       icon: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#3085d6",
    //       cancelButtonColor: "#d33",
    //       confirmButtonText: "Tiếp tục",
    //       cancelButtonText: "Hủy ngay",
    //       allowOutsideClick:false
    //     }).then(result =>{
    //       if(result.isDismissed) {
    //         cart.cancelPreOrder();
    //         next();
    //       } else {
    //         return false;
    //         // next(from.fullPath);
    //       }
    //     })
    //   }
    // }
    next();
})

export default router
