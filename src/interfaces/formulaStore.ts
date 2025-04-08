export type TokenType = "tag" | "operator" | "number";

export type Token = {
  id: string;
  name: string;
  type: TokenType;
  selectedTime?: string;
};

export interface FormulaStore {
  tagValues: Record<string, number>;
  tokens: Token[];
  setTokens: (tokens: Token[]) => void;
  addToken: (token: Token) => void;
  removeToken: (id: string) => void;
  updateTagValue: (name: string, value: number) => void;
  updateTokenTime: (id: string, newTime: string) => void;
}
