// src/types.ts
export interface Todo {
  id: string; // idはstring型
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null;
}
