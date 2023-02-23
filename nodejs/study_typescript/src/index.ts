import { data } from "./data";
import TodoCollection from "./TodoCollection";
import TodoItem from "./TodoItem";

const sampleTodos : TodoItem[] = data.map(
    (item) => new TodoItem(item.id, item.task, item.complete)
);

const myTodoCollection =  new TodoCollection("My Rodo List", sampleTodos);

myTodoCollection.addTodo("Java 학습");
myTodoCollection.addTodo("친구 만나기");

myTodoCollection.markComplete(3, true);

console.log(`${myTodoCollection.userName}`);
myTodoCollection.todoItems.forEach((item) => item.printDetails());