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

const latestRes = oldReses[oldReses.length - 1];

const mapped = latestRes.map((x, i) => x * i);

const backToArr = Array.from(mapped);

deepStrictEqual(
      Array.from(latestRes),
      arr.map((s, i) => s * 2)
);

deepStrictEqual(
      backToArr,
      arr.map((s, i) => s * 2 * i)
);
