import { Expr } from './expr';

export class Sequent {
  constructor(private antecedent: Expr[], private succedent: Expr[]) {}

  toString(): string {
    return `${this.antecedent
      .map(expr => expr.toString())
      .join(', ')} |- ${this.succedent
      .map(expr => expr.toString())
      .join(', ')}`;
  }
}
