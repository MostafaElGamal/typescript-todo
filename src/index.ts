function compare(a: Todo, b: Todo) {
  if (a.order < b.order) return -1;
  if (a.order > b.order) return 1;
  return 0;
}

enum AppIds {
  todoForm = "todo_form",
  name = "name",
  todoList = "todo_list",
}

interface TodoInterface {
  id: number;
  name: string;
  order?: number;
}

class Todo implements TodoInterface {
  id: number;
  name: string;
  order: number;

  constructor(name: string, order: number) {
    this.id = Math.random();
    this.name = name;
    this.order = order;
  }
}

class AppState {
  todoList: Todo[] = [];
  private static instance: AppState;

  get orderdTodoList(): Todo[] {
    return this.todoList.sort(compare);
  }

  public static getInstance(): AppState {
    if (!AppState.instance) {
      return new AppState();
    }
    return AppState.instance;
  }

  addTodo(name: string, order: number): void {
    this.todoList.push(new Todo(name, order));
    TodoList.renderTodo();
  }
}

const appState = AppState.getInstance();

class TodoForm {
  constructor() {
    const formEle = document.getElementById(AppIds.todoForm) as HTMLFormElement;
    formEle.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      const form = <HTMLFormElement>e.target;
      const todoName = form.querySelector("#name") as HTMLInputElement;

      if (todoName.value) {
        appState.addTodo(todoName.value, appState.todoList.length + 1);
        form.reset();
      } else {
        alert("Please add all data");
      }
    });
  }
}

class TodoList {
  constructor() {
    TodoList.renderTodo();
  }

  public static renderTodo(): void {
    const todos = appState.orderdTodoList;
    const todoListEle = document.getElementById(AppIds.todoList);
    todoListEle.innerHTML = "";
    todos.map((todo) => {
      const liTemplate = <HTMLTemplateElement>(
        document.getElementById("todo_item")
      );

      liTemplate.content.querySelector("li").id = todo.id.toString();
      liTemplate.content.querySelector(".todo-list__item-title").innerHTML =
        todo.name;
      liTemplate.content.querySelector(".todo-list__item-order").innerHTML =
        todo.order.toString();

      const importedNode = document.importNode(liTemplate.content, true);

      todoListEle.appendChild(importedNode.firstElementChild);
    });
  }
}

new TodoForm();
new TodoList();
