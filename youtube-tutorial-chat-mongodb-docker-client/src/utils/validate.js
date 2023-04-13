const validateForm = ({isAuth,values,errors}) => {
    const rules = {
        //шаблон почты
        email: value => {
            if (!value) {
                errors.email = "Enter E-Mail";
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
            ) {
                errors.email = "Incorrect E-Mail";
            }
        },
        //шаблон пароля
        password: value => {
            if (!value) {
                errors.password = "Enter password";
            } else if (!isAuth && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/i.test(value)) {
                errors.password = "The password is too easy";
            }
        },
        //проверка того что пароли должны совпадать
        password_2: value => {
            if ((!value || !values.password) || (!isAuth && value !== values.password)) {
                errors.password_2 = "Passwords don't match"
            } 
        },
        //нужно полное имя указать при регистрации
        fullname: value => {
            if (!isAuth && !value) {
                errors.fullname = "Enter your first and last name";
            }
        }
    };

    return  Object.keys(values).forEach(key => rules[key] && rules[key](values[key]));
}

export default validateForm;