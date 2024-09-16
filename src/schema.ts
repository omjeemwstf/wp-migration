import mongoose, { Model } from "mongoose"

mongoose.connect("mongodb+srv://ommishra:ws%40123@cluster0.uvv9mx2.mongodb.net/Ghost")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

interface AddInterface extends Document {
    type: string;
    url: string;
    src: string;
}

interface AdminUserInterface extends Document {
    name: String;
    role: String;
}

const adSchema = new mongoose.Schema({
    type: { type: String, required: true },
    url: { type: String, required: true },
    src: { type: String, required: true },
    adName: { type: String, required: true }
});

const adminUserSchema = new mongoose.Schema({
    name: String,
    role: String
})

export const Ad: Model<AddInterface> = mongoose.model<AddInterface>('Ad', adSchema);
export const User: any = mongoose.model("User", userSchema)
export const AdminUsers: Model<AdminUserInterface> = mongoose.model<AdminUserInterface>('AdminUser', adminUserSchema);

