import { useState } from 'react';  // Importing the useState hook to manage state in the component
import Navbar from './Components/Navbar';  // Importing the Navbar component to include it in the App

function App() {
  // State to manage the list of todos
  const [todos, setTodos] = useState([]);
  
  // State to manage the input values for the new todo
  const [name, setName] = useState('');  // For managing the todo name
  const [description, setDescription] = useState('');  // For managing the todo description
  const [date, setDate] = useState('');  // For managing the todo date

  // State to track if we are editing an existing todo
  const [isEditing, setIsEditing] = useState(false);
  
  // State to store the ID of the todo being edited
  const [currentTodoId, setCurrentTodoId] = useState(null);

  // Function to handle the submission of the form (either add or edit a todo)
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevents the default form submission behavior (page reload)

    if (isEditing) {
      // If editing, map through todos and update the matching todo by its ID
      const updatedTodos = todos.map(todo => 
        todo.id === currentTodoId ? { ...todo, name, description, date } : todo
      );
      setTodos(updatedTodos);  // Update the todos state with the edited todo
      setIsEditing(false);  // Reset editing mode after saving the changes
    } else {
      // Create a new todo with an ID, name, description, date, and a default `completed` status
      const newTodo = {
        id: Date.now(),  // Using the current timestamp as a unique ID for the todo
        name,
        description,
        date,
        completed: false,  // Todos are not completed by default
      };
      setTodos([...todos, newTodo]);  // Add the new todo to the list of todos
    }

    // Reset the form fields after adding or editing a todo
    setName('');
    setDescription('');
    setDate('');
  };

  // Function to handle deleting a todo
  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this todo?");  // Confirmation prompt
    if (isConfirmed) {
      const updatedTodos = todos.filter(todo => todo.id !== id);  // Remove the todo with the matching ID
      setTodos(updatedTodos);  // Update the todos state after deletion
    }
  };

  // Function to handle editing a todo
  const handleEdit = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);  // Find the todo with the matching ID
    setName(todoToEdit.name);  // Set the form fields to the values of the todo being edited
    setDescription(todoToEdit.description);
    setDate(todoToEdit.date);
    setCurrentTodoId(id);  // Store the ID of the todo being edited
    setIsEditing(true);  // Enable editing mode
  };

  // Function to toggle the completed status of a todo
  const handleComplete = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );  // Toggle the `completed` property of the matching todo
    setTodos(updatedTodos);  // Update the todos state with the modified todo
  };

  return (
    <>
      <Navbar />  {/* Render the Navbar component */}
      <div className='bg-orange-400 h-[160vh] md:h-[120vh] w-[100%] '>
        <div className='flex justify-center py-10'>
          <div className='font-bold text-2xl text-white'>Todo List</div>  {/* Display the heading */}
        </div>
        <div className='flex flex-col flex-wrap items-center justify-center w-full overflow-hidden'>
          <form 
            className='bg-gray-600 w-[80%] md:w-[60%] gap-y-5 gap-0 flex justify-between items-end flex-wrap p-5 mb-4 text-white font-semibold' 
            onSubmit={handleSubmit}  // Attach the handleSubmit function to the form's submit event
          >
            <div className='flex flex-wrap gap-x-2 xl:gap-8'>
              <div className='flex flex-col'>
                <label htmlFor="name" className="px-1 py-2">Name</label>
                <input 
                  required id="name" 
                  className="w-[93%] px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none" 
                  type="text" value={name} 
                  onChange={(e) => setName(e.target.value)}  // Update the `name` state when the input changes
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="description" className="px-1 py-2">Description</label>
                <input 
                  required id="description" 
                  className="w-[93%] px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none" 
                  type="text" value={description} 
                  onChange={(e) => setDescription(e.target.value)}  // Update the `description` state when the input changes
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="date" className="px-1 py-2">Date</label>
                <input 
                  required id="date" 
                  className="w-[93%] px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none" 
                  type="date" value={date} 
                  onChange={(e) => setDate(e.target.value)}  // Update the `date` state when the input changes
                />
              </div>
            </div>
            <div className="mb-[10px]">
              <button className="px-4 py-2 mt-0 bg-orange-400 rounded-md xl:mt-9" type="submit">
                {isEditing ? 'Edit Todo' : 'Add Todo'}  {/* Change button text depending on edit mode */}
              </button>
            </div>
          </form>
          
          {/* Display the todos list */}
          <div className="w-[80%] md:w-[60%] bg-gray-600 px-2 py-3 md:px-5 text-white font-semibold flex justify-center items-center flex-col">
            {todos.length === 0 ? (
              <h2 className="mb-3 text-3xl font-bold text-orange-400 md:text-5xl">
                Empty Todos  {/* Show this message if no todos exist */}
              </h2>
            ) : (
              <>
              <div className='bg-gray-400 w-full'>
                <h2 className="mb-3 text-3xl font-bold text-green-400 flex justify-center md:text-5xl">
                  Added Todo  {/* Show this message if at least one todo is added */}
                </h2>
              
                <ul className="max-h-[490px] overflow-y-auto w-[99%] p-0">
                  {todos.map((todo) => (
                    <li key={todo.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className={`font-bold ${todo.completed ? 'line-through text-green-500' : ''}`}>{todo.name}</p>  {/* Apply line-through if completed */}
                        <p className={`${todo.completed ? 'line-through text-green-500' : ''}`}>{todo.description}</p>  {/* Apply line-through if completed */}
                        <p>{todo.date}</p>  {/* Display the todo date */}
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-500 px-2 py-1 rounded" onClick={() => handleComplete(todo.id)}>
                          Complete  {/* Mark the todo as complete */}
                        </button>
                        <button className="bg-yellow-500 px-2 py-1 rounded" onClick={() => handleEdit(todo.id)}>
                          Edit  {/* Enable editing mode for the selected todo */}
                        </button>
                        <button className="bg-red-500 px-2 py-1 rounded" onClick={() => handleDelete(todo.id)}>
                          Delete  {/* Trigger the delete confirmation and remove the todo */}
                        </button>
                        
                      </div>
                    </li>
                    
                  ))}
                </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
}

export default App;
