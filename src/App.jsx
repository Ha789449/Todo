import { useState, useEffect } from 'react'
import Navbar from './Components/Navbar'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { stringify, v4 as uuidv4 } from 'uuid';

function App() {
 
  const [todo, settodo] = useState("")
  const [todos, settodos] = useState([])
  const [ShowFinished, SetShowFinished] = useState(true)
  useEffect(() => {
   let todoString =localStorage.getItem("todos") 
   if(todoString){
   let todos=JSON.parse(localStorage.getItem("todos")  )
   settodos(todos)}
  }, [])
  
  
  const solveTolS=(params)=>{
  localStorage.setItem("todos", JSON.stringify(todos))

  }

  const toggleFinished= (e) => {
    SetShowFinished(!ShowFinished)
  }
  

  const handleEdit=(e,id)=>{
   let t= todos.filter(i=>i.id === id)
    settodo(t[0].todo)
    let newtodos=todos.filter(item=>{
      return item.id!==id
     })
     settodos(newtodos)
     solveTolS()
  }
  const handleDelete=(e,id)=>{
   let newtodos=todos.filter(item=>{
    return item.id!==id
   })
   settodos(newtodos)
   solveTolS()
  } 

  
  const handleAdd=()=>{
    settodos([...todos, {id: uuidv4(), todo, isCompleted: false}])
    settodo("")
    
    solveTolS()
  }
  const handleChange=(e)=>{
   
    settodo(e.target.value)
    console.log(todo)
  }
  const handleCheckbox =(e)=>{
    console.log(e, e.target)
   let id = e.target.name
   let index = todos.findIndex(item=>{
    return item.id===id
   })
   
   let newtodos=[...todos]
   newtodos[index].isCompleted =!newtodos[index].isCompleted
   settodos(newtodos)
   solveTolS()

  }


  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl bg-violet-100 p-5 min-h-[80vh] md:w-[35%]">

        <h1 className='font-bold text-center text-xl'>ITaks - Manage Your todos at one place </h1>
        <div className="addtodo my-5 flex flex-col gap-4">
          <h2 className='text-xl font-bold '>Add a Todo</h2>
            <div className="flex">
            <input  onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1' />
          <button onClick={handleAdd} disabled={todo.length<=3} className='bg-violet-800 hover:bg-violet-950 disabled:border-violet-600 p-4 py-2 text-sm font-bold text-white mx-2 rounded-full'>Save</button>
        </div>
            </div>
         
        <input className='my-4' id='Show' type="checkbox" onChange={toggleFinished} checked={ShowFinished} /> 
        <label htmlFor="Show">Show Finished</label>
        <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
        <h2 className='text-xl font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length===0 && <div className='m-5'>No Todo display</div>}
          {todos.map((item)=>{

      return  (ShowFinished || !item.isCompleted) &&  <div key={item.id} className="todo flex  my-3 justify-between">
           <div className='flex gap-5'>
        <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted}  id="" />
            <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
            </div>
            <div className="button flex h-full">
              <button onClick={(e)=>{handleEdit(e,item.id)}} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
              <button onClick={(e)=>{handleDelete(e,item.id)}} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
            </div>
          </div>
              })}
        </div>
      </div>
    </>
  )
}

export default App
