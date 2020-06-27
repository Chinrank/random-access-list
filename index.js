const nullLinkedList = { n: null };

/** @template S */
class RandomAccessList {
      /**
       * Private constructor, initial instances should be made via fromArray
       *
       * @private
       */

      constructor(internalList) {
            this.internalList = internalList;
      }

      /**
       * Gets the first element of the list.
       *
       * @return {S}
       */

      head() {
            if (this.internalList === nullLinkedList) {
                  throw new RangeError("Head of empty list");
            }
            return this.internalList.h[0].v;
      }

      /**
       * Gets the rest of the list past the first element
       *
       * @return {RandomAccessList<S>}
       */

      tail() {
            if (this.internalList === nullLinkedList) {
                  throw new RangeError("Tail of empty list");
            }

            const [fstTree, size] = this.internalList.h;

            if (size === 1) {
                  return new RandomAccessList(this.internalList.n);
            }
            return new RandomAccessList({
                  h: [fstTree.l, (size - 1) / 2],
                  n: {
                        h: [fstTree.r, (size - 1) / 2],
                        n: this.internalList.n
                  }
            });
      }

      /**
       * Determines whether safe to call head
       *
       * @return {boolean}
       */
      hasHead() {
            return this.internalList === nullLinkedList;
      }

      /**
       * Gets the desired index from the list.
       *
       * @param {number} i - The index to get
       * @return {S}
       */

      get(i) {
            if (i < 0) {
                  throw new RangeError(`${i} is smaller than 0`);
            }
            let s = 0;
            let curr = this.internalList;
            let [tree, size, j] = [];
            while (curr !== nullLinkedList) {
                  const nextS = s + curr.h[1];
                  if (nextS > i) {
                        [tree, size, j] = [curr.h[0], curr.h[1], i - s];
                        break;
                  }
                  curr = curr.n;
                  s = nextS;
            }
            if (tree === undefined) {
                  throw new RangeError(`${i} is out of bounds`);
            }

            while (j !== 0) {
                  size = (size - 1) / 2;
                  if (j <= size) {
                        tree = tree.l;
                        j = j - 1;
                  } else {
                        tree = tree.r;
                        j = j - 1 - size;
                  }
            }
            return tree.v;
      }

      /**
       * Maps over the RandomAccessList to return a new list.
       *
       * @template T
       * @param {(el: S, i: number) => T} cb - The index to get
       * @return {RandomAccessList<T>}
       */

      map(cb) {
            if (this.internalList === nullLinkedList) {
                  return this;
            }
            let acc = 0;

            let w = this.internalList;

            const s = {};

            let l = s;

            while (w !== nullLinkedList) {
                  const [tree, size] = w.h;

                  const next = {
                        h: [mapTree(tree, cb, size, acc), size],
                        n: nullLinkedList
                  };

                  l.n = next;
                  l = next;
                  w = w.n;

                  acc = acc + size;
            }

            return new RandomAccessList(s.n);
      }

      /**
       * Prepend the list with the given value.
       *
       * @template Q
       * @param {Q} val - The value to prepend
       * @return {RandomAccessList<S | Q>}
       */
      prepend(val) {
            if (
                  this.internalList === nullLinkedList ||
                  this.internalList.n === nullLinkedList
            ) {
                  return new RandomAccessList({
                        h: [{ v: val }, 1],
                        n: this.internalList
                  });
            }

            const [tree1, size1] = this.internalList.h;
            const [tree2, size2] = this.internalList.n.h;

            const remainder = this.internalList.n.n;

            if (size1 === size2) {
                  return new RandomAccessList({
                        h: [{ v: val, l: tree1, r: tree2 }, size1 + size2 + 1],
                        n: remainder
                  });
            }

            return new RandomAccessList({
                  h: [{ v: val }, 1],
                  n: {
                        h: [tree1, size1],
                        n: {
                              h: [tree2, size2],
                              n: remainder
                        }
                  }
            });
      }

      /**
       * Returns a new RandomAccessList with the index changed to the new value.
       *
       * @template Q
       * @param {number} i - The index to update
       * @param {Q} val - The value to update to
       * @return {RandomAccessList<S | Q>}
       */

      update(i, val) {
            if (i < 0) {
                  throw new RangeError(`${i} is smaller than 0`);
            }

            let acc = 0;

            let w = this.internalList;

            const s = {};

            let l = s;

            while (w !== nullLinkedList) {
                  const [tree, size] = w.h;

                  if (acc + size > i) {
                        const next = {
                              h: [updateTree(tree, size, i - acc, val), size],
                              n: w.n
                        };

                        l.n = next;
                        return new RandomAccessList(s.n);
                  }

                  const next = { h: w.h, n: nullLinkedList };

                  l.n = next;
                  l = next;
                  w = w.n;

                  acc = acc + size;
            }
            throw new RangeError(`${i} is out of bounds`);
      }

      /**
       * Iterates over the list.
       *
       * @return {Iterator<S>}
       */

      *[Symbol.iterator]() {
            let l = this.internalList;
            while (l !== nullLinkedList) {
                  yield* traverseTree(l.h[0]);
                  l = l.n;
            }
      }

      /**
       * Creates a RandomAccessList from an array.
       *
       * @template T
       * @param {Array<T>} arr - The arr to convert
       * @return {RandomAccessList<T>}
       */

      static fromArray(arr) {
            let len = arr.length;
            let res = nullLinkedList;
            while (len !== 0) {
                  const largestAllowableTreeSize = largestBinaryTreeSize(len);
                  const tree = toTree(arr, len - largestAllowableTreeSize, len);
                  res = { h: [tree, largestAllowableTreeSize], n: res };
                  len = len - largestAllowableTreeSize;
            }
            return new RandomAccessList(res);
      }
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
      let pos = i;
      let res = {};
      const start = res;
      while (pos !== 0) {
            res.v = tree.v;
            if (pos < size / 2) {
                  size = (size - 1) / 2;
                  pos = pos - 1;
                  res.l = {};
                  res.r = tree.r;
                  tree = tree.l;
                  res = res.l;
            } else {
                  size = (size - 1) / 2;
                  pos = pos - 1 - size;
                  res.r = {};
                  res.l = tree.l;
                  tree = tree.r;
                  res = res.r;
            }
      }
      res.v = val;
      res.l = tree.l;
      res.r = tree.r;
      return start;
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
