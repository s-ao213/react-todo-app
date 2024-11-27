import { Todo } from "./types";

import { v4 as uuid } from "uuid";

export const initTodos: Todo[] = [
  {
    id: uuid(),
    name: "解析2の課題",
    isDone: false,
    priority: 2,
    deadline: new Date(2024, 10, 2, 17, 30),
    category: "学校", // カテゴリー名に変更
  },
  {
    id: uuid(),
    name: "TypeScriptの勉強 (復習)",
    isDone: true,
    priority: 3,
    deadline: null,
    category: "学校", // カテゴリー名に変更
  },
  {
    id: uuid(),
    name: "部屋の掃除",
    isDone: true,
    priority: 2,
    deadline: new Date(2024, 10, 11),
    category: "プライベート", // カテゴリー名に変更
  },
  {
    id: uuid(),
    name: "シフト提出",
    isDone: false,
    priority: 1,
    deadline: null,
    category: "仕事", // カテゴリー名に変更
  },
];
