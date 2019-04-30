import { Expr } from './expr';
import { ExprType } from './exprType';

export class Variable implements Expr {
  type = ExprType.VARIABLE;
  params = [];

  constructor(private name: string) {}

  equals(target: Expr): boolean {
    if (target.type !== ExprType.VARIABLE) return false;
    return (target as Variable).name === this.name;
  }

  toString(): string {
    return this.name;
  }
}
