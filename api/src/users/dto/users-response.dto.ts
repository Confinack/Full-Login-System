import { User } from "@prisma/client";

export interface IUserResponse extends Omit<User, "password"> {}
