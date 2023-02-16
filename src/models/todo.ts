import { useState} from 'react';

export default () => {
  const [todo, setTodo] = useState<API.TodoListItem[]>([]);
  const addTodo=(data:API.TodoListItem)=>setTodo([...todo,data])
  const removeTodo=(key:number)=>setTodo([...todo].filter((item)=>item.key===key))
  const updateTodo=(key:number,data:API.TodoListItem)=>{
    const newData=[...todo].map(todo=>{
        if(todo.key===key) return data
        else return todo
    })
    setTodo(newData)
  }
  return {todo,addTodo,removeTodo,updateTodo}
};