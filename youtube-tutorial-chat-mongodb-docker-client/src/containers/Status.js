import React from "react";
import { Status as StatusBase} from "../components"
import {connect} from "react-redux";

const Status = (props) => {
    const {
        //получаем из ../../redux/reducers/dialogs при помощи connect
        dialogs,
        //идентификатор диалога вытаскивается из dialogs
        currentDialogId, 
        //user - авторизованный пользователь из ../../redux/reducers/user при помощи connect
        user 
    } = props;

    //если диалогов нет или диалог не идентифицирован то статус собеседника не определяется
    if (!dialogs.length || !currentDialogId) {
        return null;
    }

    //определяем нужный диалог с идентификатором currentDialogId из списка диалогов
    const currentDialogObj = dialogs.filter(
        dialog => dialog._id === currentDialogId
    )[0];
    
    let partner = {};

    //определяем partner кому пишем сообщения, cooбщения идут от пользователя с идентификатором user._id
    if (currentDialogObj.author._id === user._id) {
        partner = currentDialogObj.partner; 
    } else {
        partner = currentDialogObj.author;
    }

    //partner.isOnline если партнер в течении трех минут не видит или не отвечает на сообщения то partner.isOnline становится false
    //в противном случае partner.isOnline становится снова true
    return (
        <StatusBase  
            //статус собеседника (читает ли он или нет присланные ему сообщения)
            online={partner.isOnline}
            //полное имя собеседника
            fullname={partner.fullname} 
        />
    );
}

export default connect(
    ({
        //dialogs получаем из ../../redux/reducers/dialogs.js
        dialogs, 
        //user получаем из ../../redux/reducers/user.js
        user      
    }) => ({
        //из dialogs вытаскивается dialogs - dialogs.items
        dialogs: dialogs.items,     
        //из dialogs вытаскивается currentDialogId - dialogs.currentDialogId
        currentDialogId: dialogs.currentDialogId, 
        //из user вытаскивается user - user.data
        user: user.data 
    })
)(Status);
