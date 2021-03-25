import req from '@/apis/https'


const GRACARD_API_URL = "graphics"
const BRAND_API_URL = "brand"

export default {

    getAllGracard() {
        return req('get', GRACARD_API_URL, '')
    },
    getOneGracard(id: number) {
        return req('get', `${GRACARD_API_URL}/${id}`, '')
    },
    getAllBrand() {
        return req('get', `${BRAND_API_URL}`, '')
    }
}