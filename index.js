class RandomAccessList {
      constructor(internalArr) {
            this.internalArr = internalArr;
      }

      get(i) {
            const [tree, size, j] = getTreeToOperateOn(this.internalArr, i);
            return findInsideTree(tree, size, j);
      }

      map(cb) {
            const res = [];
            let acc = 0;

            for (let i = this.internalArr.length - 1; i >= 0; i--) {
                  const [tree, size] = this.internalArr[i];
                  res.push([mapTree(tree, cb, size, acc), size]);
                  acc = acc + size;
            }

            res.reverse();
            return new RandomAccessList(res);
      }

      update(i, val) {
            const [tree, size, j, treeToSearchIndex] = getTreeToOperateOn(
                  this.internalArr,
                  i
            );
            const nextInternalArr = immutableUpdateArray(
                  this.internalArr,
                  treeToSearchIndex,
                  [updateTree(tree, size, j, val), size]
            );
            return new RandomAccessList(nextInternalArr);
      }

      *[Symbol.iterator]() {
            for (let i = this.internalArr.length - 1; i >= 0; i--) {
                  yield* traverseTree(this.internalArr[i][0]);
            }
      }

      static fromArray(arr) {
            let len = arr.length;
            let res = [];
            while (len !== 0) {
                  const largestAllowableTreeSize = largestBinaryTreeSize(len);
                  const tree = toTree(arr, len - largestAllowableTreeSize, len);
                  res.push([tree, largestAllowableTreeSize]);
                  len = len - largestAllowableTreeSize;
            }
            return new RandomAccessList(res);
      }
}

function getTreeToOperateOn(treeArr, i) {
      if (i < 0) {
            throw new RangeError(`${i} is smaller than 0`);
      }
      const [treeToSearchIndex, j] = findTree(treeArr, i);
      if (treeToSearchIndex === -1) {
            throw new RangeError(`${i} is out of bounds`);
      }
      const [tree, size] = treeArr[treeToSearchIndex];
      return [tree, size, j, treeToSearchIndex];
}

function immutableUpdateArray(arr, i, val) {
      return arr
            .slice(0, i)
            .concat([val])
            .concat(arr.slice(i + 1));
}

function mapTree(tree, cb, size, idx = 0) {
      const res = cb(tree.v, idx);

      if (!tree.l) {
            return { v: res };
      }

      return {
            v: res,
            l: mapTree(tree.l, cb, (size - 1) / 2, idx + 1),
            r: mapTree(tree.r, cb, (size - 1) / 2, idx + 1 + (size - 1) / 2)
      };
}

function updateTree(tree, size, i, val) {
      if (i === 0) {
            return { v: val, l: tree.l, r: tree.r };
      }
      if (i < size / 2) {
            return {
                  v: tree.v,
                  l: updateTree(tree.l, (size - 1) / 2, i - 1, val),
                  r: tree.r
            };
      }

      return {
            v: tree.v,
            l: tree.l,
            r: updateTree(tree.r, (size - 1) / 2, i - 1 - (size - 1) / 2, val)
      };
}

function findInsideTree(tree, size, i) {
      if (i === 0) {
            return tree.v;
      }
      if (i < size / 2) {
            return findInsideTree(tree.l, (size - 1) / 2, i - 1);
      }

      return findInsideTree(tree.r, (size - 1) / 2, i - 1 - (size - 1) / 2);
}

function* traverseTree(tree) {
      yield tree.v;
      if (tree.l) {
            yield* traverseTree(tree.l);
      }
      if (tree.r) {
            yield* traverseTree(tree.r);
      }
}

function findTree(treeArr, target) {
      let s = 0;
      for (let i = treeArr.length - 1; i >= 0; i--) {
            const nextS = s + treeArr[i][1];
            if (nextS > target) {
                  return [i, target - s];
            }
            s = nextS;
      }
      return [-1, 0];
}

function toTree(arr, startIndex = 0, endIndex = arr.length, acc = {}) {
      acc.v = arr[startIndex];

      const diff = endIndex - startIndex;

      if (diff === 1) {
            return acc;
      }

      acc.l = {};
      acc.r = {};

      const leftEnd = startIndex + (diff + 1) / 2;

      toTree(arr, startIndex + 1, leftEnd, acc.l);
      toTree(arr, leftEnd, endIndex, acc.r);

      return acc;
}

function largestBinaryTreeSize(numberVertices) {
      // numberVertices = 1 + 2 + 2^2 + ... + 2^(n-1) + k with k <= 2^n
      // Know that 2^m - 1 = numberVertices => n = m - 1 as per geometric series
      // so it's just n = Math.floor(Math.log2(numberVertices + 1)) - 1 which leaves
      // => 2^(Math.floor(Math.log2(numberVertices + 1))) - 1

      const level = Math.floor(Math.log2(numberVertices + 1));
      return Math.pow(2, level) - 1;
}

module.exports = RandomAccessList;
