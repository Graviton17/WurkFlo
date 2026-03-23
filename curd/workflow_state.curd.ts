import { BaseCURD } from "./base_curd.curd";
import { WorkflowState } from "@/types/index";

export class WorkflowStateCURD extends BaseCURD<WorkflowState> {
  constructor() {
    super("workflow_states");
  }
}
