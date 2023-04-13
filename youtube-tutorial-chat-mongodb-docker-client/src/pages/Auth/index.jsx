import React from 'react';
import {Route} from "react-router-dom";

import {LoginForm,RegisterForm} from "../../modules";

import "./Auth.scss";

const Auth = () => {
    return (
        <section className="auth">
            <div className="auth__content">
                {/*маршрутизатор запуска страницы авторизации*/}
                <Route exact path="/signin" component={LoginForm}/>
                {/*маршрутизатор запуска страницы регистрации*/}
                <Route exact path="/signup" component={RegisterForm}/> 
            </div>
        </section>
    )
}

export default Auth;