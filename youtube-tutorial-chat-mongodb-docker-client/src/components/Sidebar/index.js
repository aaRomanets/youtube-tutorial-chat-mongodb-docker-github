import React from "react";
import { Button, Modal, Select, Input, Form } from "antd";
import {Dialogs} from "../../containers";
import TeamIcon from '@ant-design/icons/TeamOutlined';
import FormIcon from '@ant-design/icons/FormOutlined';

import "./Sidebar.scss";

const {Option} = Select;
const {TextArea} = Input;

const Sidebar = ({
    //авторизованный пользователь
    user,              
    //метка поиска имени собеседника
    inputValue,    
    //видимость модального окна создания диалога
    visible, 
    //сообщение собеседнику        
    messageText,       
    //флаг загрузки имен всех пользователей, соответствующих метке inputValue
    isLoading,         
    //функция закрытия модального окна создания диалога
    onClose,     
    //функция показа модального окна создания диалога     
    onShow,     
    //функция поиска собеседника по метке     
    onSearch,          
    //функция изменения метки поиска имени собеседника
    onChangeInput,     
    //функция выбора идентификатора собеседника
    onSelectUser,      
    //функция добавления диалога
    onModalOk,         
    //функция составления сообщения собеседнику
    onChangeTextArea,  
    //идентификатор собеседника
    selectedUserId,    
    //список собеседников
    users              
}) => {
    //список имен пользователей
    const options = users.map(user => {
        return (
            <Option key={user._id}>{user.fullname}</Option>
        )
    });

    return (
        <div className="chat__sidebar">
            <div className = "chat__sidebar-header">
                <div>
                    <TeamIcon  type="link"  shape="circle"/>
                    <span>List of dialogs</span>
                </div>   
                {/*Кнопка показа окна создания диалога*/}          
                <FormIcon
                    onClick = {onShow}  
                    type="link"  
                    shape="circle"  
                />
            </div>
        
            {/*Список диалогов*/}
            <div className="chat__sidebar-dialogs">
                <Dialogs userId = {user && user._id} />
            </div>

            {/*Окно создания диалога*/}
            <Modal
                title="Create dialog"
                visible={visible}
                onOk={onModalOk}
                onCancel={onClose}
                footer={[
                    //не создаем диалог
                    <Button key="back" onClick={onClose}>
                        Close
                    </Button>,
                    //создаем диалог
                    <Button
                        disabled={!messageText}
                        key="submit"
                        type="primary"
                        loading={isLoading}
                        onClick={onModalOk}
                    >
                        Create
                    </Button>
                ]}
            >
                <Form className="add-dialog-form">
                    {/*Выбираем собеседника*/}
                    <Form.Item label="Enter the user name or E-Mail">
                        <Select
                            value={inputValue}
                            onSearch={onSearch}
                            onChange={onChangeInput}
                            onSelect={onSelectUser}
                            notFoundContent={null}
                            style={{width: `100%`}}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            placeholder="Enter the user name"
                            showSearch
                        >
                            {options}
                        </Select>
                    </Form.Item>
                    
                    {selectedUserId && (
                        //Вводим первое сообщение в диалоге от авторизованного пользователя собеседнику
                        <Form.Item label="Enter text message">
                            <TextArea
                                autosize={{ minRows: 3, maxRows: 10 }}
                                onChange={onChangeTextArea}
                                value={messageText}
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    )
}

Sidebar.defaultProps = {
    users: []
};

export default Sidebar;