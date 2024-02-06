import { Document } from "mongoose";

export enum Role {
  RootAdmin = "rootAdmin",
  AdminA = "adminA",
  AdminB = "adminB",
  AdminC = "adminC",
  SubAdmin = "subAdmin",
  USER = "user",
  Guest = "guest",
}

export default interface IUser extends Document {
  registrationType: string;
  verificationCode: string | undefined;
  passwordResetExpires: Date | undefined;
  passwordResetVerified: boolean | undefined;
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  role: Role;
  revinue: number;
  image: string;
  imageUrl?: string;
  orders: string[];
  addressesList: [{
          _id: string,
          city: String,
          area: String,
          address: String,
          postalCode: String,
  }];
  favourite: string[];
  changePasswordAt?: Date;
  createToken: () => string;
  createGuestToken: () => string;
  comparePassword: (password: string) => boolean;
}
