class TodoItem {
    id : number;
    task : string;
    complete: boolean;

    constructor(id:number, task: string, complete: boolean) {
        this.id = id;
        this.task = task;
        this.complete = complete;
    }
}