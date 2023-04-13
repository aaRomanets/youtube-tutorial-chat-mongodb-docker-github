import React, {useEffect} from 'react';
import {withRouter} from "react-router";
import {ChatInput, Messages, Status, Sidebar} from "../../containers";
import {connect} from "react-redux";

import "./Home.scss";

import {dialogsActions} from "../../redux/actions";

const Home = (props) => {
    const {
        //функция setCurrentDialogId, получается из ../../redux/actions/dialogsActions при помощи connect
        setCurrentDialogId, 
        //user - авторизованный пользователь, получается из ../../redux/reducers при помощи connect
        user                
    } = props;
    
    useEffect(() => {
        //название веб-страницы опуская http://localhost:3001
        const { pathname } = props.location;
        //идентифицируем идентификатор диалога
        const dialogId = pathname.split('/').pop();
        //фиксируем идентификатор диалога
        setCurrentDialogId(dialogId);
        //если props.location.pathname или props.location или setCurrentDialogId меняются то этот хук запускается заново
    }, [props.location.pathname,props.location,setCurrentDialogId]);

    return (
        <section className="home">
            <div className="chat">
                <Sidebar/>
                {user && (
                    <div className="chat__dialog">
                        <Status/> 
                        <Messages />
                        <div className="chat__dialog-input">
                            <ChatInput/>
                        </div>   
                    </div>
                )}
            </div>
        </section>
    )
}

export default withRouter(connect( ({user}) => (
        //из ../../redux/reducers/user.js вытаскивается user  
        {user: user.data}), 
        //из dialogsActions вытаскивается функция setCurrentDialogId
        dialogsActions  
    )
(Home));