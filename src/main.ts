enum ExprType {
  TRUE, FALSE,
  CONJUNCTION, DISJUNCTION,
  IMPLICATION,
  NEGATION,
}

class Expr<T extends ExprType> {
  private params: Expr<any>[];

  constructor(
    private type: T,
    ...args:
        Expr<any>[] &
        { length: T extends (ExprType.TRUE | ExprType.FALSE) ? 0 : (T extends ExprType.NEGATION ? 1 : 2) }
  ) {
    this.params = args;
  }

  toString(): string {
    const lhs = () => this.params[0].toString();
    const rhs = () => this.params[1].toString();

    switch (this.type) {
      case ExprType.TRUE:
        return "t";
      case ExprType.FALSE:
        return "f";
      case ExprType.CONJUNCTION:
        return `* ${lhs()} ${rhs()}`;
      case ExprType.DISJUNCTION:
        return `+ ${lhs()} ${rhs()}`;
      case ExprType.IMPLICATION:
        return `-> ${lhs()} ${rhs()}`;
      default:  // NEGATION
        return `! ${lhs()}`
    }
  }
}
