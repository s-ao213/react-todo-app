// import React from "react";
// import { Todo } from "./types";

// type Props = {
//   todo: Todo;
//   updateIsDone: (id: string, value: boolean) => void;
//   remove: (id: string) => void;
// };

// const TodoItem = (props: Props) => {
//   const todo = props.todo;
//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           checked={todo.isDone}
//           onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
//           className="mr-1.5 cursor-pointer"
//         />
//         {todo.name}
//       </div>
//       <div>
//         <button
//           onClick={() => props.remove(todo.id)}
//           className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
//         >
//           削除
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TodoItem;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Todo } from "./types";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const TodoItem = ({ todo, updateIsDone, remove }: Props) => {
  return (
    <div className="mb-2 flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={(e) => updateIsDone(todo.id, e.target.checked)}
          className="mr-2 size-5 cursor-pointer accent-blue-600"
        />
        <span
          className={`text-lg ${todo.isDone ? "text-gray-500 line-through" : "text-gray-800"}`}
        >
          {todo.name}
        </span>
      </div>
      <button
        onClick={() => remove(todo.id)}
        className="flex items-center rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white transition duration-200 hover:bg-red-600"
      >
        <FontAwesomeIcon icon={faTrash} className="mr-1" />
        削除
      </button>
    </div>
  );
};

export default TodoItem;
