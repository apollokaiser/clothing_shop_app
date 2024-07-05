import ListCategory from '@/components/Admin/ListCategory.vue';
import axios from '@/config/axios';


/**
 * 
 * @param {Long} userId Mã người dùng
 * @param {List<Cart>} insertCart Danh sách các trang phục cần lưu 
 * @param {List<Cart>} deleteCart Danh sách các trang phục cần loại bỏ
 * @returns 
 */
export const saveCart = async(userId, insertCart, deleteCart=[])=>{
    const response = await axios.post("/gio-hang/luu-gio-hang", {
        maNguoiDung: userId,
        addCart: JSON.stringify(insertCart),
        deleteCart:  JSON.stringify(deleteCart)  
    })
    if(response.status === 200) {
        return true;
    } else {
        return response;
    }
}
export const saveOrder = async(cartItem, cartDetail, orderDetail, user=null) =>{
        let order = {
            tenNguoiNhan: orderDetail.tenNguoiNhan,
            sdtNguoiNhan: orderDetail.sdtNguoiNhan,
            diaChiNguoiNhan: orderDetail.diaChiNguoiNhan,
            ghiChu: "",
            ngayNhan: orderDetail.ngayNhan,
            tamTinh: orderDetail.tamTinh,
            tongUuDai: orderDetail.tongUuDai,
            tongThue: orderDetail.tamTinh - orderDetail.tongUuDai,
            nguoiDung:user==null ? null : user.uid,
            phieuKhuyenMai:orderDetail.maKhuyenMai,
            payment:"DIRECT"
        }
        const listOrderDetail = [];
        cartItem.forEach(item=>{
            let detail = cartDetail.find(cart=> cart.id == item.id)
            let giaTien = item.full ? detail.giaTronBo : detail.giaTien;
            listOrderDetail.push({
                maTrangPhuc: item.id,
                soLuong: Number(item.quantity),
                maKichThuoc: item.size,
                toanPhan: item.full,
                giaTien: giaTien,
                discount: item.discount,
                khuyenMai: item.promotion,
                tongTien: Number(giaTien * item.quantity - item.discount)
            })
        })
        order.chiTiet = listOrderDetail;
        console.log(user);
        if(user){
            const response = await axios.post("/thanh-toan/thanh-toan-khach-hang", {
                    order
            })
            if(response.status ==200) {
                return response.data;
            } else {
                return response;
            }
        } else {
            const response = await axios.post("/thanh-toan/thanh-toan-tien-loi",{
                order
            })
            console.log(response);
            if(response.status ==200) {
                return response.data;
            } else {
                return response;
            }
        }
    
}

export const sendEmailResetPass = async(email)=>{
    const response = await axios.get("/auth/reset-password?email=" + email);
    console.log(response);
    if(response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const resetPassword = async(email, newPassword, resetCode)=>{
    const response = await axios.post("/auth/reset-password", {
        email,
        newPassword,
        oldPassword:"",
        resetCode
    })
    if(response.status === 200) {
        return response.data;
    } else {
        return response.data;
    }
}
export const addAddress = async(address) =>{
   const response = await axios.post('/user/add-address', address);
   if(response.status === 200) {
     return response.data;
   } else {
    return null;
   }
}

export const deleteAddress = async(id) =>{
    const response = await axios.delete(`/user/delete-address?id=${id}`);
    if(response.status === 200) {
      return true;
    } else {
     return false;
    }
}
export const setDefault = async(id, setDefault)=>{
    const response = await axios.put(`/user/set-default-address`, {
        id,
        setDefault
    });
    if(response.status === 200) {
        return true;
    }
    return false;
}

export const addPromotion = async(data, ids) =>{
    const response = await axios.post("/khuyen-mai/save-promotion", {
        khuyenMai:data,
        ids
    })
    console.log(response);
    if(response.status === 200) {
        return response.data.data.promotion_id;
    } else {
        return false;
    }

}
export const deletePromotion = async(id)=>{
    const response = await axios.delete(`/khuyen-mai/delete-promotion?id=${id}`);
    if(response.status === 200) {
        return response.data;
    } else {
        return response.data;
    }
}
export const updatePromotion =  async(data, ids) =>{
    const response = await axios.post("/khuyen-mai/update-promotion", {
        khuyenMai:data,
        ids
    })
    console.log(response);
    if(response.status === 200) {
        return response.data.data.promotion_id;
    } else {
        return false;
    }

}