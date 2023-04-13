import {openNotification} from "../../utils/helpers";
import {userApi} from "../../utils/api";

const Actions = {
    //запрос на получение данных пользователя
    setUserData: data => ({
        type: "USER:SET_DATA",
        payload: data
    }),
    //запрос на авторизацию пользователя успешная она или нет
    setIsAuth: bool => ({
        type: "USER:SET_IS_AUTH",
        payload: bool
    }),
    //запрос на определение данных пользователя 
    fetchUserData: () => dispatch => {
        userApi.getMe().then(({data}) => {
            dispatch(Actions.setUserData(data));
        }).catch(err => {
            console.log(err);
            if (err.response.status === 403) {
                //ошибка считаем пользователя неавторизованным
                dispatch(Actions.setIsAuth(false));
                //удаляем его токен
                delete window.localStorage.token;
            }
        })
    },
    //авторизация пользователя
    fetchUserLogin: postData => dispatch => {
        return userApi.signIn(postData).then(({data}) => {
            const {token} = data;
            //Выводим сообщение о том что авторизация пользователя успещно завершена
            openNotification({
                title: "Great!",
                text: "Authorization is successful.",
                type: "success"
            })

            //получаем токен пользователя
            window.axios.defaults.headers.common["token"] = token;
            window.localStorage["token"] = token;
            
            //определяем данные пользователя
            dispatch(Actions.fetchUserData());

            //пользователь авторизован
            dispatch(Actions.setIsAuth(true));
            return data;
        }).catch(({response}) => {
            if (response.status === 403) {
                openNotification({
                    title: "Authorization error",
                    text: "Invalid login or password",
                    type: "error"
                })
            }
        })
    },
    
    //Регистрация пользователя
    fetchUserRegister: postData => () => {
        return userApi.signUp(postData).then(({data}) => {
            return data;
        });
    }
};

export default Actions;
