export type IUser = {
  email: string;
  username: string;
  password: string;
  roles: string[];
};

export type IUserWithId = {
  id: number;
} & IUser;

/** This interface abstract the user persistency actions required for handling user in this application */
export interface IUserRepository {
  /**
   * Returns user information from the database
   *
   * @remarks If not found will raise a BadRequestException
   *
   * @param username - User's username to search for
   *
   * @returns Stored user's information and roles stored in the database
   *
   */
  getByUsername(username: string): Promise<IUserWithId | null>;
  /**
   * Registers a user on the database
   *
   * @remarks If email and username must be unique values, or it will throw a database constrain Exception, If any of the roles is not found on the database will throw a BadRequestException. PLEASE: Hash the password !!
   *
   * @param user - User's email, username, password and roles array
   *
   * @returns Empty Promise
   *
   */
  createUser(user: IUser): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
