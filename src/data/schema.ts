import mongoose, { Model, Types } from "mongoose"
import { AD_TYPE, USER_TYPES } from "./config";

mongoose.connect("mongodb+srv://ommishra:ws%40123@cluster0.uvv9mx2.mongodb.net/Ghost")






interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: typeof USER_TYPES[keyof typeof USER_TYPES];
    _id : Types.ObjectId
}

interface IAd extends Document {
    type: typeof AD_TYPE[keyof typeof AD_TYPE];
    url: string;
    src: string;
    name: string;
}

interface IOrganization extends Document {
    user: IUser[];
    ad: IAd[];
    name: String,
    src : String,
    contentAPI: String,
    adminAPI : String
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(USER_TYPES), default: USER_TYPES.USER }
});

const adSchema = new mongoose.Schema<IAd>({
    type: { type: String, enum: Object.values(AD_TYPE), required: true },
    url: { type: String, required: true },
    src: { type: String, required: true },
    name: { type: String, required: true }
});

const organizationSchema = new mongoose.Schema<IOrganization>({
    user: [userSchema],
    ad: [adSchema],
    name: String,
    src : String,
    contentAPI : String,
    adminAPI: String   
});


export const Admin_GHOST: Model<IOrganization> = mongoose.model<IOrganization>('ADMIN_GHOST', organizationSchema);


