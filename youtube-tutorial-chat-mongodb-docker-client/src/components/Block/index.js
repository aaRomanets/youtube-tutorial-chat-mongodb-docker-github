import React from 'react';
import classNames from "classnames";

import './Block.scss';

//рамка для окна авторизации пользователя или регистрации пользователя
const Block = ({children}) => {
    return (
        <div className={classNames('block', classNames)}>{children}</div>
    );
}

export default Block;