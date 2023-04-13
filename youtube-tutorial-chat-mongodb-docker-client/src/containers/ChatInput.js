import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {filesApi} from "../utils/api";
import socket from "../core/socket"

import { ChatInput as ChatInputBase} from "../components"

import {messagesActions, attachmentsActions} from "../redux/actions";

const ChatInput = (props) => {
    const {
        //получаем из ../../redux/reducers/dialogs при помощи connect
        dialogs: {currentDialogId},  
        //получаем из ../../redux/reducers/attachments при помощи connect
        attachments,                 
        //получаем из ../../redux/actions/messagesActions 
        fetchSendMessage,            
        //получаем из ../../redux/actions/attachmentsActions
        setAttachments,              
        //получаем из ../../redux/actions/attachmentsActions
        removeAttachment            
    } = props;

    window.navigator.getUserMedia = (
        window.navigator.getUserMedia ||
        window.navigator.mozGetUserMedia ||
        window.navigator.msGetUserMedia ||
        window.navigator.webkitGetUserMedia
    )

    //определение текста сообщения
    const [value, setValue] = useState('');                           
    //определение флага записи звука
    const [isRecording, setIsRecording] = useState('');               
    //задаем магнитофон
    const [mediaRecorder, setMediaRecorder] = useState(null);         
    //определение флага видимости списка со смайлами
    const [emojiPickerVisible, setShowEmojiPicker] = useState(false); 
    //определяем флаг загрузки звукового сообщения
    const [isLoading, setLoading] = useState(false);                  
    //открываем список смайлов
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!emojiPickerVisible);
    }

    //запись аудио-сообщения
    const onRecord = () => {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true},onRecording,onError)
        }
    }

    //процесс записи звука
    const onRecording = (stream) => {
        //включаем магнитофон
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
         
        recorder.start();

        //начинаем запись звука
        recorder.onstart = () => {
            setIsRecording(true);
        }

        //оканчиваем запись звука
        recorder.onstop = function(e) {
            setIsRecording(false);
        }

        recorder.ondataavailable = e => {
            const file = new File([e.data],"audio.webm");
            setLoading(true)
            //отправляем звуковой файл в базу данных на сервер
            filesApi.upload(file).then(({data}) => {
                //получаем в итоге звуковое сообщение из базы данных на сервере
                sendAudio(data.file._id).then(() => {
                    setLoading(false);
                })
            })
        }
    }

    const onError = (err) => {
        console.log('The following error occured: ' + err)
    }

    const handleOutsideClick = (el, e) => {
        if (el && !el.contains(e.target)) {
            setShowEmojiPicker(false);
        }
    }

    //добавляем смайл в сообщение value
    const addEmoji = ({colons}) => {
        setValue((value + ' ' + colons).trim());
    }

    //получаем звуковое сообщение
    const sendAudio = (audioId) => {
        //делаем запрос на сервер по звуковому сообщению
        return fetchSendMessage({
            text: null,
            dialogId: currentDialogId,
            attachments: [audioId]
        })
    }

    //отправление любого сообщения
    const sendMessage = () => {
        if (isRecording) {
            //останавливаем запись звука
            mediaRecorder.stop();        
        } 
        else if (value || attachments.length>0) 
        {
            //отправляем сообщение на сервер
            fetchSendMessage({
                //текст сообщения
                text: value,                                    
                //идентификатор диалога сообщения
                dialogId: currentDialogId,                      
                //идентификаторы файлов в сообщении
                attachments: attachments.map(file => file.uid), 
            });
            //очищаем текст сообщения если он в нем был
            setValue("")
            //удаляем файлы сообщения если они в нем были
            setAttachments([])
        }
    }

    //отправляем сообщение на сервер
    const handleSendMessage = (e) => {
        //этот сокет говорит о том что нужно включить сигнализатор создания и отправки сообщения и он проходит через сервер - backend
        socket.emit('DIALOGS:TYPING', {});

        //отправка сообщения при нажатии клавиши enter код у которой 13
        if (e.keyCode === 13) {
            sendMessage();
        }
    }

    //прерываем запись звука и не делаем его отправку на сервер
    const onHideRecording = () => {
        setIsRecording(false)
    }

    //выбираем файлы которые отправляем в сообщение
    const onSelectFiles = async files => { 
        
        let uploaded = attachments;

        for (let i=0; i < files.length; i++) {
            
            const file = files[i];
            const uid = Math.round(Math.random()*1000);
            uploaded = [
                ...uploaded,
                {
                    uid,
                    name: file.name,
                    status: "uploading"
                }
            ];

            let curAttachments = uploaded;

            //фиксируем появление каждого нового файла
            uploaded =  await filesApi.upload(file).then(({data}) => {
                return (
                    curAttachments.map(item => {
                        if (item.uid === uid) {
                            return {
                                status: "done",
                                uid: data.file._id,
                                name: data.file.filename,
                                url: data.file.url
                            }
                        }
                        return item;  
                    })
                )
            })
        }
        setAttachments(uploaded);        
    }

    useEffect (() => {
        const el = document.querySelector('.chat-input__smile-btn');
        document.addEventListener("click",handleOutsideClick.bind(this,el));

        return () => {
            document.removeEventListener("click",handleOutsideClick.bind(this,el));
        }
    },[])

    //если диалог не идентифицирован то формы создания сообщений нет
    if (!currentDialogId) {
        return null;
    }

    //возвращаем форму создания сообщений
    return (
        <ChatInputBase 
            //отправляемый текст в сообщение
            value={value}                          
            //функция определения отправляемого текста в сообщение 
            setValue={setValue}                    
            //флаг появления списка смайлов
            emojiPickerVisible={emojiPickerVisible} 
            //функция управления значением флага появления списка смайлов
            toggleEmojiPicker={toggleEmojiPicker}   
            //добавляем смайл в сообщение
            addEmoji={addEmoji}                     
            //отправляем сообщение по клавише  Enter с кодом 13
            handleSendMessage={handleSendMessage}   
            //Отправляем сообщение по кнопке галочка
            sendMessage={sendMessage}               
            //функция сбора файлов для отправки в сообщение
            onSelectFiles={onSelectFiles}          
            //список отправляемых файлов в сообщение
            attachments={attachments}               
            //функция удаления файла из отправляемых в сообщение
            removeAttachment={removeAttachment}     
            //флаг записи звука
            isRecording={isRecording}               
            //запись начинается
            onRecord={onRecord}                     
            //запись прервана
            onHideRecording={onHideRecording}     
            //флаг загрузки звукового сообщения
            isLoading={isLoading}                   
        />
    );
}

export default connect(
    ({
        //dialogs получаем из ../../redux/reducers/dialogs
        dialogs,  
        //attachments получаем из ../../redux/reducers/attachments
        attachments 
    }) => ({
        dialogs,                      
        //из attachments вытаскивается attachments - attachments.items
        attachments: attachments.items 
    }), 
    {
        //из messagesActions вытаскивается функция fetchSendMessage
        ...messagesActions, 
        //из attachmentsActions вытаскиваются функции setAttachments и removeAttachments 
        ...attachmentsActions 
    }
)(ChatInput);