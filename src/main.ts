enum ExprType {
  TRUE, FALSE,
  CONJUNCTION, DISJUNCTION,
  IMPLICATION,
  NEGATION,
  VARIABLE,
}

interface Expr {
  type: ExprType;
  params: Expr[];
  equals(target: Expr): boolean;
  toString(): string;
}

class Variable implements Expr {
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

class LogicExpr<T extends ExprType> implements Expr {
  params: Expr[];

  constructor(
    public type: T,
    ...args:
        Expr[] &
        { length: T extends (ExprType.TRUE | ExprType.FALSE) ? 0 : (T extends ExprType.NEGATION ? 1 : 2) }
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
        return (this.params[0].equals(target.params[0]));
      default:  // CONJUNCTION, DISJUNCTION, IMPLICATION
        return (this.params[0].equals(target.params[0])) && (this.params[1].equals(target.params[1]));
    }
  }

  toString(): string {
    const lhs = () => {
      if (this.params[0].type === ExprType.TRUE || this.params[0].type === ExprType.FALSE || this.params[0].type === ExprType.VARIABLE) {
        return this.params[0].toString();
      }
      return enclose(this.params[0].toString());
    };

    const rhs = () => {
      if (this.params[1].type === ExprType.TRUE || this.params[1].type === ExprType.FALSE || this.params[1].type === ExprType.VARIABLE) {
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

const True = new LogicExpr(ExprType.TRUE);
const False = new LogicExpr(ExprType.FALSE);
const X = new LogicExpr(ExprType.CONJUNCTION, True, False);
const Y = new LogicExpr(ExprType.DISJUNCTION, X, new LogicExpr(ExprType.IMPLICATION, False, new LogicExpr(ExprType.NEGATION, X)));

console.log(Y.toString());

class Sequent<T extends ExprType, K extends ExprType> {
  constructor(private antecedent: LogicExpr<T>[], private succedent: LogicExpr<K>[]) {}

  toString(): string {
    return `${this.antecedent.map(expr => expr.toString()).join(', ')} |- ${this.succedent.map(expr => expr.toString()).join(', ')}`
  }
}

const seq = new Sequent([X, new Variable('A')], [new Variable('B'), Y]);
console.log(seq.toString());
