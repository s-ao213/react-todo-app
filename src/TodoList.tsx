import React from "react";
import TodoItem from "./TodoItem"; // TodoItemをインポート
import { Todo } from "./types"; // こちらのインポートが必要

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoList = ({ todos, updateIsDone, remove }: Props) => {
  const incompleteTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">未完了のTodo</h2>
      <div>
        {incompleteTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateIsDone={updateIsDone}
            remove={remove}
          />
        ))}
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-bold">完了済みのTodo</h2>
      <div>
        {completedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateIsDone={updateIsDone}
            remove={remove}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
