// @ts-ignore
/* eslint-disable */

declare namespace API {
 
  export type TodoListItem = {
    key: number;
    title: string;
    description: string;
    tags: string[];
    status: string;
    createdAt: number;
    dueDate: number;
  };

  type TodoList = {
    data?: TodoListItem[];
    total?: number;
    success?: boolean;
  };
}
