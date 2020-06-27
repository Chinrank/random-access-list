Don't use this. https://github.com/funkia/list is way better, wow that's pretty sick.

This implements a Random Access List.

If you are here, you probably already know what this is. But if not, it is an immutable data structure with the following
performance characteristics.

Prepend - O(1)

Head - O(1)

Tail - O(1)

Lookup - O(log n)

Update - O(log n)

While an update uses O(log n) memory to keep the new copy.

You should consider using this structure if you have an array you frequently want to update, while remembering the history of arrays.

A sample usage.

```
const len = 100000;
const arr = Array(len)
      .fill(0)
      .map((_, i) => i);

const randomAccessList = RandomAccessList.fromArray(arr);

const nextList = randomAccessList.update(7, 12);
const mappedList = nextList.map((x, i) => x * i);
const tailed = mappedList.tail().tail();
const prepended = tailed.prepend(13).prepend(2);

console.log(randomAccessList.get(7)); // 7
console.log(nextList.get(7)); // 12
console.log(mappedList.get(7)); // 12 * 7 = 84
console.log(tailed.get(0)); // 2 * 2 = 4
console.log(prepended.get(1)); // 13
```
