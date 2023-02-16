
import { useModel } from '@umijs/max';
import { Request, Response } from 'express';

const valueEnum: any = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

const genTodos=(x:number)=>{
const tableListDataSource: API.TodoListItem[] = [];

for (let i = 0; i < x; i += 1) {
  tableListDataSource.push({
    key: Math.ceil(Math.random()*1000000)+Date.now(),
    title: 'Title' + i,
    description: 'Description' + i,
    tags: ['tag1' + i, 'tag2' + i, 'tag3' + i],
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 1000),
    dueDate: Date.now() - Math.floor(Math.random() * 2000),
  });
}
return tableListDataSource
}

let Todos:API.TodoListItem[]=[]

const getTodo=(req:Request,res:Response)=>{
    
    const result = {
        data: Todos,
        total: Todos.length,
        success: true,
      };
 
     
      return res.json(result)

}

const postTodo=(req:Request,res:Response)=>{
  const {method,body}=req
  let message:string=""
  switch(method){
    case "DELETE":
     Todos=Todos.filter(item=>!body.includes(item.key))
      message="Todo Removed"
      break
    
    case "PUT":
       Todos=Todos.map(todo=>{
        if(todo.key===body.key) return body
        else return todo
        
    })
      message="Todo Updated"
      break

    case "POST":
      Todos.push(body)
      message="Todo Added"
      break
  }
  const result = {
    success: true,
    message
  };

  res.json(result);
}

export default {
    'GET /api/todo': getTodo,
    'POST /api/todo': postTodo,
    'PUT /api/todo': postTodo,
    'DELETE /api/todo': postTodo,
  };