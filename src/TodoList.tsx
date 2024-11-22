import React from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoList = ({ todos, updateIsDone, remove }: Props) => {
  if (todos.length === 0) {
    return (
      <div className="p-4 text-center text-lg text-red-500">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-8">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          remove={remove}
          updateIsDone={updateIsDone}
        />
      ))}
    </div>
  );
};

export default TodoList;
