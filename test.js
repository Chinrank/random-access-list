const { deepStrictEqual } = require("assert");

const RandomAccessList = require("./index");

const len = 100000;
const arr = Array(len)
      .fill(0)
      .map((_, i) => i);

let t = RandomAccessList.fromArray(arr);
let oldReses = [t];

for (let i = 0; i < len; i++) {
      const prevOne = oldReses[i];
      const nextOne = prevOne.update(i, 2 * t.get(i));
      oldReses.push(nextOne);
}

const backToArr = Array.from(oldReses[oldReses.length - 1]);

deepStrictEqual(
      backToArr,
      arr.map((s) => s * 2)
);
