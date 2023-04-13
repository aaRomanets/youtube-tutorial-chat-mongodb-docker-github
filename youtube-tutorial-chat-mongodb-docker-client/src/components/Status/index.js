import React from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

import "./Status.scss";

//показываем статус собеседника, если он три минуты не видит сообщения значит он не в online
const Status = ({
    //статус собеседника (читает ли он или нет присланные ему сообщения) 
    online, 
    //полное имя собеседника
    fullname  
}) => {
    return (
        <div className="chat__dialog-header">
            <div className="chat__dialog-header-center">
                <b className="chat__dialog-header-username">{fullname}</b>
                <div className="chat__dialog-header-status">
                    <span className={classNames("status",{"status--online": online})}>
                        {online ? "online" : "offline"}
                    </span>
                </div>
            </div>
        </div>
    )
};

Status.propTypes = {
    online: PropTypes.bool
};

export default Status;