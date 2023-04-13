const initialState = {
    //список всех сообщений по конкретному диалогу
    items: [],              
    //флаг загрузки сообщений по конкретному диалогу
    isLoading: false        
}

const messages = (state=initialState, {type,payload}) => {
    switch (type) {
        //добавляем последнее сообщение к имеющимся по конкретному диалогу
        case "MESSAGES:ADD_MESSAGE":
            return {
                ...state,
                items: [
                    ...state.items,
                    payload
                ]
            };
        //получаем все сообщения по конкретному диалогу
        case "MESSAGES:SET_ITEMS":
            return {
                ...state,
                items: payload,
                isLoading: false
            };
        //удяляем сообщение
        case 'MESSAGES:REMOVE_MESSAGE':
            return {
                ...state,
                items: state.items.filter(message => message._id !== payload),
            };
        //фиксируем состояние загрузки сообщений
        case "MESSAGES:SET_IS_LOADING":
            return {
                ...state,
                isLoading: payload
            };
        default:
            return state;
    }
}

export default messages;
