const { deepStrictEqual, strictEqual } = require("assert");

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

const arrSlowWay = [];

for (let i = 0; i < len; i++) {
      arrSlowWay.push(mapped.get(i));
}

deepStrictEqual(
      Array.from(latestRes),
      arr.map((s, i) => s * 2)
);

deepStrictEqual(
      backToArr,
      arr.map((s, i) => s * 2 * i)
);

deepStrictEqual(backToArr, arrSlowWay);

const aFewTails = mapped.tail().tail().tail();

deepStrictEqual(Array.from(aFewTails), arr.map((s, i) => s * 2 * i).slice(3));

const prependABit = aFewTails
      .prepend(52)
      .prepend(17)
      .prepend(12)
      .map((x) => x + 1)
      .tail();

strictEqual(prependABit.head(), 18);

const randomAccessList = RandomAccessList.fromArray(arr);

const nextList = randomAccessList.update(7, 12);
const mappedList = nextList.map((x, i) => x * i);
const tailed = mappedList.tail().tail();
const prepended = tailed.prepend(13).prepend(2);

strictEqual(randomAccessList.get(7), 7);
strictEqual(nextList.get(7), 12);
strictEqual(mappedList.get(7), 84);
strictEqual(tailed.get(0), 4);
strictEqual(prepended.get(1), 13);
