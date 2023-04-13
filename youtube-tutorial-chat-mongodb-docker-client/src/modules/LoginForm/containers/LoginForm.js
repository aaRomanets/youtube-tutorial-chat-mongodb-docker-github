import {withFormik} from 'formik';

import LoginForm from "../components/LoginForm";

import validateForm from "../../../utils/validate.js";
import {userActions} from "../../../redux/actions";

import store from "../../../redux/store";

const LoginFormContainer =  withFormik({
    enableReinitialize: true,
    mapPropsToValues: () => ({
        email: '',
        password: ''
    }),
    validate: values => {
        let errors = {};
        validateForm({isAuth: true, values, errors});
        return errors;
    },
    //функция авторизации пользователя
    handleSubmit: (values, {setSubmitting, props}) => {
        store.dispatch(userActions.fetchUserLogin(values)).then(({status}) => 
        {
            //пользователь авторизован по токену
            if (status === 'success')
            {
                props.history.push('/');    
            }
            setSubmitting(false);
        })
        .catch(() => 
        {
            setSubmitting(false);
        })
    },
    displayName: "LoginForm"
})(LoginForm)

export default LoginFormContainer;
