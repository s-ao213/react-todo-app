import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "./types";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void; // onEdit を Props に追加
};

const TodoList = ({ todos, updateIsDone, remove, onEdit }: Props) => {
  // onEdit を引数に追加
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
            onEdit={onEdit} // onEdit を追加
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
            onEdit={onEdit} // onEdit を追加
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
