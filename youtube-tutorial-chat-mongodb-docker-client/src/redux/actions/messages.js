import {filesApi} from "../../utils/api";
import {messagesApi} from "../../utils/api";

const Actions = {
    //получаем все сообщения диалога
    setMessages: items => ({
        type: "MESSAGES:SET_ITEMS",
        payload: items
    }),
    //добавляется последнее сообщение в диалог сообщений
    addMessage: (message) => (dispatch, getState) => {
        //getState полное состояние из containers/Messages при помощи connect attachments dialogs user messages
        const {dialogs} = getState();
        const {currentDialogId} = dialogs;

        if (currentDialogId === message.dialog._id) {
            dispatch({
                type: "MESSAGES:ADD_MESSAGE",
                payload: message
            })
        }
    },
    //добавляем последнее сообщение в базу данных на сервере
    fetchSendMessage: ({text, dialogId, attachments}) => () => {
        return messagesApi.send(text, dialogId, attachments);
    },
    //загружаем сигнализатор загрузки всех имеющихся сообщений диалога 
    setIsLoading: bool => ({
        type: "MESSAGES:SET_IS_LOADING",
        payload: bool
    }),
    //удаляем сообщение по идентификатору
    removeMessageById: (item) => dispatch => {
        if (window.confirm("Do you really want to delete the message?")) 
        {
            //удаляем файлы, связанные с удаляемым сообщением из базы данных по файлам
            if (item.attachments.length>0)
            {
                item.attachments.map(item => {
                    return (
                            filesApi.removeByUid(item._id).then(() => {
                            dispatch({
                                type: "ATTACHMENTS:REMOVE_ITEM",
                                payload: item
                            });
                        })
                    )
                })
            }
            //удаляем из базы данных само сообщение по идентификатору
            messagesApi.removeById(item._id).then(() => {
                dispatch({
                    type: "MESSAGES:REMOVE_MESSAGE",
                    payload: item._id
                });
            })
        }
    },
    //скачиваем сообщения с сервера по идентификатору диалога dialogId
    fetchMessages: (dialogId) => dispatch => {
        //включаем сигнализатор загрузки сообщений
        dispatch(Actions.setIsLoading(true));
        //получаем полную информацию о сообщениях в диалоге
        messagesApi.getAllByDialogId(dialogId)
        .then(({data}) => {
            //получаем сообщения
            dispatch(Actions.setMessages(data));
            //выключаем сигнализатор скачивания сообщений
            dispatch(Actions.setIsLoading(false));
        })
        .catch(() => {
            //выключаем сигнализатор скачивания сообщений
            dispatch(Actions.setIsLoading(false));
        })
    }
}

export default Actions;