//функция проверки правильности заполнения полей при регистрации или авторизации пользователя
const validateField = (key,touched,errors) => {
    if (touched[key]) {
        if (errors[key]) {
            return "error";
        } else {
            return "success";
        }
    } else {
        return "";
    }
}

export default validateField;