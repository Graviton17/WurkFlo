import { BaseCURD } from "./base_curd.curd";
import { Project } from "@/types/index";

export class ProjectCURD extends BaseCURD<Project> {
  constructor() {
    super("projects");
  }
}
