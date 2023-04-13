import React from 'react';
import {Form,  Input} from "antd";
import Icon from '@ant-design/icons';
import {Button, Block} from '../../../components/index';
import {validateField} from "../../../utils/helpers";
import {Link} from "react-router-dom";

const LoginForm = props => {
    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        isSubmitting 
    } = props;

    return (
        <div>
            <div className="auth__top">
                <h2>Log in to your account</h2>
                <p>Please log in to your account.</p>
            </div>
            <Block>
                <Form  onSubmit={handleSubmit} className="login-form">
                    {/*Почта авторизуемого пользователя*/}
                    <Form.Item  
                        validateStatus={validateField("email",touched,errors)}
                        help={!touched.email ? "" : errors.email}
                        hasFeedback
                    >
                        <Input 
                            id="email"
                            prefix = {
                                <Icon type={"mail"} style={{color: "rgba(0,0,0,0.25)"}}/>
                            } 
                            size="large"
                            placeholder="E-Mail"  
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    {/*Пароль авторизуемого пользователя*/}
                    <Form.Item                         
                        validateStatus={validateField("password",touched,errors)}
                        help={!touched.password ? "" : errors.password}
                        hasFeedback
                    >
                        <Input 
                            id = "password"
                            prefix = {
                                <Icon type={"lock"} style={{color: "rgba(0,0,0,0.25)"}}/>
                            } 
                            size="large"
                            type="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    <Form.Item>
                        {isSubmitting && !isValid && <span>Ошибка!</span>}
                        <Button 
                            disabled={isSubmitting}
                            onClick={handleSubmit} 
                            type="primary" 
                            size="large" 
                            className="auth-button"
                        > 
                            Log in to your account
                        </Button>
                    </Form.Item>
                    {/*Переход на страницу регистрации пользователя*/}
                    <Link className="auth__register-link"  to="/signup">
                        Register 
                    </Link>
                </Form>
            </Block>        
        </div>
    )
}

export default LoginForm;
