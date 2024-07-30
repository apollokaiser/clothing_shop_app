import axios from "@/config/axios";

export const init = async(ids=null)=>{
    const response = await axios.post("/trang-phuc/public/get-init", {ids},
        {
            headers: {
               'Content-Type': "application/json",
            },
        }
    );
    if(response.status === 200) {
        return response.data.data;
    } else {
        return null;
    }
}

export const getOutfit = async(page=0,size=10)=>{
    const response = await axios.get(`/trang-phuc/public/danh-sach?page=${page}&size=${size}`);
    if(response.status === 200) {
        return response.data.data.trangphucs;
    } else {
        return null;
    }
}
export const getUpdateOutfit = async (id)=>{
    const response = await axios.get(`/trang-phuc/xem-thong-tin-trang-phuc?id=${id}`);
    if(response.status === 200) {
        return response.data.data.trangPhuc;
    } else {
        return null;
    }
}
export const getCategory = async()=>{
    const response = await axios.get("/danh-muc/danh-sach-danh-muc");
    if(response.status === 200) {
        return response.data.data.theloais;
    } else {
        return null;
    }
}
export const getSize = async() =>{
    const response = await axios.get("/kich-thuoc/get-kich-thuoc");
    if(response.status === 200) {
        return response.data.data.kichthuocs;
    } else {
        return null;
    }
}
export const getCart = async(userId) =>{
    const response = await axios.get(`/gio-hang/danh-sach?uid=${userId}`);
    if(response.status === 200) {
        return response.data.data;
    } else {
        return null;
    }
}
export const getOutFitDetail = async(id) =>{
    const response = await axios.get(`/trang-phuc/public/chi-tiet-trang-phuc/${id}`);
    console.log(response);
    if(response.status === 200) {
        return response.data.data.trangPhuc;
    } else {
        return null;
    }
}
export const getCartItems = async(cartList)=>{
    if(cartList && Array.isArray(cartList)) {
        const response = await axios.post("/trang-phuc/public/trang-phuc-gio-hang", {
            ids: cartList.map(item => item.parentId)
        });
        if(response.status === 200) {
            return response.data.data.cart_details;
        } else {
            return null;
        }
    }
}
export const getPromotionCategory = async ()=>{
    const response = await axios.get("/khuyen-mai/danh-sach-khuyen-mai-danh-muc");
    if(response.status === 200) {
        return response.data.data.theloai_promotions;
    } else {
        return null;
    }
}
export const getPromotionPayment = async()=>{
    const response = await axios.get("/khuyen-mai/danh-sach-khuyen-mai-thanh-toan");
    if(response.status === 200) {
        return response.data.data.khuyenmai_thanhtoans ? response.data.data.khuyenmai_thanhtoans:null;
    } else {
        return null;
    }
}
export const getPromotionCode =async(code) =>{
    const response = await axios.get(`/khuyen-mai/check-code?code=${code}`);
    if(response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const search =async(keyword, page=0) =>{
    const response = await axios.get(`/trang-phuc/public/tim-kiem?keyword=${keyword}&page=${page}`);
    if(response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const getOrders = async(uid) => {
    const response = await axios.get(`/user/get-orders?uid=${uid}`);
    if(response.status === 200) {
        return response.data.data.order;
    } else {
        return null;
    }
}
export const getPromotions = async() => {
    const response = await axios.get(`/khuyen-mai/get-promotions`);
    if(response.status === 200) {
        return response.data.data.khuyenmais;
    } else {
        return null;
    }
}
export const getCategoryInPromotion = async(id) => {
    const response = await axios.get(`/khuyen-mai/get-category-in-promotion?id=${id}`);
    if(response.status === 200) {
        return response.data.data.category_ids;
    } else {
        return null;
    }
}
export const getStaffs = async() => {
    const response = await axios.get(`/admin/staff/get-all-staff`);
    console.log(response);
    if(response.status === 200) {
        return response.data.data.staffs;
    } else {
        return null;
    }
}
export const getStaffDetail = async(aid) => {
    const response = await axios.get(`/admin/staff/get-staff?id=${aid}`);
    if(response.status === 200) {
        return response.data.data.admin;
    } else {
        return null;
    }
}
export const getRoles = async() => {
    const response = await axios.get(`/admin/staff/get-roles`);
    if(response.status === 200) {
        return response.data.data.roles;
    } else {
        return null;
    }
}
export const getDonThue = async(status=1, page=0, size=10) => {
    const response = await axios.get(`/don-thue/get-don-thue?status=${status}&page=${page}&size=${size}`);
    console.log(response);
    if(response.status === 200) {
        return response.data.data.orders;
    } else {
        return null;
    }
}
export const getOrderCount = async() => {
    const response = await axios.get(`/don-thue/unconfirm-order-count`)
    if(response.status === 200) {
        return response.data.data.orderCount;
    } else {
        return null;
    }
}
export const getAttenttion = async(ids) => {
    if(ids.length === 0) {return null}
    const response = await axios.post(`/trang-phuc/public/get-attention-outfit`,{ids});
    if(response.status === 200) {
        return response.data.data.attentions_outfit;
    } else {
        return null;
    }
}
export const getOutfitByCategory = async(id, page=0, size=12) => {
    if(!id) return null
    const response = await axios.get(`/danh-muc/danh-sach-trang-phuc?id=${id}&page=${page}&size=${size}`);
    if(response.status === 200) {
        return response.data.data.trangphucs;
    } else {
        return null;
    }
}
export const getOrderDetail = async(id) => {
    const response = await axios.get(`/don-thue/chi-tiet-don-thue?id=${id}`);
    if(response.status === 200) {
        return response.data.data.order_detail;
    } else {
        return null;
    }
}
export const getRelateOutfit = async(id, page=0, size=6) => {
    const response = await axios.get(`/danh-muc/danh-sach-trang-phuc?id=${id}&page=${page}&size=${size}`);
    console.log(response);
    if(response.status === 200) {
        return response.data.data.trangphucs;
    } else {
        return null;
    }
}
export const getAllPromotion = async(page=0, size=6) => {
    const response = await axios.get(`/khuyen-mai/tat-ca-danh-sach-khuyen-mai?page=${page}&size=${size}`);
    console.log(response);
    if(response.status === 200) {
        return response.data.data.promotions;
    } else {
        return null;
    }
}

