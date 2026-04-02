import { BaseCURD } from "./base_curd.curd";
import type { Sprint } from "@/types/model/sprint.types";

export class SprintCURD extends BaseCURD<Sprint> {
  constructor() {
    super("sprints");
  }
}
