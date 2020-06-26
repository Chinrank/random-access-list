const { strictEqual } = require("assert");

const RandomAccessList = require("./index");

const len = 100000;
const arr = Array(len)
      .fill(0)
      .map((_, i) => i);

let t = RandomAccessList.fromArray(arr);

for (let i = 0; i < len; i++) {
      t = t.update(i, 2 * t.get(i));
      strictEqual(t.get(i), 2 * i);
}
