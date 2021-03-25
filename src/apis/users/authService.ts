import req from '../https'

const LOGIN_API_URL = 'signin'
const REGIST_API_URL = 'regist'


class AuthService {

    login(user: object) {
        req('post', LOGIN_API_URL, JSON.stringify(user))
        // ?.then((res) => {
        //     console.log(res.data)
        //     if (res.data.token) {

        //         localStorage.setItem('token', res.data.token)
        //         localStorage.setItem('tokenExp', res.data.tokenExp)
        //         // localStorage.setItem('isLogin', 'true')
        //     }
        //     return res.data
        // })
    }

    logout() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('tokenExp')
        // localStorage.removeItem('isLogin')

    }

    regist(newUser: object) {
        req('post', REGIST_API_URL, JSON.stringify(newUser))?.then((res) => {
            if (res.data) {
                this.login(newUser)
            }
        })
    }
}


export default new AuthService()