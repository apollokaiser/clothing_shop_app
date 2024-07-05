export default function convertToVND(number) {
    try {
        if (isNaN(number)) {
            throw new Error("Giá trị nhập vào không hợp lệ");
        }
        let vnd = number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        return vnd;
    } catch (error) {
        return null;
    }
}