import React, {useState, useRef, useEffect} from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";
import {Popover, Button} from "antd";
import Icon from '@ant-design/icons';
import {Emoji} from "emoji-mart";
import reactStringReplace from "react-string-replace";

import {convertCurrentTime, isAudio} from "../../utils/helpers";

import waveSvg from "../../assets/img/wave.svg";
import playSvg from "../../assets/img/play.svg";
import pauseSvg from "../../assets/img/pause.svg";

import {Avatar, IconReaded, Time} from "..";


import './Message.scss';

//вывод аудио сообщения 
const MessageAudio = ({
    //аудио-источник звукового сообщения
    audioSrc 
}) => {
    //аудио-элемент звукового сообщения
    const audioElem = useRef(null);                    
    //определяем флаг прослушивания звукового сообщения                                                 
    const [isPlaying, setIsPlaying] = useState(false); 
    //определяем долю длительности прослушивания звукового сообщения
    const [progress, setProgress] = useState(0);      
    //определяем текущее время сколько уже слушается звуковое сообщение 
    const [currentTime, setCurrentTime] = useState(0);

    //управление звуковым сообщением запуск - пауза
    const tooglePlay = () => {
        if (!isPlaying) {
            //начинаем слушать звуковое сообщение
            audioElem.current.play();
        } else {
            //ставим паузу, прекращаем звуковое сообщение слушать
            audioElem.current.pause();
        }
    };

    useEffect(() => {
        //громкость звукового сообщения
        audioElem.current.volume="0.1"; 
        //слушаем звуковое сообщение
        audioElem.current.addEventListener(
            'playing', 
            () => {
                setIsPlaying(true);
            },
            false
        );
        //конец звукового сообщения
        audioElem.current.addEventListener(
            'ended', 
            () => {
                setIsPlaying(false);
                setIsPlaying(false);
                setCurrentTime(0);
            },
            false
        );
        //звуковое сообщение поставлено на паузу
        audioElem.current.addEventListener(
            'pause', 
            () => {
                setIsPlaying(false);
            },
            false
        );
        audioElem.current.addEventListener('timeupdate',() => {
            const duration = audioElem.current ? audioElem.current.duration : 0;
            //время которое прошло по звуковому сообщению
            setCurrentTime(audioElem.current.currentTime);
            //шкала проигрывания звукового сообщения
            setProgress((audioElem.current.currentTime/duration)*100);
        });
    },[]);

    return (
        <div className="message__audio">
            {/*Связь между аудио-источником и аудио-элементом звукового сообщения*/}
            <audio ref={audioElem} src={audioSrc} preload="audio"/>
            <div className="message__audio-progress" style={{width: progress+'%'}}></div>
            <div className="message__audio-info">
                <div className="message__audio-btn">
                    <button onClick={tooglePlay}>
                        {isPlaying ? (
                        //звуковое сообщение прослушивается, можно поставить его на паузу
                        <img src={pauseSvg} alt="Pause svg"/>
                        ): (
                        //звуковое сообщение стоит на паузе можно продолжать его послушивать
                        <img src={playSvg} alt="Play svg"/>
                        )}
                    </button>
                </div>
                <div className="message__audio-wave">
                    <img src={waveSvg} alt="Wave svg"/>
                </div>
                <span className="message__audio-duration">
                    {/*конвертируем время прослушивания звукового сообщения*/}
                    {convertCurrentTime(currentTime)}
                </span>
            </div>
        </div>
    )
}

const Message = ({
    //флаг создания сообщения
    isTyping,          
    //isMe - флаг, который сигнализирует о том идет ли сообщение от пользователя к собеседнику или наоборот
    isMe,              
    //функция удаления сообщения
    onRemoveMessage,    
    //функция выделения изображения в сообщении
    setPreviewImage,    
    //авторизованный пользователь
    user,               
    //текст сообщения
    text,               
    //время создания сообщения
    createdAt,          
    //статус прочитано
    readed,             
    //файлы сообщения
    attachments         
}) => {

    const renderAttachment = item => {

        if (item.ext !== "webm") {
            //Выводим файл
            return (
                <div 
                    key={item._id}
                    //выделяем сообщение на все окно веб страницы
                    onClick={() => setPreviewImage(item.url)}
                    className="message__attachments-item"
                >
                    <div className="message__attachments-item-overlay">
                        <Icon type="eye" style={{color: "white", fontSize: 18}}/>
                    </div>    
                    <img src={item.url} alt={item.filename}/>
                </div>
            )
        } else {
            //Выводим звуковое сообщение
            return (
                <MessageAudio key={item._id} audioSrc={item.url}/>
            )
        }
    }

    return (
        <div 
            className={classNames("message",{
                //верстка сообщения от авторизованного пользователя
                'message--isme': isMe,                    
                //верстка сигнализатора создания сообщения 
                'message--is-typing': isTyping,           
                //верстка звукового сообщения
                'message--is-audio': isAudio(attachments),
                //верстка сообщения из одного файла
                'message--image':                         
                    !isAudio(attachments) && 
                    attachments && 
                    attachments.length === 1 && 
                    !text,
            })}
        >
            <div className="message__content">
                {/*Иконка которая указывает о том пишет ли сообщение авторизованный пользователь или оно прочитано собеседником*/}
                <IconReaded isMe={isMe} isReaded={readed}/>
                {/*Окно удаления сообщения*/}
                <Popover
                    content={
                    <div>
                        <Button onClick={onRemoveMessage}>Remove message</Button>
                    </div>
                    }
                    //событие удаления сообщения
                    trigger="click" 
                >
                    <div className="message__icon-actions">
                        <Button type="link" shape="circle" icon="delete" />
                    </div>
                </Popover>
                {/*Аватарка пользователя*/}
                <div className="message__avatar">
                    <Avatar user={user}/>
                </div>
                {/*Само сообщение*/}
                <div className="message__info">
                    {(text || isTyping) && (
                        <div className="message__bubble">
                            {text &&  (
                                //Вывод текстового сообщения с возможным смайлом
                                <p className="message__text">
                                    {reactStringReplace(text, /:(.+?):/g, (match, i) => (
                                        <Emoji key={i} emoji={match} set="apple" size={16} />
                                    ))}
                                </p>
                            )} 
                            {/*Вывод сигнализатора создания сообщения */}
                            {isTyping && (
                                <div className="message__typing"> 
                                    <span />
                                    <span />
                                    <span />    
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/*Вывод файлового сообщения*/}
                    {attachments && (  
                        <div className="message__attachments">
                            {attachments.map((item,index) => renderAttachment(item))}
                        </div>
                    )}
                    
                    {/*Вывод времени создания сообщения*/}
                    {createdAt && (
                        <span className="message__date">
                            <Time date={createdAt}/>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

Message.defaultProps = {
    user: {}
}

Message.propTypes = {
    avatar: PropTypes.string,
    text: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.object,
    attachments: PropTypes.array,
    isMe: PropTypes.bool,
    isReaded: PropTypes.bool,
    isTyping: PropTypes.bool,
    audio: PropTypes.string
}

export default Message;