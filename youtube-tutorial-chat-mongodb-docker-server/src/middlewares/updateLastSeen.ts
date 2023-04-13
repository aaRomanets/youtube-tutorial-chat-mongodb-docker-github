import {UserModel} from "../models";
import {IUser} from "../models/User";

export default (req: any, __: any, next: any) => 
{
    if (req.user) 
    {
        //меняем время просмотра пользователем сообщений
        UserModel.findOneAndUpdate
        (
            {
                _id: (req.user as IUser)._id
            },
            {
                last_seen: new Date()
            },
            {
                new: true
            },
            () => {}
        );
    }
    next();
}