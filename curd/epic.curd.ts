import { BaseCURD } from "./base_curd.curd";
import type { Epic } from "@/types/model/epic.types";

export class EpicCURD extends BaseCURD<Epic> {
  constructor() {
    super("epics");
  }
}
