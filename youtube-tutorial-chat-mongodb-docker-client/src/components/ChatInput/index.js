import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { UploadField } from "@navjobs/upload";
import { Picker } from "emoji-mart";

import { UploadFiles } from "../index";

import AudioIcon from '@ant-design/icons/AudioOutlined';
import CheckCircleIcon from '@ant-design/icons/CheckCircleOutlined';
import LoadingIcon from '@ant-design/icons/LoadingOutlined';
import CameraIcon from '@ant-design/icons/CameraOutlined';
import CloseIcon from '@ant-design/icons/CloseOutlined';
import SmileIcon from '@ant-design/icons/SmileOutlined';

import "./ChatInput.scss";

const { TextArea } = Input;

const ChatInput = props => {
    const {
        //отправляемый текст в сообщение
        value,              
        //функция определения отправляемого текста в сообщение
        setValue,           
        //флаг появления списка смайлов
        emojiPickerVisible,
        //функция управления значением флага появления списка смайлов 
        toggleEmojiPicker, 
        //добавляем смайл в сообщение
        addEmoji,           
        //отправляем сообщение по клавише Enter с кодом 13
        handleSendMessage,  
        //Отправляем сообщение по кнопке галочка 
        sendMessage,        
        //функция сбора файлов для отправки в сообщение
        onSelectFiles,      
        //список отправляемых файлов в сообщение
        attachments,         
        //функция удаления файла из отправляемых в сообщение
        removeAttachment,    
        //флаг записи звука
        isRecording,        
        //запись начинается
        onRecord,            
        //запись прервана
        onHideRecording,    
        //флаг загрузки звукового сообщения
        isLoading           
    } = props;

  return (
    <Fragment>
        <div className="chat-input">
            <div>
                <div className="chat-input__smile-btn">
                    <div className="chat-input__emoji-picker">
                        {/*Появляется список со смайлами при  emojiPickerVisible === true*/}
                        {emojiPickerVisible && (
                            <Picker onSelect={emojiTag => addEmoji(emojiTag)} set="apple" />
                        )}
                    </div>
                    {/*Кнопка появления списка со смайлами*/}
                    <SmileIcon
                        onClick={toggleEmojiPicker}
                        type="link"
                        shape="circle"
                    />
                </div>
                {isRecording ? (
                    <div className="chat-input__record-status">
                        {/* Сигнализатор записи */}
                        <i className="chat-input__record-status-bubble"></i>
                        Recording...
                        {/*Кнопка прерывания записи */}
                        <CloseIcon
                            onClick={onHideRecording}
                            type="link"
                            shape="circle"
                            className="stop-recording"
                        />
                    </div>
                ) : (
                    //Поле ввода сообщения от пользователя к собеседнику
                    //сообщение отправляется на сервер при нажатии клавиши Enter c кодом 13 
                    <TextArea
                        onChange={e => setValue(e.target.value)}
                        onKeyUp={handleSendMessage}
                        size="large"
                        placeholder="Enter the text of the message…"
                        value={value}
                        autosize={{ minRows: 1, maxRows: 6 }}
                    />
                )
                }

                <div className="chat-input__actions">
                    {/*Загрузка файлов*/ }        
                    <UploadField
                        //функция фиксации выбранных файлов onSelectFiles
                        onFiles={onSelectFiles}
                        containerProps={{
                            className: "chat-input__actions-upload-btn"
                        }}
                        uploadProps={{
                            accept: ".jpg,.jpeg,.png,.gif,.bmp",
                            multiple: "multiple"
                        }}
                    >
                        {/*Кнопка появления списка с файлами*/}
                        <CameraIcon type="link" shape="circle"/>
                    </UploadField>
                    

                    {isLoading ? (
                        //сигнализатор загрузки звукового сообщения или сообщения в виде файлов
                        <LoadingIcon type="link" shape="circle" />
                        ) : isRecording || value || attachments.length ? (
                            
                        //кнопка отправления любого сообщения (звукового, файлов, текста) от пользователя к собеседнику 
                        <CheckCircleIcon
                            onClick={sendMessage}
                            type="link"
                            shape="circle"
                        />
                        ) : 
                        (
                            //кнопка записи звукового сообщения от пользователя к собеседнику
                            <div className="chat-input__record-btn">
                                <AudioIcon  
                                    onClick={onRecord}  
                                    type="link"  
                                    shape="circle"
                                />
                            </div>
                        )
                    }
                </div>
                
            </div>
            {attachments.length > 0 && (
                //загрузчик файлов
                <div className="chat-input__attachments">
                    <UploadFiles
                        //посылаем функцию удаления файлов
                        removeAttachment={removeAttachment}
                        //посылаем выбранные файлы
                        attachments={attachments}
                    />
                </div>
            )}
        </div>
    </Fragment>
  );
};

ChatInput.propTypes = {
    className: PropTypes.string
};

export default ChatInput;