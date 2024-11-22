import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal"; // 新しいモーダルコンポーネントのインポート

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [initialized, setInitialized] = useState(false);
  const localStorageKey = "TodoApp";
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態を管理
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // 編集用タスクの管理

  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
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
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
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

  const addTodo = (name: string, priority: number, deadline: Date | null) => {
    const newTodo: Todo = {
      id: uuid(),
      name,
      isDone: false,
      priority,
      deadline,
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

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <WelcomeMessage
          name="寝屋川タヌキ"
          uncompletedCount={uncompletedCount}
        />
      </div>
      <TodoList
        todos={todos}
        updateIsDone={updateIsDone}
        remove={remove}
        onEdit={handleEditTodo} // タスク編集の処理
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
      />
    </div>
  );
};

export default App;
