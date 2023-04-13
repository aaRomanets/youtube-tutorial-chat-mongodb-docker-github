const initialState = {
    //данные плльзователя
    data: null,                       
    //токен пользователя
    token: window.localStorage.token, 
    //флаг пользователя
    isAuth: false                     
}

const user = (state=initialState, {type,payload}) => {
    switch (type) {
        //получаем всю информацию об авторизованном пользователе
        case "USER:SET_DATA":
            return {
                ...state,
                data: payload,
                isAuth: true,
                token: window.localStorage.token
            };
        //получаем информацию о том авторизован ли пользователь или нет
        case "USER:SET_IS_AUTH":
            return {
                ...state,
                isAuth: payload
            };
        default:
            return state;
    }
}

export default user;