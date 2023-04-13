import {notification} from "antd";

//появление информационного окна в течение 3 секунд
const openNotification = ({ text, type = 'info', title, duration = 3 }) =>
{
    return (
        notification[type]({
            message: title,
            description: text,
            duration,
        })
    )
}

export default openNotification;