import React, {useState} from "react";
import {connect} from "react-redux";
import {userApi, dialogsApi} from "../utils/api";

import {Sidebar} from "../components";

const SidebarContainer = (props) => {
    const {
        //user - авторизованный пользователь из ../../redux/reducers/user при помощи connect
        user 
    } = props;

    //определяем флаг открытия модального окна создания диалога 
    const [visible, setVisible] = useState(false);                
    //определяем метку поиска имени собеседника 
    const [inputValue, setInputValue] = useState("");             
    //определяем текстовое сообщение собеседнику
    const [messageText, setMessageText] = useState("");     
    //определяем список собеседников   
    const [users, setUsers] = useState([]);    
    //определяем флаг загрузки имен всех пользователей, соответствующих метке inputValue                 
    const [isLoading, setIsLoading] = useState(false);        
    //идентификатор выбранного собеседника   
    const [selectedUserId, setSelectedUserId] = useState(false); 

    //скрываем модальное окно создания диалога
    const onClose = () => {
        setVisible(false)
    }

    //показываем модальное окно создания диалога
    const onShow = () => {
        setVisible(true);
    }
    
    const onSearch = (value) => {
        setIsLoading(true);
        //выводим список пользователей соответствующих нужному собеседнику
        userApi.findUsers(value).then(({data}) => {
            setUsers(data);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        })
    }

    const onAddDialog = () => {
        //создаем диалог от пользователя идентификатор которого определяется по токену пользователя на сервере
        //по идентификатору собеседника selectedUserId и по сообщению от собеседника к пользователю messageText
        dialogsApi
        .create({
            //собеседник
            partner: selectedUserId,  
            //сообщение собеседнику
            text: messageText         
        })
        .then(onClose)
        .catch(() => {
            setIsLoading(false);
        }) 
    }

    const handleChangeInput = (value) => {
        //value - идентификатор выбранного собеседника
        setInputValue(value);    
    }

    const onChangeTextArea = e => {
        //определяем сообщение от собеседника к пользователю
        setMessageText(e.target.value);
    }

    const onSelectUser = (userId) => {
        //фиксируем идентификатор выбранного собеседника
        setSelectedUserId(userId);
    };

    return (
        <Sidebar 
            //авторизованный пользователь
            user={user}                         
            //метка поиска имени собеседника
            inputValue={inputValue}             
            //видимость модального окна создания диалога
            visible={visible}          
            //сообщение собеседнику         
            messageText={messageText}  
            //флаг загрузки имен всех пользователей, соответствующих метке inputValue       
            isLoading={isLoading}       
            //функция закрытия модального окна создания диалога        
            onClose={onClose}   
            //функция показа модального окна создания диалога              
            onShow={onShow}           
            //функция поиска собеседника по метке          
            onSearch={onSearch}                
            //функция изменения метки поиска имени собеседника
            onChangeInput={handleChangeInput}   
            // функция выбора идентификатора собеседника
            onSelectUser={onSelectUser}         
            //функция добавления диалога
            onModalOk={onAddDialog}             
            //функция составления сообщения собеседнику
            onChangeTextArea={onChangeTextArea} 
            //идентификатор собеседника
            selectedUserId={selectedUserId}    
            //список собеседников
            users={users}                       
        />    
    )
}

export default connect(
    ({
        //user получаем из ../../redux/reducers/user.js
        user 
    }) => ({
        //из user вытаскивается user - user.data
        user: user.data 
    })
)(SidebarContainer);