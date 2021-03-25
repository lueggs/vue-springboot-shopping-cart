import req from '@/apis/carts/mongo'

const CART_API_URL = 'cart'

export default {

    getCartByUserName(userName: string) {
        return req('get', `${CART_API_URL}/${userName}`, '')
    },
    addCart(cart: {}) {
        return req('post', CART_API_URL, cart)
    },
    updateCart(id: number, cart: {}) {
        console.log(JSON.stringify(cart))
        return req('put', `${CART_API_URL}/${id}`, cart)
    }
}