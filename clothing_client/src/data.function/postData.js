import ListCategory from '@/components/Admin/ListCategory.vue';
import axios from '@/config/axios';
import { storage } from '@/config/firebase.conf';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


/**
 * 
 * @param {Long} userId Mã người dùng
 * @param {List<Cart>} insertCart Danh sách các trang phục cần lưu 
 * @param {List<Cart>} deleteCart Danh sách các trang phục cần loại bỏ
 * @returns 
 */
export const saveCart = async (userId, insertCart, deleteCart = []) => {
    const response = await axios.post("/gio-hang/luu-gio-hang", {
        maNguoiDung: userId,
        addCart: JSON.stringify(insertCart),
        deleteCart: JSON.stringify(deleteCart)
    })
    if (response.status && response.status === 200) {
        return true;
    } else {
        return response;
    }
}
export const addCart = async(cartItem) => {
    const cart = {
        id: cartItem.id,
        quantity: Number(cartItem.quantity),
        size: cartItem.size,
        parentId: cartItem.parentId
    }
    const response = await axios.post(`/gio-hang/v2/luu-gio-hang`, cart) 
    if (response.status && response.status === 200) {
        return true;
    } else {
        return response;
    }
}
export const updateCart = async(cart) => {
    const response = await axios.post(`/gio-hang/v2/cap-nhat-gio-hang`, cart) 
    if (response.status && response.status === 200) {
        return true;
    } else {
        return response;
    }
}
export const updateOutfitInCart = async(newItem, oldItem) => {
    const response = await axios.post(`/gio-hang/v2/cap-nhat-gio-hang`, {
        newItem,oldItem
    }) 
    if (response.status && response.status === 200) {
        return true;
    } else {
        return response;
    }
}
export const deleteCart = async(cart) => {
    const response = await axios.post(`/gio-hang/v2/xoa-gio-hang`, cart) 
    if (response.status && response.status === 200) {
        return true;
    } else {
        return response;
    }
}
export const saveOrder = async (cartItem, cartDetail, orderDetail, user = null, paymentMethod=1) => {
    let order = {
        tenNguoiNhan: orderDetail.tenNguoiNhan.trim(),
        sdtNguoiNhan: orderDetail.sdtNguoiNhan,
        diaChiNguoiNhan: orderDetail.diaChiNguoiNhan,
        ghiChu: "",
        ngayNhan: orderDetail.ngayNhan,
        tamTinh: orderDetail.tamTinh,
        tongUuDai: orderDetail.tongUuDai,
        tongThue: orderDetail.tamTinh - orderDetail.tongUuDai,
        nguoiDung: !user ? null : user.uid,
        phieuKhuyenMai: orderDetail.maKhuyenMai,
        payment: "DIRECT"
    }
    const listOrderDetail = [];
    cartItem.forEach(item => {
        let outfitPiece = null;
        if (item.id == item.parentId) outfitPiece = cartDetail.find(outfitCart => outfitCart.id == item.parentId)
        else {
            let detail = cartDetail.find(outfitCart => outfitCart.id == item.parentId)
            outfitPiece = detail.manhTrangPhucs.find(p => p.id == item.id);
        }
        listOrderDetail.push({
            outfitSizeId: {
                maTrangPhuc: item.id,
                maKichThuoc: item.size,
            },
            soLuong: Number(item.quantity),
            giaTien: outfitPiece.giaTien,
            discount: item.discount,
            khuyenMai: item.promotion,
            tongTien: Number(outfitPiece.giaTien * item.quantity - item.discount)
        })
    })
    order.chiTiet = listOrderDetail;
    if (user) {
        if(paymentMethod ==1){
            const response = await axios.post("/thanh-toan/thanh-toan-khach-hang", {
                order
            })
            if (response.status == 200) {
                return response.data;
            } else {
                return response;
            }
        } else {
            order.payment = "ONLINE";
            let deposit = order.tongThue /2;
            let depositAmount = Math.ceil(deposit / 1000) * 1000;
            const response = await axios.post(`/payment/dat-coc-don-thue?amount=${depositAmount}&bandCode=NCB`,{
                order
            });
            if(response.status == 200) {
               return response.data;
            } else {
                return null;
            }
        }
        
     }  

}

