import React, { useCallback, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import useRouter from "use-react-router";

import useInput from "../hooks/useInput";
import useOnEnter from "../hooks/useOnEnter";
import useTodos from "../reducers/useTodos";
import TodoItem from "./TodoItem";
import Urgent from "../components/Urgent";

import "../styles/Urgent.css";

export default function TodoList() {
  const router = useRouter();

  const [todos, { addTodo, deleteTodo, setDone }] = useTodos();
  const [urgent, setUrgent] = useState([]);

  const left = useMemo(() => todos.reduce((p, c) => p + (c.done ? 0 : 1), 0), [
    todos
  ]);

  const visibleTodos = useMemo(
    () =>
      router.match.params.filter
        ? todos.filter(i =>
            router.match.params.filter === "active" ? !i.done : i.done
          )
        : todos,
    [todos, router.match.params.filter]
  );

  const anyDone = useMemo(() => todos.some(i => i.done), [todos]);
  const allSelected = useMemo(() => visibleTodos.every(i => i.done), [
    visibleTodos
  ]);

  const onToggleAll = useCallback(
    () => {
      visibleTodos.forEach(i => setDone(i.id, !allSelected));
    },
    [visibleTodos, allSelected]
  );

  const onClearCompleted = useCallback(
    () => {
      todos.forEach(i => {
        if (i.done) {
          deleteTodo(i.id);
        }
      });
    },
    [todos]
  );

  const [newValue, onNewValueChange, setNewValue] = useInput();
  const onAddTodo = useOnEnter(
    () => {
      if (newValue) {
        addTodo(newValue);
        setNewValue("");
      }
    },
    [newValue]
  );

  const addUrgent = (todo) => {
    const foundTodo = urgent.find((i) => i === todo)
    if(!foundTodo){
      setUrgent([...urgent, todo])
    }
    
  }

  console.log(urgent)

  return (
    <React.Fragment>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyPress={onAddTodo}
          value={newValue}
          onChange={onNewValueChange}
        />
      </header>

      <section className="main">
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={allSelected}
          onChange={onToggleAll}
        />
        <label htmlFor="toggle-all" />
        <ul className="todo-list">
          {visibleTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} addUrgent={addUrgent} urgent={urgent}/>
          ))}
        </ul>

        <ul className="urgent-list">
          {urgent.map(todo => (
            <Urgent key={todo.id}  todo={todo}/>
          ))}
        </ul>

      </section>
      
      <footer className="footer">
        <span className="todo-count">
          <strong>{left}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <NavLink exact={true} to="/" activeClassName="selected">
              All
            </NavLink>
          </li>
          <li>
            <NavLink to="/active" activeClassName="selected">
              Active
            </NavLink>
          </li>
          <li>
            <NavLink to="/completed" activeClassName="selected">
              Completed
            </NavLink>
          </li>
          <li>
            <NavLink to="/urgent" activeClassName="selected">
              Urgent
            </NavLink>
          </li>
        </ul>
        {anyDone && (
          <button className="clear-completed" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </footer>
    </React.Fragment>
  );
}
