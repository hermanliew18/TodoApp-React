import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = todo => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const newTodos = [todo, ...todos];

    setTodos(newTodos);

    fetch("http://localhost:1337/todo", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: todo.text})
    }).then((resp) => resp.json()).then((row) => {
      console.log(row);
    }).catch(console.log);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    fetch(`http://localhost:1337/todo/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: newValue.text})
    }).then((resp) => resp.json()).then((data) => {
    }).catch((err) => {
      console.log(err);
    });

    setTodos(prev => prev.map(item => (item.id === todoId ? newValue : item)));
  };

  const removeTodo = id => {
    const removedArr = [...todos].filter(todo => todo.id !== id);

    setTodos(removedArr);
    fetch(`http://localhost:1337/todo/${id}`, {
      method: 'DELETE',
    }).then((resp) => resp.json()).then((data) => {
    }).catch((err) => {
      console.log(err);
    });
  };

  const completeTodo = id => {
    let updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  useEffect(() => {
    fetch("http://localhost:1337/todo", {
      method: 'GET',
    }).then((resp) => resp.json()).then((data) => {
      const todoData = data.map((row) => {
        return {
          id: row.id,
          text: row.title,
        }
      });
      setTodos(todoData);
    }).catch((err) => {
      console.log(err);
    });
  }, [])

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;