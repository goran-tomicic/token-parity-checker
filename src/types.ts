export interface Token {
  name: string;
  value: string;
  category?: "color" | "spacing" | "typography" | string;
}

export type TokenSet = Record<string, string>;

export type DriftStatus = "match" | "drift" | "missing-in-code" | "missing-in-figma";

export interface DriftEntry {
  name: string;
  figmaValue: string | null;
  codeValue: string | null;
  status: DriftStatus;
  severity?: string;
}
