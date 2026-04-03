import { BaseCURD } from "./base_curd.curd";
import { User } from "@/types/index";

export class UserCURD extends BaseCURD<User> {
  constructor() {
    super("users");
  }

  async getByEmails(emails: string[], select = "*") {
    const db = await this.getClient();
    const { data, error } = await db
      .from(this.tableName)
      .select(select)
      .in("email", emails)
      .is("deleted_at", null);

    return { data: data as User[] | null, error, success: !error };
  }
}
