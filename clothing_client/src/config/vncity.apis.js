
import axios from "axios";

export const vnapis = axios.create({
    baseURL: "https://vapi.vnappmob.com/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})