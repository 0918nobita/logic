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

function Push(val: number) {
  return composite(stack => {
    stack.push(val);
    return stack;
  });
}

function Pop() {
  return composite(stack => {
    stack.pop();
    return stack;
  });
}

function Mul() {
  return composite(stack => {
    const x = stack.pop() as number;
    const y = stack.pop() as number;
    stack.push(x * y);
    return stack;
  });
}

class StackDSL {
  @Mul()
  @Push(3)
  @Pop()
  @Push(1)
  @Push(2)
  run() {
    return [];
  }
}

console.log(new StackDSL().run()); // => [ 6 ]

const WatchPropChanges = (constructor: Function) => {
  constructor.prototype = new Proxy(constructor.prototype, {
    set(_: any, name: any, value: any) {
      console.log({ name, value });
      return true;
    }
  });
};

@WatchPropChanges
class Foo {
  a = 42;
  b = 'hoge';

  update() {
    console.log('Update');
    this.a = 334;
    this.b = 'huga';
  }
}

const foo = new Foo();
foo.update();
