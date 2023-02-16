import { request } from '@umijs/max';

export async function todo(
    params?: {
      current?: number;
      pageSize?: number;
    },
    options?: { [key: string]: any },
  ) {
    return request<API.TodoList>('/api/todo', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

export async function addTodo(body:API.TodoListItem,options?: { [key: string]: any }) {
    return request<API.TodoListItem>('/api/todo', {
      method: 'POST',
      data: body,
      ...(options || {}),
    });
  }

export async function updateTodo(body:API.TodoListItem,options?: { [key: string]: any }) {
    return request<API.TodoListItem>('/api/todo', {
      method: 'PUT',
      data: body,
      ...(options || {}),
    });
  }

export async function removeTodo(keys:(string|number)[],options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/todo', {
      method: 'DELETE',
      data: keys,
      ...(options || {}),
    });
  }

