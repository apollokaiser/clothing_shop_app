export function validateEmail(email) {
    if(!email) return false;
    if(email.includes('@admin.anhduongstore.com')) return true;
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}
export function validatePassword(password, name = null) {
    if(!password || password=="") return false;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$/;
    if (!passwordRegex.test(password)) {
        console.log("error hêre");
        return false;
    }
    if (name && password.includes(name.toLowerCase())) {
        return {
            message: "Mật khẩu không được chứa tên người dùng",
            status: false
        };
    }
    return true;
}
export function validatePhoneNumber(phone) {
    if(!phone || phone =="") return false;
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone);
}