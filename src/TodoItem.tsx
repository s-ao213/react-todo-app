import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faStar,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Todo, CategoryIcons } from "./types";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void;
};

const TodoItem: React.FC<Props> = ({ todo, updateIsDone, remove, onEdit }) => {
  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date();
  const deadlineDate = todo.deadline ? new Date(todo.deadline) : null;
  const timeLeft = deadlineDate
    ? deadlineDate.getTime() - new Date().getTime()
    : null;
  const daysLeft = timeLeft
    ? Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysLeft !== null && daysLeft <= 3 && !todo.isDone;
  const categoryIcon =
    CategoryIcons[todo.category as keyof typeof CategoryIcons];

  return (
    <div
      className={`
        group relative flex items-center rounded-lg p-4 shadow 
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg 
        ${todo.isDone ? "bg-green-50" : "bg-white"}
        ${isOverdue ? "border-l-4 border-red-500" : isUrgent ? "border-l-4 border-yellow-500" : "border-l-4 border-transparent"}
        mobile:flex-col mobile:items-start mobile:space-y-2
      `}
    >
      <div className="absolute -right-2 -top-2 flex space-x-1 rounded-full bg-white px-2 py-1 shadow-sm mobile:relative mobile:mb-2 mobile:self-end">
        {[...Array(todo.priority)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
        ))}
      </div>

      <div className="flex w-full items-center space-x-4 mobile:w-full mobile:flex-col mobile:space-x-0 mobile:space-y-2">
        {/* チェックボックス */}
        <div className="relative mobile:self-start">
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => updateIsDone(String(todo.id), e.target.checked)}
            className="size-6 cursor-pointer rounded-full border-2
              transition-colors duration-200 focus:ring-2
              focus:ring-indigo-500 mobile:size-5"
          />
        </div>

        {/* タスク詳細 */}
        <div className="grow mobile:w-full">
          <p
            className={`flex items-center text-lg font-medium
              transition-all duration-200 mobile:text-base
              ${todo.isDone ? "text-gray-500 line-through" : "text-gray-800"}
              ${isOverdue ? "text-red-600" : ""}
            `}
          >
            {todo.name}
            {todo.category && (
              <span className="ml-2 flex items-center space-x-1 text-sm text-gray-500">
                {CategoryIcons[todo.category as keyof typeof CategoryIcons] && (
                  <FontAwesomeIcon
                    icon={
                      CategoryIcons[todo.category as keyof typeof CategoryIcons]
                    }
                    className="mr-1 text-gray-400"
                  />
                )}
                <span>{todo.category}</span>
              </span>
            )}
          </p>

          {deadlineDate && (
            <div className="mt-1 flex items-center space-x-2 text-sm mobile:text-xs">
              <FontAwesomeIcon
                icon={isOverdue ? faExclamationTriangle : faClock}
                className={`mobile:text-sm ${isOverdue ? "text-red-500" : "text-gray-400"}`}
              />
              <span
                className={`
      ${isOverdue ? "text-red-500" : isUrgent ? "text-yellow-600" : "text-gray-500"}
    `}
              >
                {isOverdue && daysLeft !== null
                  ? `期限切れ (${Math.abs(daysLeft)}日経過)`
                  : daysLeft !== null
                    ? `残り${daysLeft}日`
                    : "期限なし"}
              </span>
            </div>
          )}
        </div>

        {/* アクションボタン - モバイル時に常に表示 */}
        <div
          className="
          flex space-x-2 
          opacity-0 transition-opacity duration-200
          group-hover:opacity-100 mobile:w-full mobile:justify-end mobile:opacity-100"
        >
          <button
            onClick={() => onEdit(todo)}
            className=" rounded-full bg-indigo-100 p-2 
              text-indigo-600 transition-colors hover:bg-indigo-200 mobile:p-1.5
              mobile:text-sm"
            title="編集"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => remove(String(todo.id))}
            className="rounded-full bg-red-100 p-2 
              text-red-600 transition-colors hover:bg-red-200 mobile:p-1.5
              mobile:text-sm"
            title="削除"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
