import React from 'react';
import {Form} from "antd";
import Icon from '@ant-design/icons';
import {Button, Block, FormField} from '../../../components/index';
import {Link} from "react-router-dom";

const success = false;

const RegisterForm = props => {
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
            <span className="auth__top">
                <h2>Registration</h2>
                <p>To enter the chat, you need to register </p>
            </span>
            <Block>
                { !success ? (
                <Form  onSubmit={handleSubmit} className="login-form">
                    {/*Поле ввода почты*/}
                    <FormField 
                        name="email" 
                        icon="mail"
                        placeholder="E-Mail"
                        handleChange={handleChange}
                        handleBlur={handleBlur} 
                        touched={touched} 
                        errors={errors}
                        values={values}
                    />
                    {/*Поле ввода полного имени*/}
                    <FormField 
                        name="fullname" 
                        icon="user"
                        placeholder="Your first and last name"
                        handleChange={handleChange}
                        handleBlur={handleBlur} 
                        touched={touched} 
                        errors={errors}
                        values={values}
                    />
                    {/*Поле ввода пароля*/}
                    <FormField 
                        name="password" 
                        icon="lock"
                        placeholder="Password"
                        type="password"
                        handleChange={handleChange}
                        handleBlur={handleBlur} 
                        touched={touched} 
                        errors={errors}
                        values={values}
                    />
                    {/*Поле ввода для повторения пароля*/}
                    <FormField 
                        name="password_2" 
                        icon="lock"
                        placeholder="Repeat the password"
                        type="password"
                        handleChange={handleChange}
                        handleBlur={handleBlur} 
                        touched={touched} 
                        errors={errors}
                        values={values}
                    />
                    <Form.Item>
                        {isSubmitting && !isValid && <span>Ошибка!</span>}
                        {/*Кнопка регистрации пользователя*/}
                        <Button 
                            disabled={isSubmitting}
                            onClick={handleSubmit} 
                            type="primary" 
                            size="large" 
                            className="auth-button"
                        > 
                            Register
                        </Button>
                    </Form.Item>
                    {/*Переход на страницу авторизации пользователя*/}
                    <Link className="auth__register-link"  to="/signin">
                        Log in to your account
                    </Link>
                </Form>
                ) : (
                <div className="auth__success-block"> 
                    <div>
                        <Icon type="info-circle" theme="twoTone" />
                    </div>
                    <h2>Confirm your account</h2>
                        <p>An email has been sent to you with a link to confirm your account.</p>
                </div>
                )}
            </Block>        
        </div>
    )
}

export default RegisterForm;