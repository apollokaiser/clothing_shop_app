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
    text = text.replace(/[^a-z0-9\-]/g, '');  // Loại bỏ các ký tự không phải chữ cái, số, hoặc dấu gạch ngang
    text = text.replace(/\-+/g, '-');         // Loại bỏ các dấu gạch ngang lặp lại
    
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