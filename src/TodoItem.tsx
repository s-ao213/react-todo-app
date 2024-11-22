import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { Todo } from "./types"; // こちらのインポートが必要

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void; // onEditをPropsに追加
};

const TodoItem = ({ todo, updateIsDone, remove, onEdit }: Props) => {
  // onEditを引数に追加
  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date();

  return (
    <div
      className={`mb-2 flex items-center justify-between rounded-lg p-4 shadow-md transition-shadow duration-200 hover:shadow-lg ${todo.isDone ? "bg-green-200" : isOverdue ? "border border-red-500 bg-red-100" : "bg-white"}`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => updateIsDone(String(todo.id), e.target.checked)}
          className="mr-2 size-5 cursor-pointer accent-blue-600"
        />
        <span
          className={`text-lg ${todo.isDone ? "text-green-800 line-through" : isOverdue ? "font-bold text-red-600" : "text-gray-800"}`}
        >
          {todo.name}
        </span>

        <div className="ml-4 flex">
          {[1, 2, 3].map((value) => (
            <FontAwesomeIcon
              key={value}
              icon={faStarSolid}
              className={`text-yellow-500 ${
                todo.priority >= value ? "" : "text-gray-300" // 未選択時はグレー
              }`}
              style={{ fontSize: "24px" }}
            />
          ))}
        </div>

        <span className="ml-2 text-sm">
          期限:{" "}
          {todo.deadline ? new Date(todo.deadline).toLocaleString() : "なし"}
        </span>
      </div>
      <button
        onClick={() => onEdit(todo)}
        className="ml-auto flex items-center rounded-md bg-yellow-500 px-3 py-1 text-sm font-bold text-white transition duration-200 hover:bg-yellow-600"
      >
        <FontAwesomeIcon icon={faEdit} />
        編集
      </button>
      <button
        onClick={() => remove(String(todo.id))}
        className="ml-2 flex items-center rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white transition duration-200 hover:bg-red-600"
      >
        <FontAwesomeIcon icon={faTrash} className="mr-1" />
        削除
      </button>
    </div>
  );
};

export default TodoItem;
