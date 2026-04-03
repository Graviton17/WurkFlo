import { BaseCURD } from "./base_curd.curd";
import type { Release } from "@/types/model/release.types";

export class ReleaseCURD extends BaseCURD<Release> {
  constructor() {
    super("releases");
  }
}
