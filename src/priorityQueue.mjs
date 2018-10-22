export default class PriorityQueue {

    constructor() {
        this.array = [];
        this.size = 0;
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

    extract() {
        if (this.size === 0) {
            throw new Error("Queue underflow");
        }
        const ret = this.array[0][0];
        this.size--;
        this.swap(0, this.size);
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
        }
    }

    compare(i1, i2) {
        const p1 = this.array[i1][1];
        const p2 = this.array[i2][1];
        return p1 - p2;
    }

    swap(i1, i2) {
        const tmp = this.array[i1];
        this.array[i1] = this.array[i2];
        this.array[i2] = tmp;
    }

    offer(key, priority) {
        let n = this.size;
        this.size++;
        this.array[n] = [key, priority];
        let p = this.parent(n);
        while (n > 0 && this.compare(p, n) > 0) {
            this.swap(p, n);
            n = p;
            p = this.parent(n);
        }
    }
}
