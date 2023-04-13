import React, {useEffect, useState, useRef} from "react";
import {connect} from "react-redux";
import {Empty} from "antd";
import find from 'lodash/find';

import {messagesActions} from "../redux/actions";
import {Messages as BaseMessages} from "../components";
import socket from "../core/socket";

const Messages = ({
    //получаем из ../../redux/reducers/dialogs при помощи connect
    currentDialog,  
    //получаем из ../../redux/reducers/messages при помощи connect
    items,          
    //получаем из ../../redux/reducers/messages при помощи connect
    isLoading,      
    //получаем из ../../redux/reducers/user при помощи connect
    user,           
    //получаем из ../../redux/reducers/attachments при помощи connect
    attachments,    
    //функция получения всех сообщений с сервера получается из messagesActions  при помощи connect
    fetchMessages,
    //функция добавления сообщения получается из messagesActions  при помощи connect 
    addMessage,
    //функция удаления сообщения получается из messagesActions  при помощи connect
    removeMessageById 
}) => {
    //определение выделяемого файла в сообщении
    const [previewImage, setPreviewImage] = useState(null); 
    //определение высоты поднятия списка сообщений при загрузки файла для следующего сообщения
    const [blockHeight, setBlockHeight] = useState(135);
    //определение флага появления сигнализатора создания сообщения  
    const [isTyping, setIsTyping] = useState(false);       
   
    const messagesRef = useRef(null); 

    useEffect(() => {
        let typingTimeoutId = null;
        
        const toggleIsTyping = () => {
            setIsTyping(true);
            clearInterval(typingTimeoutId);
            typingTimeoutId = setTimeout(() => {
                setIsTyping(false);
            }, 3000)
        }

        //при включении этого сокета работает этот хук 
        socket.on("DIALOGS:TYPING", toggleIsTyping);
    },[])

    useEffect(() => {
        //проверка загрузки картинок
        if (attachments.length) {
            setBlockHeight(245);
        } else {
            setBlockHeight(135);
        }
        //при наличии количества загружаемых картинок работает этот хук
    },[attachments])

    useEffect(() => {
        if (currentDialog) {
            //текущий диалог currentDialog обновлен
            //из этой функции получаем все сообщения в диалоге с идентификатором currentDialog._id
            fetchMessages(currentDialog._id);
        }

        //тут сигнал о том что сообщение отправлено
        socket.on("SERVER:NEW_MESSAGE", addMessage);
        return () => {
            socket.removeListener("SERVER:NEW_MESSAGE",addMessage);
        }
        //список изменяемых обЪектов и вызываемых функций при которых перезапускается этот хук
    },[currentDialog,addMessage,fetchMessages]);
 
    useEffect(() => {
        if (currentDialog) messagesRef.current.scrollTo(0,99999);
        //список изменяемых обЪектов и вызываемых функций при которых перезапускается этот хук
    },[items, isTyping, currentDialog]);

    //если текущий диалог зарегистрирован то открываем сообщения этого диалога
    return (currentDialog ? 
        <BaseMessages 
            //авторизованный пользователь
            user={user}                         
            blockRef={messagesRef} 
            //список сообщений по конкретному диалогу 
            items={items}                        
            //функция удаления выбранного сообщения
            onRemoveMessage={removeMessageById}  
            //флаг показа сигнализатора создания сообщения
            isLoading={isLoading && !user}       
            //функция определения выделенного изображения некоторого сообщения
            setPreviewImage={setPreviewImage}  
            //выделенное изображение некоторого сообщения, которое показывается во весь экран  
            previewImage={previewImage}       
            //список сообщений поднимается при загрузке файлов для следующего сообщения   
            blockHeight={blockHeight} 
            //флаг сигнализатора создания сообщения           
            isTyping={isTyping}                  
            //собеседник диалога сообщений
            partner={                            
                user._id !== currentDialog.partner._id ? currentDialog.author : currentDialog.partner
            }
        /> : 
        <Empty description="Open dialog"/>
    )
}

export default connect(
    ({
        //dialogs получаем из ../../redux/reducers/dialogs.js
        dialogs,        
        //messages получаем из ../../redux/reducers/messages.js 
        messages,       
        //user получаем из ../../redux/reducers/user.js
        user,           
        //attachments получаем из ../../redux/reducers/attachments.js
        attachments     
    }) => {
        return ({
            //определяем текущий диалог по идентификатору диалога
            currentDialog: find(dialogs.items, { _id: dialogs.currentDialogId }),
            //список сообщений текущего диалога
            items: messages.items,
            //сигнализатор загрузки сообщений
            isLoading: messages.isLoading,
            //список всех новых загруженных файлов
            attachments: attachments.items,
            //данные авторизованного пользователя
            user: user.data
        })
    }, 
    //из messagesActions вытаскиваются функции fetchMessages, addMessage и removeMessageById
    messagesActions 
)(Messages);