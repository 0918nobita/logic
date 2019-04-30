enum ExprType {
  TRUE, FALSE,
  CONJUNCTION, DISJUNCTION,
  IMPLICATION,
  NEGATION,
  VARIABLE,
}

class Expr<T extends ExprType> {
  private params: Expr<any>[];

  constructor(
    public type: T,
    ...args:
        Expr<any>[] &
        { length: T extends (ExprType.TRUE | ExprType.FALSE) ? 0 : (T extends ExprType.NEGATION ? 1 : 2) }
  ) {
    this.params = args;
  }

  equals(expr: Expr<any>): boolean {
    if (expr.type !== this.type) return false;

    switch (this.type) {
      case ExprType.TRUE:
      case ExprType.FALSE:
        return true;
      case ExprType.NEGATION:
        return (this.params[0].equals(expr.params[0]));
      default:  // CONJUNCTION, DISJUNCTION, IMPLICATION
        return (this.params[0].equals(expr.params[0])) && (this.params[1].equals(expr.params[1]));
    }
  }

  toString(): string {
    const lhs = () => {
      if (this.params[0].type === ExprType.TRUE || this.params[0].type === ExprType.FALSE) {
        return this.params[0].toString();
      }
      return enclose(this.params[0].toString());
    };

    const rhs = () => {
      if (this.params[1].type === ExprType.TRUE || this.params[1].type === ExprType.FALSE) {
        return this.params[1].toString();
      }
      return enclose(this.params[1].toString());
    }

    switch (this.type) {
      case ExprType.TRUE:
        return "t";
      case ExprType.FALSE:
        return "f";
      case ExprType.CONJUNCTION:
        return `${lhs()} ∧ ${rhs()}`;
      case ExprType.DISJUNCTION:
        return `${lhs()} ∨ ${rhs()}`;
      case ExprType.IMPLICATION:
        return `${lhs()} ⊃ ${rhs()}`;
      default:  // NEGATION
        return `¬ ${lhs()}`
    }

    function enclose(str: string) {
      return `(${str})`;
    }
  }
}

const True = new Expr(ExprType.TRUE);
const False = new Expr(ExprType.FALSE);
const X = new Expr(ExprType.CONJUNCTION, True, False);
const Y = new Expr(ExprType.DISJUNCTION, X, new Expr(ExprType.IMPLICATION, False, new Expr(ExprType.NEGATION, X)));

console.log(Y.toString());
