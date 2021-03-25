import axios from "axios"
// import store from "../store"
// import router from "../router/index"

const instance = axios.create({
    baseURL: "http://localhost:9090/",
    headers: {
        "Content-Type": "application/json"
    }
})

instance.interceptors.request.use(
    (config) => {
        // const token = store.state.auth.token
        const token = sessionStorage.getItem('token')
        token && (config.headers.Authorization = "Bearer " + token)
        return config
    },

)

export default function (method: string, url: string, data: string) {
    method = method.toLowerCase()
    if (method == 'get') {
        return instance.get(url)
    }
    if (method == 'post') {
        return instance.post(url, JSON.stringify(data))
    }
    if (method == 'put') {
        return instance.put(url, JSON.stringify(data))
    }
    if (method == 'delete') {
        return instance.delete(url)
    }


}