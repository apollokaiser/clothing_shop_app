import { vnapis } from "@/config/vncity.apis";


export const getProvinces = async() =>{
    const response = await vnapis.get("/province/");
    if(response.status === 200) {
        return response.data.results;
    } else {
        return null;
    }
}

export const getDistricts = async(provinceId) =>{
    const response = await vnapis.get(`/province/district/${provinceId}`);
    if(response.status === 200) {
        return response.data.results;
    } else {
        return null;
    }
}

export const getWards = async(districtId) =>{
    const response = await vnapis.get(`/province/ward/${districtId}`);
    if(response.status === 200) {
        return response.data.results;
    } else {
        return null;
    }
}