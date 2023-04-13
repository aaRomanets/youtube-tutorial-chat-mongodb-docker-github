import React from 'react';
import PropTypes from "prop-types";
import readedSvg from "../../assets/img/readed.svg";
import noReadedSvg from "../../assets/img/noreaded.svg";

const IconReaded = ({
    //флаг говорящий о том исходит ли сообщение от авторизованного пользователя 
    isMe,           
    //флаг говорящий о том прочитано ли сообщение от авторизованного пользователя собеседником или нет
    isReaded        
}) => {
    return (
        (isMe && (isReaded ? 
        (
            //вводим статус прочитано если сообщение прочитал собеседник (две галочки)
            <img 
                className="message__icon-readed" 
                src={readedSvg} 
                alt="Readed icon" 
            />
        ) : (
            // вводим статус не прочитано если сообщение не прочитал собеседник (одна галочка)
            <img
                className="message__icon-readed"
                src={noReadedSvg}
                alt="No readed icon"
            />
        ))) || null
    )
};

IconReaded.propTypes = {
  isMe: PropTypes.bool,
  isReaded: PropTypes.bool
};

export default IconReaded;
