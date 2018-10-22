import PriorityQueue from "./priorityQueue";

const queue = new PriorityQueue();
console.log(queue);
console.log("> offer 3");
queue.offer(3, 9);
console.log(queue);
console.log("> offer 4");
queue.offer(4, 12);
console.log(queue);
console.log("> offer 1");
queue.offer(1, 3);
console.log(queue);
console.log("> offer 2");
queue.offer(2, 50);
console.log(queue);
console.log("> update 2 -> 6");
queue.update(2, 6);
console.log(queue);

while (!queue.empty()) {
    console.log("> extract");
    console.log(queue.extract());
    console.log(queue);
}
