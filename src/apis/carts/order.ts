import req from '@/apis/carts/mongo'

const ORDER_API_URL = 'order'

export default {

    getOrdersByUserName(userName: string) {
        return req('get', `${ORDER_API_URL}/${userName}`, '')
    },
    getOrderById(userName: string, id: string) {
        return req('get', `${ORDER_API_URL}/${userName}/${id}`, '')
    },
    createOrder(order: {}) {
        return req('post', ORDER_API_URL, order)
    },
    // updateCart(id: number, cart: {}) {
    //     console.log(JSON.stringify(cart))
    //     return req('put', `${ORDER_API_URL}/${id}`, cart)
    // }
}