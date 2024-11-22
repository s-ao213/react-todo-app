import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTodo: (name: string, priority: number, deadline: Date | null) => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAddTodo }) => {
  const [newTodoName, setNewTodoName] = React.useState("");
  const [newTodoPriority, setNewTodoPriority] = React.useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = React.useState<Date | null>(
    null
  );
  const [newTodoNameError, setNewTodoNameError] = React.useState("");

  const closeModal = () => {
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setNewTodoNameError("");
    onClose();
  };

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    }
    return "";
  };

  const handleAddTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    onAddTodo(newTodoName, newTodoPriority, newTodoDeadline);
    closeModal();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold">
          新しいタスクの追加
        </h2>

        {/* タスク名入力 */}
        <div className="mb-4">
          <label htmlFor="newTodoName" className="font-bold">
            タスク名
          </label>
          <input
            id="newTodoName"
            type="text"
            value={newTodoName}
            onChange={(e) => setNewTodoName(e.target.value)}
            className={`w-full rounded border p-2 ${newTodoNameError ? "border-red-500" : "border-gray-300"}`}
            placeholder="タスク名を入力"
          />
          {newTodoNameError && (
            <div className="mt-1 text-red-500">{newTodoNameError}</div>
          )}
        </div>

        {/* 優先度 */}
        <div className="mb-4">
          <label className="font-bold">優先度</label>
          <div className="mt-2 flex space-x-2">
            {[1, 2, 3].map((value) => (
              <button
                key={value}
                onClick={() => setNewTodoPriority(value)}
                className="focus:outline-none"
              >
                <FontAwesomeIcon
                  icon={faStarSolid}
                  className={`transition-colors duration-200 ${
                    newTodoPriority >= value
                      ? "text-yellow-500"
                      : "text-gray-400" // 未選択時を薄いグレーに変更
                  }`}
                  style={{
                    fontSize: "24px",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 期限 */}
        <div className="mb-4">
          <label className="font-bold">期限</label>
          <DatePicker
            selected={newTodoDeadline}
            onChange={(date) => setNewTodoDeadline(date)}
            className="w-full rounded border p-2"
            placeholderText="期限を選択"
            dateFormat="yyyy年MM月dd日 HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            minDate={new Date()}
            popperClassName="custom-datepicker-popover"
            locale={ja} // 日本語ロケールを設定
          />
        </div>

        {/* ボタン */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddTodo}
            className="rounded bg-indigo-500 px-4 py-2 text-white transition duration-200 hover:bg-indigo-600"
          >
            追加
          </button>
          <button
            onClick={closeModal}
            className="ml-2 rounded bg-gray-300 px-4 py-2 transition duration-200 hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;