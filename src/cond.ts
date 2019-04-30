export function cond<Val, Result>(
  val: Val,
  matchers: Array<[(val: Val) => boolean, () => Result]>,
  otherwise: (val: Val) => Result
): Result {
  for (let i = 0; i < matchers.length; i++) {
    if (typeof val === 'object') {
      const obj = { ...val };
      if (matchers[i][0](obj)) return matchers[i][1]();
    } else if (matchers[i][0](val)) return matchers[i][1]();
  }
  return otherwise(val);
}
