import { Expr } from './expr';
import { ExprType } from './exprType';

export class LogicExpr<T extends ExprType> implements Expr {
  params: Expr[];

  constructor(
    public type: T,
    ...args: Expr[] & {
      length: T extends (ExprType.TRUE | ExprType.FALSE)
        ? 0
        : (T extends ExprType.NEGATION ? 1 : 2);
    }
  ) {
    this.params = args;
  }

  equals(target: Expr): boolean {
    if (target.type !== this.type) return false;

    switch (this.type) {
      case ExprType.TRUE:
      case ExprType.FALSE:
        return true;
      case ExprType.NEGATION:
        return this.params[0].equals(target.params[0]);
      default:
        // CONJUNCTION, DISJUNCTION, IMPLICATION
        return (
          this.params[0].equals(target.params[0]) &&
          this.params[1].equals(target.params[1])
        );
    }
  }

  toString(): string {
    const lhs = () => {
      if (
        this.params[0].type === ExprType.TRUE ||
        this.params[0].type === ExprType.FALSE ||
        this.params[0].type === ExprType.VARIABLE
      ) {
        return this.params[0].toString();
      }
      return `(${this.params[0].toString()})`;
    };

    const rhs = () => {
      if (
        this.params[1].type === ExprType.TRUE ||
        this.params[1].type === ExprType.FALSE ||
        this.params[1].type === ExprType.VARIABLE
      ) {
        return this.params[1].toString();
      }
      return `(${this.params[1].toString()})`;
    };

    switch (this.type) {
      case ExprType.TRUE:
        return 't';
      case ExprType.FALSE:
        return 'f';
      case ExprType.CONJUNCTION:
        return `${lhs()} ∧ ${rhs()}`;
      case ExprType.DISJUNCTION:
        return `${lhs()} ∨ ${rhs()}`;
      case ExprType.IMPLICATION:
        return `${lhs()} ⊃ ${rhs()}`;
      default:
        // NEGATION
        return `¬ ${lhs()}`;
    }
  }
}
