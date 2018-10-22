import PriorityQueue from "./priorityQueue";

const queue = new PriorityQueue();
console.log(queue);
console.log("> offer");
queue.offer(3, 9);
console.log(queue);
console.log("> offer");
queue.offer(1, 3);
console.log(queue);
console.log("> offer");
queue.offer(2, 6);
console.log(queue);
// queue.offer(4, 24);
// queue.update(4, 12);

while (!queue.empty()) {
    console.log("> extract");
    console.log(queue.extract());
    console.log(queue);
}
