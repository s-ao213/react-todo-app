import React, { useState } from "react";
import { Todo, Category, CategoryIcons } from "./types";
import TodoItem from "./TodoItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuid } from "uuid";

import {
  faSortNumericDown,
  faSortNumericUp,
  faClock,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  onEdit: (todo: Todo) => void;
  setSortBy: (sortBy: "deadline" | "priority" | null) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  updateIsDone,
  remove,
  onEdit,
  setSortBy,
  categories,
  setCategories,
}) => {
  // const [categories, setCategories] = useState<Category[]>([
  //   { id: "1", name: "仕事", icon: "briefcase" },
  //   { id: "2", name: "学校", icon: "graduation-cap" },
  //   { id: "3", name: "プライベート", icon: "home" },
  // ]);

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setLocalSortBy] = useState<"deadline" | "priority" | null>(
    null
  );

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      const newCategory: Category = {
        id: uuid(),
        name: newCategoryName,
        icon: newCategoryIcon,
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories); // 親コンポーネントのstate更新
      setIsAddCategoryModalOpen(false);
      setNewCategoryName("");
      setNewCategoryIcon("");
    }
  };
  const categorySelectOptions = categories;

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
    const matchesCategory =
      filterCategory === "all" || todo.category === filterCategory;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleSortBy = (sortType: "deadline" | "priority") => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setLocalSortBy(sortType);
      setSortOrder("asc");
    }
    setSortBy(sortType);
  };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (!sortBy) return 0;

    let comparison = 0;
    if (sortBy === "deadline" && a.deadline && b.deadline) {
      comparison =
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (sortBy === "priority") {
      comparison = (a.priority || 0) - (b.priority || 0);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const incompleteTodos = sortedTodos.filter((todo) => !todo.isDone);
  const completedTodos = sortedTodos.filter((todo) => todo.isDone);

  const calculateProgress = () => {
    if (todos.length === 0) return 0;
    return Math.round((completedTodos.length / todos.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* 進捗バー */}
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

      {/* 検索とフィルターセクション */}
      <div className="flex space-x-4 mobile:flex-col mobile:space-x-0 mobile:space-y-3">
        {/* 検索入力 */}
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
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none mobile:py-1.5 mobile:pl-8 mobile:text-sm"
          />
        </div>

        {/* カテゴリーフィルター */}
        <div className="relative mobile:w-full">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 focus:border-indigo-500 focus:outline-none mobile:py-1.5 mobile:text-sm"
          >
            <option value="all">すべてのカテゴリー</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* ステータスフィルター */}
        <div className="relative mobile:w-full">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "active" | "completed")
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 focus:border-indigo-500 focus:outline-none mobile:py-1.5 mobile:text-sm"
          >
            <option value="all">すべてのステータス</option>
            <option value="active">未完了</option>
            <option value="completed">完了</option>
          </select>
        </div>
      </div>
      {/* カテゴリー追加ボタン */}
      <button
        onClick={() => setIsAddCategoryModalOpen(true)}
        className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 mobile:w-full"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        カテゴリーを追加
      </button>

      {/* ソートボタン */}
      <div className="flex justify-end space-x-2 mobile:flex-col mobile:space-x-0 mobile:space-y-2">
        <button
          onClick={() => handleSortBy("deadline")}
          className={`flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 mobile:px-3 mobile:py-1.5 mobile:text-sm ${
            sortBy === "deadline" ? "bg-indigo-100" : ""
          }`}
        >
          <FontAwesomeIcon icon={faClock} className="mobile:text-sm" />
          <span>期限で並び替え</span>
          {sortBy === "deadline" && (
            <FontAwesomeIcon
              icon={sortOrder === "asc" ? faSortNumericUp : faSortNumericDown}
              className="ml-1"
            />
          )}
        </button>
        <button
          onClick={() => handleSortBy("priority")}
          className={`flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow transition-all hover:bg-gray-50 mobile:px-3 mobile:py-1.5 mobile:text-sm ${
            sortBy === "priority" ? "bg-indigo-100" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faSortNumericDown}
            className="mobile:text-sm"
          />
          <span>優先度で並び替え</span>
          {sortBy === "priority" && (
            <FontAwesomeIcon
              icon={sortOrder === "asc" ? faSortNumericUp : faSortNumericDown}
              className="ml-1"
            />
          )}
        </button>
      </div>

      {/* カテゴリー追加モーダル */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">新しいカテゴリーを追加</h2>
            <div className="mb-4">
              <label className="mb-2 block">カテゴリー名</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded border p-2"
                placeholder="カテゴリー名を入力"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block">アイコンを選択</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(CategoryIcons)
                  .filter(
                    ([key, icon], index, self) =>
                      // 最初の出現のみを残す
                      index ===
                      self.findIndex(([, otherIcon]) => otherIcon === icon)
                  )
                  .map(([iconName, icon]) => (
                    <button
                      key={iconName}
                      onClick={() => setNewCategoryIcon(iconName)}
                      className={`rounded p-2 ${
                        newCategoryIcon === iconName
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <FontAwesomeIcon icon={icon} />
                    </button>
                  ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="rounded bg-gray-300 px-4 py-2"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddCategory}
                className="rounded bg-indigo-500 px-4 py-2 text-white"
                disabled={!newCategoryName || !newCategoryIcon}
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 未完了タスクリスト */}
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

      {/* 完了タスクリスト */}
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

      {/* タスクが見つからない場合 */}
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
