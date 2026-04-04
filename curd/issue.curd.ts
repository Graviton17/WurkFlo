import { BaseCURD } from "./base_curd.curd";
import type { Issue } from "@/types/model/issue.types";

export class IssueCURD extends BaseCURD<Issue> {
  constructor() {
    super("issues");
  }
}
