import {axios} from '../../core';

const dialogsApi =  {
    //получаем все диалоги
    getAll: () => {
        return (
            axios.get("http://localhost:4024/dialogs")
        )
    },
    //создаем диалог
    create: ({partner,text}) => {
        return (
            axios.post("http://localhost:4024/dialogs",{partner,text})
        )
    },
}

export default dialogsApi;
