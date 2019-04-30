import { ExprType } from './exprType';

export interface Expr {
  type: ExprType;
  params: Expr[];
  equals(target: Expr): boolean;
  toString(): string;
}
