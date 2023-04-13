//хранилище файлов
const initialState = {
    //список файлов для отправки в сообщение
    items: []                           
};
  
const attachments = (state = initialState, { type, payload }) => {
    switch (type) {
        //получаем все файлы для отправки в сообщение
        case "ATTACHMENTS:SET_ITEMS":
            return {
                ...state,
                items: payload
            };
        //удаляем файл из файлов для отправки в сообщение
        case "ATTACHMENTS:REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(item => item.uid !== payload.uid)
            };
        default:
            return state;
    }
};

export default attachments;