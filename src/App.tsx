import { useState, useEffect } from "react";
import { Todo, Category } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

const App = () => {
  // カテゴリーの定義を追加
  const categories: Category[] = [
    { id: "1", name: "仕事", icon: "briefcase" },
    { id: "2", name: "学校", icon: "graduation-cap" },
    { id: "3", name: "プライベート", icon: "home" },
  ];
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [userName, setUserName] = useState("ユーザー名"); // ユーザー名の状態
  const [isEditingName, setIsEditingName] = useState(false); // 名前編集モードの状態
  const todoLocalStorageKey = "TodoApp";
  const userNameKey = "TodoAppUserName"; // ユーザー名用のキー
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // 既存のTodo読み込み用useEffect
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(todoLocalStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      setTodos(initTodos);
    }

    // ユーザー名の読み込み
    const storedUserName = localStorage.getItem(userNameKey);
    if (storedUserName) {
      setUserName(storedUserName);
    }

    setInitialized(true);
  }, []);

  // ユーザー名保存用のuseEffect
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(userNameKey, userName);
    }
  }, [userName, initialized]);

  // 既存のTodo保存用useEffect
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(todoLocalStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingName(false);
  };

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  const updateTodo = (updatedTodo: Todo) => {
    console.log("Updating Todo:", updatedTodo); // デバッグ用ログ
    setTodos((prevTodos) =>
      prevTodos.map(
        (todo) => (todo.id === updatedTodo.id ? updatedTodo : todo) // IDが一致する場合のみ更新
      )
    );
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === String(id)) {
        return { ...todo, isDone: value };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== String(id));
    setTodos(updatedTodos);
  };

  const addTodo = (
    name: string,
    priority: number,
    deadline: Date | null,
    category: string
  ) => {
    const newTodo: Todo = {
      id: uuid(),
      name,
      isDone: false,
      priority,
      deadline,
      category, // 新しいプロパティを追加
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true); // モーダルを表示
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null); // 編集用タスクをリセット
  };

  const [sortBy, setSortBy] = useState<"deadline" | "priority" | null>(null); // 並び替え状態

  // 未完了のタスクを並び替える関数
  const getSortedTodos = (todos: Todo[]) => {
    if (sortBy === "deadline") {
      return todos.sort(
        (a, b) =>
          (a.deadline?.getTime() || Infinity) -
          (b.deadline?.getTime() || Infinity)
      );
    }
    if (sortBy === "priority") {
      return todos.sort((a, b) => b.priority - a.priority);
    }
    return todos; // フィルタリングを削除
  };

  return (
    <div className="xs:px-2 mx-4 mt-10 w-full max-w-2xl sm:px-4 md:mx-auto">
      {" "}
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <div className="flex items-center">
          {isEditingName ? (
            <form onSubmit={handleNameSubmit} className="flex items-center">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="rounded border border-gray-300 px-2 py-1"
                autoFocus
              />
              <button
                type="submit"
                className="ml-2 rounded bg-indigo-500 px-3 py-1 text-white hover:bg-indigo-600"
              >
                保存
              </button>
            </form>
          ) : (
            <div className="flex items-center">
              <WelcomeMessage
                name={userName}
                uncompletedCount={uncompletedCount}
              />
              <button
                onClick={() => setIsEditingName(true)}
                className="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
              >
                <FontAwesomeIcon icon={faEdit} className="text-gray-600" />
                ユーザー名の変更
              </button>
            </div>
          )}
        </div>
      </div>
      <TodoList
        todos={getSortedTodos(todos)} // todos配列をそのまま渡す
        updateIsDone={updateIsDone}
        remove={remove}
        onEdit={handleEditTodo}
        setSortBy={setSortBy}
      />
      <div className="mt-5 flex justify-between">
        <button
          type="button"
          onClick={removeCompletedTodos}
          className="mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        >
          完了済みのタスクを削除
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-5 flex items-center rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          タスクを追加
        </button>
      </div>
      {/* モーダルコンポーネントの追加 */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddTodo={addTodo}
        onUpdateTodo={updateTodo}
        editingTodo={editingTodo} // 編集用のタスクを渡す
        categories={categories} // カテゴリーリストを渡す
      />
    </div>
  );
};

export default App;
