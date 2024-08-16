import unorm from 'unorm';
import { ROLES } from './constant';

export function sortSizes(sizes) {
    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    sizes?.sort((a, b) => {
        return sizeOrder.indexOf(a.maKichThuoc) - sizeOrder.indexOf(b.maKichThuoc);
    });

    return sizes;
}
export function convertToSlug(text) {
    if(!text) return null;
    text = text?.toLowerCase();
    text = text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    text = text.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    text = text.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    text = text.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|��|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    text = text.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    text = text.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    text = text.replace(/đ/g, "d");
    text = text.replace(/\s+/g, '-');         // Thay thế khoảng trắng bằng dấu gạch ngang
    text = text.replace(/[^a-z0-9\\-]/g, '');  // Loại bỏ các ký tự không phải chữ cái, số, hoặc dấu gạch ngang
    text = text.replace(/\\-+/g, '-');         // Loại bỏ các dấu gạch ngang lặp lại
    
    return text.replace(/^-+|-+$/g, ''); 
}
export function shortCurrency(num) {
    if(isNaN(num)) return "";
    let str = num.toString();
    // Tìm vị trí của ba số 0 cuối cùng
    let lastThreeZerosIndex = str.lastIndexOf('000');
    
    // Nếu tìm thấy ba số 0 cuối cùng, thay thế chúng bằng 'K'
    if (lastThreeZerosIndex !== -1) {
        return str.slice(0, lastThreeZerosIndex) + 'K' + str.slice(lastThreeZerosIndex + 3);
    }
    
    // Nếu không tìm thấy ba số 0, trả về chuỗi ban đầu
    return str;
}
export function isValidDate(date) {
    let today = new Date();
    let minDate = new Date(today);
    let maxDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    maxDate.setFullYear(today.getDate + 7);
    return date >= minDate && date <= maxDate;
}
export function normalizeString(str) {
    str = str.toLowerCase();
    return unorm.nfkd(str).replace(/[\u0300-\u036f]/g, '');
}
export function timeDifference(longValue) {
    if(!longValue) return {
        status:"Không xác định",
        code:0
    }
    // Chuyển đổi long từ giây sang milliseconds
    const timeInMilliseconds = longValue * 1000;
    
    // Lấy thời gian hiện tại
    const now = Date.now();
    
    // Tính sự chênh lệch
    const difference = now - timeInMilliseconds;
    
    // Chuyển đổi sự chênh lệch thành các đơn vị thời gian
    const minutes = Math.floor(difference / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);
    
    // Sử dụng switch case để hiển thị kết quả theo đơn vị phù hợp
    switch (true) {
        case (minutes < 5):
            return {
                status:"Đang hoạt động",
                code:1
            };
        case (years >= 1):
            return {
                status: `${years} năm trước`,
                code: 2
            };
        case (days > 30):
            return {
                status: `30 ngày trước`,
                code: 2
            };
        case (weeks > 0):
            return {
                status: `${weeks} tuần trước`,
                code: 2
            };
        case (days > 0):
            return  {
                status: `${days} ngày trước`,
                code: 2
            };
        case (hours > 0):
            return {
                status: `${hours} giờ trước`,
                code: 2
            };
        default:
            return {
                status: `${minutes} phút trước`,
                code: 2
            };
    }
}
export function getRole(role) {
    switch (role) {
        case ROLES.SUPER_ACCOUNT:
            return "Tổng quản lý";
        case ROLES.FULL_CONTROL:
            return "Quản lý";
        case ROLES.OUTFIT_UPDATE:
            return "Nhân viên kho"
        case ROLES.PROMOTION_UPDATE:
            return "Nhân viên khuyến mãi";
        default:
            return "Không xác định";
    }
}
export function findCategoryById(root, maLoai) {
    if (root.maLoai == maLoai) {
      return root;
    }
    if (root.children) {
      for (const child of root.children) {
        const result = findCategoryById(child, maLoai);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }