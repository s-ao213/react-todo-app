import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBriefcase,
  faGraduationCap,
  faHome,
  faShoppingCart,
  faHeartbeat,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";

export interface Category {
  id: string;
  name: string;
  icon: string; // アイコン名を文字列で保存
}

export const CategoryIcons = {
  briefcase: faBriefcase,
  仕事: faBriefcase,
  "graduation-cap": faGraduationCap,
  学校: faGraduationCap,
  home: faHome,
  プライベート: faHome,
  shopping: faShoppingCart,
  買い物: faShoppingCart,
  health: faHeartbeat,
  健康: faHeartbeat,
  travel: faPlane,
  旅行: faPlane,
};

export interface Todo {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null;
  category: string;
}
