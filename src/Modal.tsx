import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { Todo, Category, CategoryIcons } from "./types";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTodo: (
    name: string,
    priority: number,
    deadline: Date | null,
    category: string
  ) => void;
  editingTodo: Todo | null;
  onUpdateTodo: (updatedTodo: Todo) => void;
  categories: Category[];
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAddTodo,
  editingTodo,
  onUpdateTodo,
  categories,
}) => {
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoCategory, setNewTodoCategory] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
  }>({});

  // モーダルが開かれるときに初期化
  useEffect(() => {
    if (editingTodo) {
      setNewTodoName(editingTodo.name);
      setNewTodoPriority(editingTodo.priority);
      setNewTodoDeadline(editingTodo.deadline);
      setNewTodoCategory(editingTodo.category || "");
    } else {
      resetForm();
    }
  }, [editingTodo, isOpen]);

  const resetForm = () => {
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setNewTodoCategory("");
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; category?: string } = {};

    if (!newTodoName.trim()) {
      newErrors.name = "タスク名は必須です";
    } else if (newTodoName.length < 2 || newTodoName.length > 32) {
      newErrors.name = "タスク名は2〜32文字で入力してください";
    }

    if (!newTodoCategory) {
      newErrors.category = "カテゴリーを選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingTodo) {
      const updatedTodo: Todo = {
        ...editingTodo,
        name: newTodoName,
        priority: newTodoPriority,
        deadline: newTodoDeadline,
        category: newTodoCategory,
      };
      onUpdateTodo(updatedTodo);
    } else {
      onAddTodo(newTodoName, newTodoPriority, newTodoDeadline, newTodoCategory);
    }
    onClose();
  };

  // キーボードイベントの処理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter") handleSubmit();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="mb-4 text-center text-xl font-bold">
          {editingTodo ? "タスクを編集" : "新しいタスクの追加"}
        </h2>

        {/* タスク名入力 */}
        <div className="mb-4">
          <label htmlFor="newTodoName" className="mb-2 block font-bold">
            タスク名
            <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            id="newTodoName"
            type="text"
            value={newTodoName}
            onChange={(e) => setNewTodoName(e.target.value)}
            className={`w-full rounded border p-2 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="タスク名を入力 (2〜32文字)"
            aria-invalid={!!errors.name}
            aria-describedby="todo-name-error"
          />
          {errors.name && (
            <div id="todo-name-error" className="mt-1 text-red-500">
              {errors.name}
            </div>
          )}
        </div>

        {/* 優先度 */}
        <div className="mb-4">
          <label className="mb-2 block font-bold">優先度</label>
          <div className="flex space-x-2">
            {[1, 2, 3].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setNewTodoPriority(value)}
                className={`rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  newTodoPriority >= value
                    ? "scale-110 text-yellow-500"
                    : "text-gray-300"
                }`}
                aria-label={`優先度 ${value}`}
              >
                <FontAwesomeIcon
                  icon={faStarSolid}
                  style={{
                    fontSize: "28px",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 期限 */}
        <div className="mb-4">
          <label className="mb-2 block font-bold">期限</label>
          <DatePicker
            selected={newTodoDeadline}
            onChange={(date) => setNewTodoDeadline(date)}
            className="w-full rounded border p-2"
            placeholderText="期限を選択 (オプション)"
            dateFormat="yyyy年MM月dd日 HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            minDate={new Date()}
            popperClassName="custom-datepicker-popover"
            locale={ja}
            isClearable
          />
        </div>

        {/* カテゴリー */}
        <div className="mb-4">
          <label className="mb-2 block font-bold">
            カテゴリー
            <span className="ml-1 text-red-500">*</span>
          </label>
          <select
            value={newTodoCategory}
            onChange={(e) => setNewTodoCategory(e.target.value)}
            className={`w-full rounded border p-2 ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            aria-invalid={!!errors.category}
            aria-describedby="category-error"
          >
            <option value="">カテゴリーを選択</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <div id="category-error" className="mt-1 text-red-500">
              {errors.category}
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 transition duration-200 hover:bg-gray-400"
            type="button"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="rounded bg-indigo-500 px-4 py-2 text-white transition duration-200 hover:bg-indigo-600"
            type="button"
          >
            {editingTodo ? "更新" : "追加"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
