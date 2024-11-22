import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "./types";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void;
  setSortBy: (sortBy: "deadline" | "priority") => void; // 並び替え用プロップを受け取る
};

const TodoList = ({
  todos,
  updateIsDone,
  remove,
  onEdit,
  setSortBy,
}: Props) => {
  const incompleteTodos = todos.filter((todo) => !todo.isDone);
  const completedTodos = todos.filter((todo) => todo.isDone);

  return (
    <div>
      {/* 並び替えボタン */}
      <div className="mb-4 flex justify-end space-x-2">
        <button
          onClick={() => setSortBy("deadline")}
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          期限で並び替え
        </button>
        <button
          onClick={() => setSortBy("priority")}
          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        >
          優先度で並び替え
        </button>
      </div>

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