export const sendEmailResetPass = async (email) => {
    const response = await axios.get("/auth/reset-password?email=" + email);
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const resetPassword = async (email, newPassword, resetCode) => {
    const response = await axios.post("/auth/reset-password", {
        email,
        newPassword,
        oldPassword: "",
        resetCode
    })
    if (response.status === 200) {
        return response.data;
    } else {
        return response.data;
    }
}
export const addAddress = async (address) => {
    const response = await axios.post('/user/add-address', address);
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const editAddress = async (address, updateDefault = false) => {
    const response = await axios.post('/user/update-address', {
        address,
        updateDefault
    });
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}

export const deleteAddress = async (id) => {
    const response = await axios.delete(`/user/delete-address?id=${id}`);
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}
export const setDefault = async (id, setDefault) => {
    const response = await axios.put(`/user/set-default-address`, {
        id,
        setDefault
    });
    if (response.status === 200) {
        return true;
    }
    return false;
}

export const addPromotion = async (data, ids) => {
    const response = await axios.post("/khuyen-mai/save-promotion", {
        khuyenMai: data,
        ids
    })
    console.log(response);
    if (response.status === 200) {
        return response.data.data.promotion_id ? response.data.data.promotion_id : null;
    } else {
        return false;
    }

}
export const deletePromotion = async (id) => {
    const response = await axios.delete(`/khuyen-mai/delete-promotion?id=${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        return response.data;
    }
}
export const updatePromotion = async (data, ids, deleteIds) => {
    const response = await axios.put("/khuyen-mai/update-promotion", {
        khuyenMai: data,
        ids,
        deleteIds
    })
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return false;
    }

}
export const addOutfit = async (trangPhuc, images) => {
    if (images.length == 0) return null;
    let result = await uploadFiles(images);
    if (!result) return null;
    trangPhuc.hinhAnhs = result;
    const response = await axios.post('/trang-phuc/them-trang-phuc', trangPhuc);
    console.log(response);
    if (response?.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
const uploadFiles = async (images) => {
    if (!images.length) return;
    const uploadedFilesRefs = [];
    let imagesLink = [];
    try {
        for (const file of images) {
            const storageReference = ref(storage, `outfit/${file.name}`);
            const metadata = {
                contentType: file.type
            };
            const snapshot = await uploadBytes(storageReference, file, metadata);
            uploadedFilesRefs.push(storageReference);
            const downloadURL = await getDownloadURL(snapshot.ref);
            imagesLink.push(downloadURL);
            console.log('File available at', downloadURL);
        }
        console.log('All files uploaded successfully');
        return imagesLink;
    } catch (error) {
        console.error('Upload failed', error);
        const deletePromises = uploadedFilesRefs.map(ref => deleteObject(ref));
        await Promise.all(deletePromises);
        console.log('All uploaded files deleted due to an error');
        return null;
    }
};
export const deleteOutfit = async (id) => {
    const response = await axios.delete(`/trang-phuc/xoa-trang-phuc?id=${id}`);
    console.log(response);
    if (response.status === 200 && response.data.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const lockOutfit = async (ids) => {
    const response = await axios.post('/trang-phuc/ngung-cho-thue', { ids });
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const unlockOutfit = async (id) => {
    const response = await axios.get(`/trang-phuc/mo-khoa-trang-phuc?id=${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export const updateOutfit = async (trangPhuc, uploadImg = null, removeImage = null) => {
    if (uploadImg && uploadImg.length != 0) {
        let result = await uploadFiles(uploadImg);
        if (!result) return null;
        trangPhuc.hinhAnhs = [...trangPhuc.hinhAnhs, ...result];
    }
    if (removeImage && removeImage.length != 0) {
        trangPhuc.hinhAnhs = trangPhuc.hinhAnhs.filter(item => !removeImage.includes(item));
        removeImage.forEach(item => {
            deleteFileByUrl(item).then();
        })
    }
    if (!uploadImg && !removeImage) {
        trangPhuc.hinhAnhs = [];
    }
    console.log(trangPhuc);
    const response = await axios.put('/trang-phuc/cap-nhat-trang-phuc', trangPhuc );
    console.log(response);
    if (response.status === 200) {
        return response.data;
    } else {
        return null;
    }
}
export async function deleteFileByUrl(fileUrl) {
    try {
        // Tách đường dẫn từ URL
        const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
        const regex = new RegExp(`${baseUrl}(.*?)/o/(.*?)(\\?.*)?$`);
        const match = fileUrl.match(regex);

        if (!match || match.length < 3) {
            throw new Error('Invalid Firebase Storage URL');
        }

        const encodedPath = match[2];
        const filePath = decodeURIComponent(encodedPath);

        // Tạo tham chiếu tới file
        const fileRef = ref(storage, filePath);

        // Xóa file
        await deleteObject(fileRef);
        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

export const insertStaff = async (info) => {
    const response = await axios.post("/admin/staff/add-staff", info)
    if (response.status === 200) {
        return response.data;
    }
    return null;
}
export const removeStaff = async (id) => {
    const response = await axios.delete(`/admin/staff/delete-staff?id=${id}`)
    if (response.status === 200) {
        return response.data;
    }
    return null;
}
export const lockStaff = async (id) => {
    const response = await axios.get(`/admin/staff/lock-staff?id=${id}`)
    if (response.status === 200) {
        return response.data;
    }
    return null;
}
export const unclockStaff = async (id) => {
    const response = await axios.get(`/admin/staff/unlock-staff?id=${id}`)
    if (response.status === 200) {
        return response.data;
    }
    return null;
}
export const updateStaff = async (info, id) => {
    const response = await axios.post(`/admin/staff/update-staff`, {
        id,
        tenNguoiDung: info.tenNguoiDung,
        email: info.adminEmail,
        sdt: info.sdt
    })
    console.log(response);
    if (response.status === 200) {
        return response.data;
    }
    return null;
}
export const addDeposit = async (datCoc) => {
    const response = await axios.post(`/don-thue/dat-coc`, datCoc)
    console.log(response);
    if (response.status === 200) {
        return response.data;
    }
    return null;
}
export const updateStatusOrder = async (id, status) => {
    const response = await axios.get(`/don-thue/change-status?id=${id}&status=${status}`)
    console.log("updateStatusOrder");
    console.log(response);
    if (response.status === 200) {
        return response.data.data.trangThai;
    }
    return null;
}
export const completedOrder = async (data) => {
    const response = await axios.post(`/don-thue/xuat-phieu-hoan-tra`, data)
    console.log(response);
    if (response.status === 200) {
        return true;
    }
    return null;
}
export const changeRole = async (data) => {
    const response = await axios.post("/admin/staff/change-role", data);
    if (response.status === 200 && response.data.data == null) {
        return true;
    } else {
        return false;
    }
}
export const depositOrder = async (order) => {
    const response = await axios.post("/payment/dat-coc-don-thue", order);
    if(response.status ==200) {
        return response.data.data.paymentUrl;
    } else {
        return null;
    }
}
export const lockOutfitSize = async (size, id) => {
    const response = await axios.get(`/trang-phuc/ngung-cho-thue-kich-thuoc?size=${size}&id=${id}`);
    if(response.status == 200) {
        return true;
    } else {
        return false;
    }
}
export const unlockOutfitSize = async (size, id) => {
    const response = await axios.get(`/trang-phuc/mo-khoa-kich-thuoc?size=${size}&id=${id}`);
    if(response.status == 200) {
        console.log(response);
        return true;
    } else {
        return false;
    }
}
export const insertCategory = async (theLoai) => {
    const response = await axios.post("/danh-muc/update/insert-category", theLoai);
    console.log(response);
    if(response.status == 200 && response.data.status === 200) {
        return response.data.data.theloai;
    } else {
        return null;
    }
}
export const deleteCategory = async (id, deleteAll) => {
    const response = await axios.get(`/danh-muc/update/delete-category?id=${id}&deleteAll=${deleteAll}`);
    console.log(response);
    if(response.status == 200 && response.data.status === 200) {
        return true;
    } else {
        return null;
    }
}
export const updateCategory = async (theLoai) => {
    const response = await axios.post("/danh-muc/update/update-category", theLoai);
    console.log(response);
    if(response.status == 200 && response.data.status === 200) {
        return response.data.data.theloai;
    } else {
        return null;
    }
}
export const updateTheChan = async (id, theChan) =>{
    const response = await axios.get(`/don-thue/update-the-chan?id=${id}&theChan=${theChan}`);
    console.log(response);
    if(response.status == 200) {
        return true;
    } else {
        return false;
    }
}
export const updateNgayNhan = async (id, date) =>{
    const response = await axios.get(`/don-thue/update-ngay-nhan?id=${id}&date=${date}`);
    console.log(response);
    if(response.status == 200) {
        return true;
    } else {
        return false;
    }
}