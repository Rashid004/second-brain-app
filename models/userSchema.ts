import { IUser } from "@/types/user";
import { model, models, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
