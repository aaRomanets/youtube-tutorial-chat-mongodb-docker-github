import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import {dialogsActions} from "../redux/actions";
import socket from "../core/socket";

import {Dialogs as BaseDialogs} from "../components";

const Dialogs = (props) => {
    const {        
        //получаем по dialogs из ../../redux/reducers/dialogs при помощи connect
        currentDialogId,  
        //получаем по items из ../../redux/reducers/dialogs при помощи connect
        items,            
        //функция скачивания диалогов с сервера получается из dialogsActions  при помощи connect
        fetchDialogs,     
        //идентификатор авторизованного пользователя
        userId 
    } = props;

    //по этой строке ищется имя автора или собеседника нужного диалога
    const [inputValue, setValue] = useState('');

    //массив диалогов в частности при поиске конкретного
    const [filtred, setFiltredItems] = useState(Array.from(items));

    //функция поиска конкретного диалога по имени его автора или собеседника
    const onChangeInput = value => {
        setFiltredItems(items.filter(
            dialog => {
                return dialog.author.fullname.toLowerCase().indexOf(value.toLowerCase()) >=0 || 
                       dialog.partner.fullname.toLowerCase().indexOf(value.toLowerCase()) >=0
            }
        ));
        setValue(value);
    }

    useEffect(() => {
        if (!items.length) {
            //скачиваем диалоги с сервера если их нет
            fetchDialogs();
        } else{
            //фиксируем количество диалогов если они есть (оно может меняться)
            setFiltredItems(items);
        }
        
        //этот сокет сигнализирует о том что создан новый диалог
        socket.on('SERVER:DIALOG_CREATED', fetchDialogs);
        //этот сокет сигнализирует о том что в какие-то из диалогов добавлены новые сообщения
        socket.on('SERVER:NEW_MESSAGE', fetchDialogs);
        //при удалении из диалога последнего сообщения, последнее сообщение в диалоге может измениться
        socket.on('SERVER:CHANGE_LAST_MESSAGE',fetchDialogs);
        
        return () => {
            socket.removeListener('SERVER:DIALOG_CREATED', fetchDialogs);
            socket.removeListener('SERVER:NEW_MESSAGE', fetchDialogs);
            socket.removeListener('SERVER:CHANGE_LAST_MESSAGE', fetchDialogs);
        };
    },[fetchDialogs,items]);

    return (
        <BaseDialogs
            //идентификатор авторизованного пользователя
            userId = {userId}                 
            //список диалогов
            items={filtred}      
            //поиск диалогов           
            onSearch={onChangeInput}          
            //метка поиска автора или собеседника диалога
            inputValue={inputValue}           
            //идентификатор текущего диалога
            currentDialogId={currentDialogId} 
        />
    )
}

export default connect(
    ({
        //dialogs получаем из ../../redux/reducers/dialogs.js
        dialogs 
    }) => { 
        return (
            dialogs
        )
    }, 
        //из dialogsActions вытаскиваем функцию fetchDialogs
        dialogsActions 
    )
(Dialogs);