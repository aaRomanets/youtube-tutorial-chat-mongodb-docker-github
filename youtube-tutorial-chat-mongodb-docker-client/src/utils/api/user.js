import {axios} from "../../core";

const userApi = {    
    //авторизация пользователя
    signIn: (postData) => {
        return axios.post ("http://localhost:4024/user/signin",postData)
    },
    //регистрация пользователя
    signUp: (postData) => {
        return axios.post ("http://localhost:4024/user/signup",postData)
    },
    //получаем с сервера информацию о авторизованном пользователе
    getMe: () => {
        return axios.get ("http://localhost:4024/user/me")
    },
    //поиск собеседника
    findUsers: (query) => {
        return axios.get ("http://localhost:4024/user/find?query=" + query)
    }
}

export default userApi;
