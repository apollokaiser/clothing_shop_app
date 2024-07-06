import axios from "@/config/axios";



export const ApplicationStarter = async()=>{
    const categoryResponse = await axios.get("/danh-muc/danh-sach-danh-muc");
    const outfitResponse = await axios.get("/trang-phuc/danh-sach");
    if(categoryResponse.status == 200 || outfitResponse.status == 200){
        return {
            categoryResource: categoryResponse.data.data.theloais,
            outfitResource: outfitResponse.data.data.trangphucs
        }
    } else {
        return null;
    }
}
export const getCategory = async()=>{
    const categoryResponse = await axios.get("/danh-muc/danh-sach-danh-muc");
    if(categoryResponse.status === 200) {
        return categoryResponse.data.data.theloais;
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
    const response = await axios.get(`/trang-phuc/chi-tiet-trang-phuc/${id}`);
    if(response.status === 200) {
        return response.data.data.trangPhuc;
    } else {
        return null;
    }
}
export const getCartItems = async(cartList)=>{
    if(cartList && Array.isArray(cartList)) {
        const response = await axios.post("/trang-phuc/trang-phuc-gio-hang", {
            ids: cartList.map(item => item.id)
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
        return response.data.data.khuyenmai_thanhtoans;
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
export const search =async(keyword) =>{
    const response = await axios.get(`/trang-phuc/tim-kiem?keyword=${keyword}`);
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
