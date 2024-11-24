export class Pool {
  constructor(creationClass, initSize = 0, args = []) {
    this.array = [];
    this.creationClass = creationClass;
    this.classArguments = args;

    for (let i = 0; i < initSize; i++) {
      this.array.push(new creationClass(...args));
    }
  }

  get() {
    return this.array.pop() || new this.creationClass(...this.classArguments);
  }

  push(obj) {
    this.array.push(obj);
  }
}
