const initialState = {
    //список диалогов
    items: [],                                                      
    //идентификатор текущего диалога 
    currentDialogId: window.location.pathname.split('dialog/')[1],  
    //флаг загрузки диалогов
    isLoading: false                                                
}

const dialogs = (state=initialState, {type,payload}) => {
    switch (type) {
        //получаем список диалогов
        case "DIALOGS:SET_ITEMS":
            return {
                ...state,
                items: payload
            };
        //получаем идентификатор текущего диалога
        case "DIALOGS:SET_CURRENT_DIALOG_ID":
            return {
                ...state,
                currentDialogId: payload
            };
        default:
        {
            return state;
        }
    }
}

export default dialogs;