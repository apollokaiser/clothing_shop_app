export const ACCEPT_PROVINCES = ['79', '75', '74', '72', '80']
export const ROLES = {
    USER: 'ROLE_USER',
    ADMIN: 'ROLE_ADMIN',
    FULL_CONTROL:"FULL_CONTROL",
    SUPER_ACCOUNT: 'SUPER_ACCOUNT',
    PROMOTION_UPDATE:'PROMOTION_UPDATE',
    OUTFIT_UPDATE:'OUTFIT_UPDATE',
}
export const UPDATE_ROLE = [
    {FULL_CONTROL:ROLES.FULL_CONTROL},
    {PROMOTION_UPDATE:ROLES.PROMOTION_UPDATE},
    {OUTFIT_UPDATE:ROLES.OUTFIT_UPDATE},
]

export const STATUS ={
    UNCONFIRM:{code:1, status:"Chờ giao hàng", description:"Thuê trang phục đã đặt thành công và chờ nhân viên xác nhận" },
    CONFIRMED:{code:2, status:"Đã đặt cọc", description:"Nhân viên đã xác nhận thuê trang phục" },
    DELIVERING:{code:3, status:"Đã giao", description:"Người dùng hiện đang nhận được trang phục như yêu cầu" },
    DESTROYED:{code:4, status:"Hủy đơn", description:"Thuê trang phục đã bị hủy bỏ"},
    RETURNED:{code:5, status:"Đã hoàn trả", description:"Người dùng đã trả trang phục cho nhân viên"},
}