import { BaseCURD } from "./base_curd.curd";
import { Workspace } from "@/types/index";

export class WorkspaceCURD extends BaseCURD<Workspace> {
  constructor() {
    super("workspaces");
  }
}
