import React from 'react';
import {Empty, Input} from "antd";
import orderBy from "lodash/orderBy";

import './Dialogs.scss';

import DialogItem from "../DialogItem";

const Dialogs = ({
    //список диалогов
    items,          
    //идентификатор авторизованного пользователя
    userId,         
    //функция поиска собеседника диалога
    onSearch,       
    //по inputValue ищется имя собеседника диалога
    inputValue,     
    //идентификатор текущего диалога
    currentDialogId 
}) => {

    return (
        <div className="dialogs">
            {/*Окно поиска диалогов*/}
            <div className="dialogs__search">
                <Input.Search 
                    placeholder="Search among contacts"
                    onChange={e => onSearch(e.target.value)}
                    value={inputValue}
                />                        
            </div>
            {
                //Показываем список диалогов
                items.length ? (
                    orderBy(items, ["created_at"], ["desc"]).map(item => {
                        return (
                            <DialogItem
                                key={item._id}  
                                //идентификатор авторизованного пользователя
                                userId={userId} 
                                //идентификатор диалога
                                currentDialogId={currentDialogId} 
                                {...item}
                            />
                        )
                    })
                ) : (
                    //Диалогов нету
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description="Nothing found"
                    />
                )
            }
        </div>
    );
}

export default Dialogs;