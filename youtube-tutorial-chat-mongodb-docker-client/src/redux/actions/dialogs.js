import {dialogsApi} from "../../utils/api";

const Actions = {
    //получаем список всех диалогов
    setDialogs: items => ({
        type: "DIALOGS:SET_ITEMS",
        payload: items
    }),
    //устанавливаем идентификатор текущего диалога id
    setCurrentDialogId: id => (dispatch) => {
        dispatch ({
            type: "DIALOGS:SET_CURRENT_DIALOG_ID",
            payload: id
        })
    },
    //получаем информацию о всех диалогах
    fetchDialogs: () => (dispatch) => {
        dialogsApi.getAll().then(({data}) => { 
            return ( 
               dispatch(Actions.setDialogs(data))
            );
        });
    }
}

export default Actions;