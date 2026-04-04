import { UserCURD } from "@/curd/index";
import { User, DatabaseResponse } from "@/types/index";

export class UserService {
  private userCurd: UserCURD;

  constructor() {
    this.userCurd = new UserCURD();
  }

  async getAllUsers(): Promise<DatabaseResponse<User[]>> {
    return this.userCurd.getAll();
  }

  async getUserById(id: string): Promise<DatabaseResponse<User>> {
    return this.userCurd.getById(id);
  }

  async createUser(data: Partial<User>): Promise<DatabaseResponse<User>> {
    return this.userCurd.create(data);
  }

  async upsertUser(data: Partial<User>): Promise<DatabaseResponse<User>> { 
    return this.userCurd.upsert(data); 
  } 

  async updateUser(id: string, data: Partial<User>): Promise<DatabaseResponse<User>> {
    return this.userCurd.update(id, data);
  }

  async deleteUser(id: string): Promise<DatabaseResponse<null>> {
    return this.userCurd.delete(id);
  }

  async getUserByEmail(email: string): Promise<DatabaseResponse<User>> {
    const { data, error, success } = await this.userCurd.getAll({ filters: { email } });
    if (!success || !data || data.length === 0) {
      return { data: null, error: error || new Error("Not found"), success: false };
    }
    return { data: data[0], error: null, success: true };
  }
}

export const userService = new UserService();
