import * as mongoose from 'mongoose';
import * as httpStatus from 'http-status';

import { BaseService } from "../shared/base.service";
import { IUserDocument, IUserModel } from "./user.model";
import { EmailDuplicateException, DocumentNotFoundException, Exception } from '../../errorHandling/exceptions';

export class UserService extends BaseService<IUserDocument>{

    constructor(userModel: IUserModel) {
        super(userModel);
    }

    public create = (doc: IUserDocument): Promise<IUserDocument> => {
        return this.createUser(doc);
    }

    /**
     * Create a user
     * @param {IUserDocument} user
     * @returns {Promise<IUserDocument>}
     */
    private createUser = async (user: IUserDocument): Promise<IUserDocument> => {
        if (await this.isEmailTaken(user.email)) {
            throw new EmailDuplicateException(user.email);
        }

        if (await this.isUsernameTaken(user.username)) {
            throw new Exception(httpStatus.BAD_REQUEST, `Username ${user.username} already taken`);
        }

        const savedUser = await user.save();
        return savedUser;
    };

    public updateUserById = async (userId: string, userDoc: IUserDocument): Promise<IUserDocument> => {
        const user = await this.getById(userId);
        if (!user) throw new DocumentNotFoundException(userId);

        if (userDoc.email && (await this.isEmailTaken(userDoc.email, userId))) {
            throw new EmailDuplicateException(userDoc.email);
        }

        Object.assign(user, userDoc);
        return await user.save();
    }

    public getUserByEmail = (email: string): Promise<IUserDocument> => {
        return this.findOne({ email });
    };

    private isEmailTaken = async (email: string, excludeUserId?: string): Promise<boolean> => {
        const user = await this.mongooseModel.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    };

    private isUsernameTaken = async (username: string): Promise<boolean> => {
        const user = await this.mongooseModel.findOne({ username });
        return !!user;
    };
}