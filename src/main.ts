import { LogicExpr } from './logicExpr';
import { ExprType } from './exprType';
import { Sequent } from './sequent';
import { Variable } from './variable';

const True = new LogicExpr(ExprType.TRUE);
const False = new LogicExpr(ExprType.FALSE);
const X = new LogicExpr(ExprType.CONJUNCTION, True, False);
const Y = new LogicExpr(
  ExprType.DISJUNCTION,
  X,
  new LogicExpr(
    ExprType.IMPLICATION,
    False,
    new LogicExpr(ExprType.NEGATION, X)
  )
);

console.log(Y.toString());

const seq = new Sequent([X, new Variable('A')], [new Variable('B'), Y]);
console.log(seq.toString());
