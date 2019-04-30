import { Expr } from './expr';
import { ExprType } from './exprType';
import { cond } from './cond';

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

    return cond(
      this.type,
      [
        [val => val === ExprType.TRUE || val === ExprType.FALSE, () => true],
        [
          val => val === ExprType.NEGATION,
          () => this.params[0].equals(target.params[0])
        ]
      ],
      () =>
        this.params[0].equals(target.params[0]) &&
        this.params[1].equals(target.params[1])
    );
  }

  toString(): string {
    const term = (index: number) =>
      cond(
        this.params[index].type,
        [
          [
            type =>
              type === ExprType.TRUE ||
              type === ExprType.FALSE ||
              type === ExprType.VARIABLE,
            () => this.params[index].toString()
          ]
        ],
        () => `(${this.params[index].toString()})`
      );

    const lhs = () => term(0);

    const rhs = () => term(1);

    return cond(
      this.type,
      [
        [type => type === ExprType.TRUE, () => 't'],
        [type => type === ExprType.FALSE, () => 'f'],
        [type => type === ExprType.CONJUNCTION, () => `${lhs()} ∧ ${rhs()}`],
        [type => type === ExprType.DISJUNCTION, () => `${lhs()} ∨ ${rhs()}`],
        [type => type === ExprType.IMPLICATION, () => `${lhs()} ⊃ ${rhs()}`]
      ],
      () => `¬ ${lhs()}`
    );
  }
}
