import { useState } from 'react';
import Modal from 'react-modal'; // Importing ReactModal

// Bind modal to the root element
Modal.setAppElement('#root');

function App() {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  // Check if the new date already exists in the todos
  const isDateAlreadyUsed = (newDate) => {
    return todos.some(todo => todo.date === newDate && todo.id !== currentTodoId);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevents the default form submission behavior (page reload)

    // Get the current date and compare it with the selected date
    const selectedDate = new Date(date);
    const currentDate = new Date();

    // Reset time to midnight for a fair comparison of dates only
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      // If the selected date is in the past, show an alert
      alert("You cannot select a past date.");
      return; // Stop the form submission
    }

    // Check if the new date already exists in the todos
    if (isDateAlreadyUsed(date)) {
      alert("This date is already used for another todo.");
      return; // Stop the form submission
    }

    if (isEditing) {
      // Update existing todo
      const updatedTodos = todos.map(todo =>
        todo.id === currentTodoId ? { ...todo, name, description, date } : todo
      );
      setTodos(updatedTodos);
      setIsEditing(false);
    } else {
      // Add new todo
      const newTodo = {
        id: Date.now(),
        name,
        description,
        date,
        completed: false,
      };
      setTodos([...todos, newTodo]);
    }

    // Reset form
    setName('');
    setDescription('');
    setDate('');
    setIsModalOpen(false); // Close modal after save
  };

  // Open modal with the selected todo data for editing
  const handleEdit = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setName(todoToEdit.name);
    setDescription(todoToEdit.description);
    setDate(todoToEdit.date);
    setCurrentTodoId(id);
    setIsEditing(true);
    setIsModalOpen(true); // Open modal
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this todo?");
    if (isConfirmed) {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    }
  };

  const handleComplete = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <>
      <div className='bg-orange-400 h-[160vh] md:h-[120vh] w-[100%]'>
        <div className='flex justify-center py-10'>
          <div className='font-bold text-4xl md:text-2xl text-white'>Todo List</div>
        </div>
        <div className='flex flex-col flex-wrap items-center justify-center w-full overflow-hidden'>
          <form 
            className='bg-gray-600 w-[80%] md:w-[60%] gap-y-5 gap-0 flex justify-between items-end flex-wrap p-5 mb-4 text-white font-semibold rounded'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-wrap gap-x-2 xl:gap-8 md:gap-4'>
              <div className='flex flex-col'>
                <label htmlFor="name" className="px-1 py-2">Name</label>
                <input 
                  required id="name"
                  className="w-[93%] px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none"
                  type="text" 
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="description" className="px-1 py-2">Description</label>
                <input 
                  required id="description"
                  className="w-[93%] px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none"
                  type="text" 
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="date" className="px-1 py-2">Date</label>
                <input 
                  required id="date"
                  className="w-[93%] px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none"
                  type="date" 
                  defaultValue={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-[10px]">
              <button className="px-4 py-2 mt-0 bg-gray-400 rounded-md xl:mt-9" type="submit">
                {isEditing ? 'Save Changes' : 'Add Todo'}
              </button>
            </div>
          </form>
          
          {/* Display the todos list */}
          <div className="w-[80%] md:w-[60%] bg-gray-600 px-2 py-3 md:px-5 text-white font-semibold flex justify-center items-center flex-col">
            {todos.length === 0 ? (
              <h2 className="mb-3 text-3xl font-bold text-orange-400 md:text-5xl">
                Empty Todos
              </h2>
            ) : (
              <>
                <div className='w-full rounded'>
                  <h2 className="mb-3 text-3xl font-bold text-green-400 flex justify-center md:text-5xl">
                    Added Todo
                  </h2>
                  
                  {todos.map((todo) => (
                    <div key={todo.id} className="grid justify-between items-center p-2 w-auto bg-[rgba(0,0,0,0.5)] m-5 rounded md:flex">
                      <div>
                        <p className={`font-bold ${todo.completed ? 'line-through text-green-500' : ''}`}>{todo.name}</p>
                        <p className={`${todo.completed ? 'line-through text-green-500' : ''}`}>{todo.description}</p>
                        <p>{todo.date}</p>
                      </div>
                      <div className="grid gap-2 sm:flex md:flex">
                        <button className="bg-blue-500 px-2 py-1 rounded" onClick={() => handleComplete(todo.id)}>
                          {todo.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button className="bg-yellow-500 px-2 py-1 rounded" onClick={() => handleEdit(todo.id)}>
                          Edit
                        </button>
                        <button className="bg-red-500 px-2 py-1 rounded" onClick={() => handleDelete(todo.id)}>
                          Delete
                        </button>
                      </div>
                    </div>                    
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        className="bg-gray-600 p-6 rounded"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Edit Todo</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            <label htmlFor="name" className="text-white">Name</label>
            <input 
              required id="name"
              className="w-full px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none"
              type="text" 
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="description" className="text-white">Description</label>
            <input 
              required id="description"
              className="w-full px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none"
              type="text" 
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="date" className="text-white">Date</label>
            <input 
              required id="date"
              className="w-full px-2 py-1 font-normal text-black border border-orange-500 rounded-lg focus:outline-none"
              type="date" 
              defaultValue={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className='flex justify-between mt-4'>
            <button className="bg-gray-400 px-4 py-2 rounded" type="submit">Save Changes</button>
            <button className="bg-red-500 px-4 py-2 rounded" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default App;
