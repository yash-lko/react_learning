import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Todos = () => {

    const [input, setInput] = useState("");
    const [todos, setTodos] = useState([]);
    const [search, setSearch] = useState("");

    // Load Todos
    useEffect(() => {

        const storedTodos =
            JSON.parse(localStorage.getItem("todos")) || [];

        setTodos(storedTodos);

    }, []);

    // Input Change
    const inputOnchange = (e) => {
        setInput(e.target.value);
    };

    // Add Todo
    const handleSubmit = () => {

        // Empty Validation
        if (!input.trim()) {

            toast.error("Todo cannot be empty");

            return;
        }

        // Duplicate Validation
        const isDuplicate = todos.some(
            (item) =>
                item.name.toLowerCase() ===
                input.trim().toLowerCase()
        );

        if (isDuplicate) {

            toast.warning(
                "Duplicate todo is not allowed"
            );

            return;
        }

        const todo = {
            id: Date.now(),
            name: input.trim(),
        };

        const allTodos = [...todos, todo];

        setTodos(allTodos);

        localStorage.setItem(
            "todos",
            JSON.stringify(allTodos)
        );

        toast.success("New Todo Added");

        setInput("");
    };

    // Delete Todo
    const handleDelete = (id) => {

        const filteredTodos =
            todos.filter((item) => item.id !== id);

        setTodos(filteredTodos);

        localStorage.setItem(
            "todos",
            JSON.stringify(filteredTodos)
        );

        toast.success("Todo Deleted");
    };

    // Edit Todo
    const handleEdit = (id) => {

        const updatedTodos = todos.map((item) => {

            if (item.id === id) {

                const promptInput =
                    prompt("Update todo", item.name);

                // Cancel Button
                if (promptInput === null) {
                    return item;
                }

                // Empty Validation
                if (!promptInput.trim()) {

                    toast.error(
                        "Todo cannot be empty"
                    );

                    return item;
                }

                // Duplicate Validation
                const isDuplicate = todos.some(
                    (todo) =>
                        todo.name.toLowerCase() ===
                        promptInput
                            .trim()
                            .toLowerCase() &&
                        todo.id !== id
                );

                if (isDuplicate) {

                    toast.warning(
                        "Duplicate todo is not allowed"
                    );

                    return item;
                }

                toast.info("Todo Updated");

                return {
                    ...item,
                    name: promptInput.trim(),
                };
            }

            return item;
        });

        setTodos(updatedTodos);

        localStorage.setItem(
            "todos",
            JSON.stringify(updatedTodos)
        );
    };

    // Search
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // Filtered Todos
    const filteredTodos = todos.filter((item) =>
        item.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="container">

            <div className="todo-card">

                <h1 className="title">
                    Todo App
                </h1>

                {/* Add Todo */}
                <div className="input-wrap">

                    <input
                        type="text"
                        value={input}
                        name="todo"
                        placeholder="Enter todo"
                        onChange={inputOnchange}
                        className="input"
                    />

                    <button
                        onClick={handleSubmit}
                        className="add-btn"
                    >
                        Add
                    </button>

                </div>

                {/* Search */}
                <div className="search-wrap">

                    <input
                        type="search"
                        name="search"
                        placeholder="Search todo"
                        value={search}
                        onChange={handleSearch}
                        className="search-input"
                    />

                </div>

                {/* Empty Todos */}
                {todos.length === 0 ? (

                    <div className="empty-box">

                        <h2>No Todos Found</h2>

                        <p>
                            Please add your todos
                        </p>

                    </div>

                ) : filteredTodos.length === 0 ? (

                    <div className="empty-box">

                        <h2>
                            No Search Result Found
                        </h2>

                    </div>

                ) : (

                    <div className="todo-list">

                        {filteredTodos.map((item) => (

                            <div
                                className="todo-item"
                                key={item.id}
                            >

                                <p className="todo-text">
                                    {item.name}
                                </p>

                                <div className="btn-wrap">

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEdit(item.id)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(item.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
            />

        </div>
    );
};

export default Todos;