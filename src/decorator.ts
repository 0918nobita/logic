function Decorate(option: string) {
  return (_: any, name: string, descriptor: PropertyDescriptor) => {
    console.log('Decorate デコレータ付きのメソッドが定義されました');

    const method = descriptor.value;

    descriptor.value = function() {
      console.log('修飾されたメソッドを呼び出します');
      const ret = method.apply(this, arguments);
      console.log('呼び出しが完了しました');
      return `${option}, ${ret}, ${name}`;
    };
  };
}

class Test {
  @Decorate('デコレータ')
  test() {
    console.log('test');
    return 42;
  }
}

console.log(new Test().test());

function composite(fn: (ret: any) => any) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function() {
      const ret = method.apply(this, arguments);
      return fn(ret);
    };
  };
}
