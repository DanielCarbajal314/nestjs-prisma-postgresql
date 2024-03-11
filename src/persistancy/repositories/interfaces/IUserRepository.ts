export type IUser = {
  email: string;
  username: string;
  password: string;
  roles: string[];
};

export type IUserWithId = {
  id: number;
} & IUser;

export interface IUserRepository {
  getByUsername(username: string): Promise<IUserWithId | null>;
  createUser(user: IUser): Promise<void>;
}
