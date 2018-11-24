import PriorityQueue from "./priorityQueue";

test("when queue is empty then empty() returns true", () => {
    const q = new PriorityQueue();
    expect(q.empty()).toBe(true);
});

test("when queue is empty then peek() throws an error", () => {
    const q = new PriorityQueue();
    expect(() => q.peek()).toThrowError("Queue underflow");
});

test("when queue is empty then poll() throws an error", () => {
    const q = new PriorityQueue();
    expect(() => q.poll()).toThrowError("Queue underflow");
});

test("when using a custom comparator then it is used to determine the order", () => {
    const maxQueue = new PriorityQueue((a, b) => b - a, Number.NEGATIVE_INFINITY);
    maxQueue.offer(1, 1);
    maxQueue.offer(2, 2);
    maxQueue.offer(3, 3);
    expect(maxQueue.poll()).toEqual(3);
    expect(maxQueue.poll()).toEqual(2);
    expect(maxQueue.poll()).toEqual(1);
});

test("when data is inserted in order is is retrieved in order too", () => {
    const q = new PriorityQueue();
    q.offer(1, 3);
    q.offer(2, 6);
    q.offer(3, 9);
    expect(q.poll()).toEqual(1);
    expect(q.poll()).toEqual(2);
    expect(q.poll()).toEqual(3);
});

test("when data is inserted in reversed order is is retrieved in order", () => {
    const q = new PriorityQueue();
    q.offer(3, 9);
    q.offer(2, 6);
    q.offer(1, 3);
    expect(q.poll()).toEqual(1);
    expect(q.poll()).toEqual(2);
    expect(q.poll()).toEqual(3);
});

test("when the priority of an element is decreased then it changes the order of the elements", () => {
    const q = new PriorityQueue();
    for (let i = 1; i <= 10; i++) {
        q.offer(i, i * 3);
    }
    q.update(10, 1);

    // The last element is now the first
    expect(q.poll()).toEqual(10);

    // And the rest is in order
    for (let i = 1; i <= 9; i++) {
        expect(q.poll()).toEqual(i);
    }
});

test("when inserting a duplicated key then raise an error", () => {
    const q = new PriorityQueue();
    q.offer(1, 1);
    expect(() => q.offer(1, 2)).toThrowError("Duplicated key: 1");
});

test("when updating a missing key then raise an error", () => {
    const q = new PriorityQueue();
    expect(() => q.update(10, 1)).toThrowError("Can't find key: 10");
});
