import TodoItem from "./TodoItem";

// TodoItem을 담는 TodoCollection 클래스
// task 추가, task 찾기, task 완료의 기능
class TodoCollection {
    private nextId : number = 1;

    constructor(public userName:string, public todoItems:TodoItem[]=[]){}

    getTodoById(id:number) : TodoItem | undefined { 
        // return type이 TodoItem이거나 undefined 이다
        return this.todoItems.find( (item) => item.id === id)
    }

    addTodo(task: string) : number {
        while(this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.todoItems.push(new TodoItem(this.nextId, task));
        return this.nextId;
    }

    markComplete(id: number, complete:boolean): void {
        const todoItem = this.getTodoById(id);
        if(todoItem) {
            todoItem.complete = complete;
        }
    }
}

export default TodoCollection;