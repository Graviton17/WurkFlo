export type ActionResult<T> = {
  success: boolean;
  data: T | null;
  error?: string;
};
