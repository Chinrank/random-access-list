class RandomAccessList {
      constructor(internalArr) {
            this.internalArr = internalArr;
      }

      get(i) {
            const [tree, size, j] = getTreeToOperateOn(this.internalArr, i);
            return findInsideTree(tree, size, j);
      }

      update(i, val) {
            const [tree, size, j, treeToSearchIndex] = getTreeToOperateOn(
                  this.internalArr,
                  i
            );
            const partial = this.internalArr.slice(0, treeToSearchIndex);
            partial.push([updateTree(tree, size, j, val), size]);
            const nextInternalArr = partial.concat(
                  this.internalArr.slice(treeToSearchIndex + 1)
            );
            return new RandomAccessList(nextInternalArr);
      }

      static fromArray(arr) {
            let len = arr.length;
            let res = [];
            while (len !== 0) {
                  const largestAllowableTreeSize = largestBinaryTreeSize(len);
                  len = len - largestAllowableTreeSize;
                  const tree = toTree(arr.slice(len));
                  arr = arr.slice(0, len);
                  res.push([tree, largestAllowableTreeSize]);
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

function toTree(arr, acc = {}) {
      const len = arr.length;

      acc.v = arr[0];

      if (len === 1) {
            return acc;
      }

      acc.l = {};
      acc.r = {};
      toTree(arr.slice(1, (len + 1) / 2), acc.l);
      toTree(arr.slice((len + 1) / 2), acc.r);

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
