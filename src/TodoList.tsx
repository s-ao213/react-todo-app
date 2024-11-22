import React, { useState } from "react";
import { Todo } from "./types";
import TodoItem from "./TodoItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortNumericDown,
  faClock,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void;
  setSortBy: (sortBy: "deadline" | "priority" | null) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  updateIsDone,
  remove,
  onEdit,
  setSortBy,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "completed"
          ? todo.isDone
          : !todo.isDone;
    return matchesSearch && matchesFilter;
  });

  const incompleteTodos = filteredTodos.filter((todo) => !todo.isDone);
  const completedTodos = filteredTodos.filter((todo) => todo.isDone);

  const calculateProgress = () => {
    if (todos.length === 0) return 0;
    return Math.round((completedTodos.length / todos.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow mobile:p-3">
        <div className="mb-2 flex justify-between mobile:flex-col mobile:space-y-1">
          <span className="font-medium text-gray-700 mobile:text-sm">
            完了進捗
          </span>
          <span className="font-medium text-gray-700 mobile:text-base">
            {calculateProgress()}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </div>

      <div className="flex space-x-4 mobile:flex-col mobile:space-x-0 mobile:space-y-3">
        <div className="relative grow mobile:w-full">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 mobile:left-2"
          />
          <input
            type="text"
            placeholder="タスクを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 
              pl-10 pr-4 focus:border-indigo-500 focus:outline-none mobile:py-1.5
              mobile:pl-8 mobile:text-sm"
          />
        </div>

        <div className="relative mobile:w-full">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "active" | "completed")
            }
            className=" w-full rounded-lg border border-gray-300 bg-white px-4 
              py-2 pr-8 focus:border-indigo-500 focus:outline-none
              mobile:py-1.5 mobile:text-sm"
          >
            <option value="all">すべて</option>
            <option value="active">未完了</option>
            <option value="completed">完了済み</option>
          </select>
          <FontAwesomeIcon
            icon={faFilter}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 mobile:right-2"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mobile:flex-col mobile:space-x-0 mobile:space-y-2">
        <button
          onClick={() => setSortBy("deadline")}
          className="flex items-center space-x-2 rounded-lg bg-white 
            px-4 py-2 text-gray-700 shadow transition-all
            hover:bg-gray-50 mobile:px-3 mobile:py-1.5 mobile:text-sm"
        >
          <FontAwesomeIcon icon={faClock} className="mobile:text-sm" />
          <span>期限で並び替え</span>
        </button>
        <button
          onClick={() => setSortBy("priority")}
          className="flex items-center space-x-2 rounded-lg bg-white 
            px-4 py-2 text-gray-700 shadow transition-all
            hover:bg-gray-50 mobile:px-3 mobile:py-1.5 mobile:text-sm"
        >
          <FontAwesomeIcon
            icon={faSortNumericDown}
            className="mobile:text-sm"
          />
          <span>優先度で並び替え</span>
        </button>
      </div>

      {incompleteTodos.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800">
            未完了のタスク
            <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-sm text-red-600">
              {incompleteTodos.length}
            </span>
          </h2>
          <div className="space-y-2">
            {incompleteTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                updateIsDone={updateIsDone}
                remove={remove}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800">
            完了済みのタスク
            <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-sm text-green-600">
              {completedTodos.length}
            </span>
          </h2>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                updateIsDone={updateIsDone}
                remove={remove}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">
              タスクが見つかりません
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "検索条件を変更してみてください"
                : "新しいタスクを追加してみましょう"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
