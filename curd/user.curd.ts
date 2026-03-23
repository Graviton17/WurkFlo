import { BaseCURD } from "./base_curd.curd";
import { User } from "@/types/index";

export class UserCURD extends BaseCURD<User> {
  constructor() {
    super("users");
  }
}
