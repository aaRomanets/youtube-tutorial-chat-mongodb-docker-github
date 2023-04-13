import {filesApi} from "../../utils/api";

const Actions = {
    //получаем все файлы сообщения    
    setAttachments: items => ({
        type: "ATTACHMENTS:SET_ITEMS",
        payload: items
    }),
    //удалем файл из списка файлов сообщения, отправляемого на сервер
    //из базы данных этот файл тоже удаляем
    removeAttachment: (file) => (dispatch) => {
        filesApi.removeByUid(file.uid).then(() => {
            dispatch({
                type: "ATTACHMENTS:REMOVE_ITEM",
                payload: file
            });
        })
    }
};

export default Actions;
