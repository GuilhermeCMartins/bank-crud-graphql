export interface ISigner {
  md5(data: string): string;
  sign(data: Record<string, unknown>): string;
}
