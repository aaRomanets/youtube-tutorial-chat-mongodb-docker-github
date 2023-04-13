import React from 'react';
import classNames from "classnames";
import format from "date-fns/format";
import isToday from "date-fns/is_today";
import {Link} from "react-router-dom";

import {Avatar} from "..";

//получаем время создания сообщения
const getMessageTime = createdAt => {
    if (isToday(createdAt)) {
        return format(createdAt,'HH:mm');    
    } else {
        return format(createdAt, 'DD.MM.YYYY');
    }
}

//проверяем написал ли авторизованный пользователь последнее сообщение
const renderLastMessage = (message, userId) => {
    let text = '';
    //проверяем есть ли прикрепленный файл к последнему сообщению
    if (!message.text && message.attachments.length) {
        text = 'attached file'; 
    } else {
        text = message.text;
    }
    return `${message.user._id === userId ? 'You: ' : ''} ${text}`;
}

const DialogItem = ({
    //идентификатор диалога в списке
    _id,                
    //идентификатор автоизованного пользователя
    userId,             
    //идентификатор текущего диалога 
    currentDialogId,    
    //собеседник диалога
    partner,           
    //последнее сообщение
    lastMessage        
}) => {

    return (
        //Связь с сайтом /dialog/${_id} при нажатии 
        <Link to={`/dialog/${_id}`}> 
            <div className={classNames("dialogs__item",{
                "dialogs__item--online": partner.isOnline,
                //является ли диалог в списке текущем
                "dialogs__item--selected": currentDialogId === _id 
                })}
            >
                {/*Аватарка диалога по имени собеседника*/}
                <div className="dialogs__item-avatar">
                    <Avatar user={partner}/>
                </div>
                <div className="dialogs__item-info">
                    <div className="dialogs__item-info-top">
                        {/*Фиксируем имя собеседника*/}
                        <b>{partner.fullname}</b>
                        {/*Фиксируем время последнего сообщения от автора или собеседника*/}
                        <span>
                            {lastMessage != null && getMessageTime(lastMessage.createdAt)}
                        </span>
                    </div>
                    <div className="dialogs__item-info-bottom">
                        {/*фиксируем последнее сообщение (если оно есть, так как диалог может быть чистым)*/ }
                        <p>
                            {lastMessage != null && 
                            (renderLastMessage(lastMessage, userId))}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default DialogItem;