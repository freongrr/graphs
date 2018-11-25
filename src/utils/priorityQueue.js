//@flow
const DEFAULT_COMPARATOR = (a, b) => a - b;

type Comparator<T> = (T, T) => number;

export default class PriorityQueue<T> {

    comparator: Comparator<number>;
    lastValue: number;
    array: [T, number][];
    size: number;
    indexMap: Map<T, number>;

    constructor(comparator: Comparator<number> = DEFAULT_COMPARATOR, lastValue: number = Number.POSITIVE_INFINITY) {
        this.comparator = comparator;
        this.lastValue = lastValue;
        this.array = [];
        this.size = 0;
        this.indexMap = new Map();
    }

    empty(): boolean {
        return this.size === 0;
    }

    static parent(index: number): number {
        return Math.floor((index + 1) / 2) - 1;
    }

    static left(index: number): number {
        return (index + 1) * 2 - 1;
    }

    static right(index: number): number {
        return (index + 1) * 2; // + 1 - 1
    }

    value(index: number): T {
        return this.array[index][0];
    }

    priority(index: number): number {
        return this.array[index][1];
    }

    peek(): T {
        if (this.size === 0) {
            throw new Error("Queue underflow");
        }
        return this.value(0);
    }

    poll(): T {
        const ret = this.peek();
        this.indexMap.delete(ret);
        this.size--;
        this.swap(0, this.size);
        this.heapify(0);
        return ret;
    }

    heapify(n: number): void {
        let head = n;
        const l = PriorityQueue.left(n);
        const r = PriorityQueue.right(n);
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

    compare(index1: number, index2: number): number {
        const priority1 = this.priority(index1);
        const priority2 = this.priority(index2);
        return this.comparator(priority1, priority2);
    }


    swap(index1: number, index2: number): void {
        const tmp = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = tmp;
        this.indexMap.set(this.value(index1), index1);
        this.indexMap.set(this.value(index2), index2);
    }

    offer(key: T, priority: number): void {
        if (this.indexMap.has(key)) {
            throw new Error("Duplicated key: " + (key: any));
        }
        let n = this.size;
        this.size++;
        this.array[n] = [key, this.lastValue];
        this.indexMap.set(key, n);
        this.update(key, priority);
    }

    update(key: T, priority: number): void {
        let n = this.indexMap.get(key);
        if (n === undefined) {
            throw new Error("Can't find key: " + (key: any));
        }
        this.array[n][1] = priority;
        let p = PriorityQueue.parent(n);
        while (n > 0 && this.compare(p, n) > 0) {
            this.swap(p, n);
            n = p;
            p = PriorityQueue.parent(n);
        }
    }
}
