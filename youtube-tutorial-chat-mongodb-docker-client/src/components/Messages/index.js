import React from 'react';
import {Modal} from "antd";
import PropTypes from "prop-types";
import {Empty,Spin} from "antd";
import classNames from "classnames";

import Message from "../Message";

import "./Messages.scss";

//список сообщений
const Messages = ({
    //авторизованный пользователь
    user,               
    blockRef, 
    //список сообщений по конкретному диалогу 
    items,             
    //функция удаления выбранного сообщения 
    onRemoveMessage,   
    //флаг показа сигнализатора создания сообщения
    isLoading,          
    //функция определения выделенного изображения некоторого сообщения
    setPreviewImage,    
    //выделенное изображение некоторого сообщения, которое показывается во весь экран
    previewImage,       
    //список сообщений поднимается при загрузке файлов для следующего сообщения
    blockHeight,        
    //флаг синнализатора создания сообщения
    isTyping,           
    //собеседник диалога сообщений
    partner             
}) => {

    return (
        //при загрузке файлов сообщения поднимаются на blockHeight 
        <div style = {{height: `calc(100% - ${blockHeight}px)`}}>
            <div
                ref = {blockRef}
                className={classNames("messages",{"messages--loading":isLoading})}
            >
                {
                    isLoading  ? 
                    (
                        //Идет загрузка сообщений 
                        <Spin size="large" tip="Uploading messages..."/>
                    ) 
                    : items && !isLoading ? 
                    (
                        items.length > 0 ? 
                        (
                            //загружаем все сообщения если они есть
                            items.map(item => {
                                return (               
                                    //загружаем по одному сообщению
                                    <Message  
                                        key={item._id}
                                        //флаг создания сообщения
                                        isTyping={false}
                                        //isMe - флаг, который сигнализирует о том идет ли сообщение от пользователя к собеседнику или наоборот
                                        isMe={user._id === item.user._id}
                                        //bind потому что функция onRemoveMessage в правой части является функцией
                                        //removeMessageById из файла "../../redux/actions/messages"

                                        //функция удаления сообщения
                                        onRemoveMessage={onRemoveMessage.bind(this,item)} 
                                        //функция выделения изображения в сообщении
                                        setPreviewImage={setPreviewImage} 
                                        {...item} 
                                    />
                                )
                            })
                        )
                        : 
                        (
                            //сообщение нет в диалоге
                            <Empty description="Empty dialog"/>
                        )
                    )
                    : 
                    (
                        //necessary to open dialog
                        <Empty description="Open dialog"/>
                    )
                }
                {
                    //Detector about, that message is being created
                    isTyping && 
                    (
                        <Message 
                            isTyping={isTyping} 
                            user={partner} 
                        />
                    )
                }
                {/*we opening modal window of selected file of message */}
                <Modal
                    visible={!!previewImage}
                    onCancel={() => setPreviewImage(null)}
                    footer={null}
                >
                    <img src={previewImage} style={{width: "100%"}} alt="Preview"/>
                </Modal>
            </div>
        </div>
    )
};

Messages.propTypes = {
  items: PropTypes.array
};

export default Messages;