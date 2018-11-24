const DEFAULT_COMPARATOR = (a, b) => a - b;

export default class PriorityQueue {

    constructor(comparator = DEFAULT_COMPARATOR, lastValue = Number.POSITIVE_INFINITY) {
        this.comparator = comparator;
        this.lastValue = lastValue;
        this.array = [];
        this.size = 0;
        this.indexMap = new Map();
    }

    empty() {
        return this.size === 0;
    }

    parent(n) {
        return Math.floor((n + 1) / 2) - 1;
    }

    left(n) {
        return (n + 1) * 2 - 1;
    }

    right(n) {
        return (n + 1) * 2; // + 1 - 1
    }

    peek() {
        if (this.size === 0) {
            throw new Error("Queue underflow");
        }
        return this.array[0][0];
    }

    poll() {
        const ret = this.peek();
        this.indexMap.delete(ret);
        this.size--;
        this.swap(0, this.size);
        this.array[this.size] = null;
        this.heapify(0);
        return ret;
    }

    heapify(n) {
        let head = n;
        const l = this.left(n);
        const r = this.right(n);
        if (l < this.size && this.compare(l, head) < 0) {
            head = l;
        }
        if (r < this.size && this.compare(r, head) < 0) {
            head = r;
        }
        if (head !== n) {
            this.swap(n, head);
            this.heapify(head);
        }
    }

    compare(i1, i2) {
        const p1 = this.array[i1][1];
        const p2 = this.array[i2][1];
        return this.comparator(p1, p2);
    }

    swap(i1, i2) {
        const tmp = this.array[i1];
        this.array[i1] = this.array[i2];
        this.array[i2] = tmp;
        this.indexMap.set(this.array[i1][0], i1);
        this.indexMap.set(this.array[i2][0], i2);
    }

    offer(key, priority) {
        if (this.indexMap.has(key)) {
            throw new Error("Duplicated key: " + key);
        }
        let n = this.size;
        this.size++;
        this.array[n] = [key, this.lastValue];
        this.indexMap.set(key, n);
        this.update(key, priority);
    }

    update(key, priority) {
        let n = this.indexMap.get(key);
        if (n === undefined) {
            throw new Error("Can't find key: " + key);
        }
        this.array[n][1] = priority;
        let p = this.parent(n);
        while (n > 0 && this.compare(p, n) > 0) {
            this.swap(p, n);
            n = p;
            p = this.parent(n);
        }
        return n;
    }
}
