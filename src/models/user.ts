import mongoose, { Schema, Document, PassportLocalDocument, PassportLocalModel } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface IUser extends PassportLocalDocument {
    email: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model<IUser, PassportLocalModel<IUser>>('User', UserSchema);
export default User;
