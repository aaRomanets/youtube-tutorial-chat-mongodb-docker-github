import {withFormik} from 'formik';
import RegisterForm from "../components/RegisterForm";

import {userActions} from "../../../redux/actions";
import validateForm from "../../../utils/validate.js";

import store from "../../../redux/store";

export default withFormik({
    enableReinitialize: true,
    //шаблон данных по пользователю
    mapPropsToValues: () => ({
        email: '',
        fullname: '',
        password: '',
        password_2: ''
    }),
    //правильность введеных данных
    validate: values => {
        let errors = {};
        validateForm({isAuth: false, values, errors});
        return errors;
    },
    //регистрируем пользователя
    handleSubmit: (values, {setSubmitting, props}) => {
        store.dispatch(userActions.fetchUserRegister(values)).then(({status}) => 
        {
            if (status === undefined) 
            {
                props.history.push('/signin'); 
            }
            setSubmitting(false);
        })
        .catch(() => {
            setSubmitting(false);
        })
            
    },
    displayName: "RegisterForm"
})(RegisterForm)
