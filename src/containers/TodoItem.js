import React, { useCallback, useRef, useState } from "react";
import useOnClickOutside from "use-onclickoutside";

import useDoubleClick from "../hooks/useDoubleClick";
import useOnEnter from "../hooks/useOnEnter";
import useTodos from "../reducers/useTodos";
import"../styles/Urgent.css";


export default function TodoItem({ todo, addUrgent, urgent }) {
  const [, { deleteTodo, setLabel, toggleDone }] = useTodos(() => null);

  const [editing, setEditing] = useState(false);

  const onDelete = useCallback(() => deleteTodo(todo.id), [todo.id]);
  const onDone = useCallback(() => toggleDone(todo.id), [todo.id]);
  const onChange = useCallback(event => setLabel(todo.id, event.target.value), [
    todo.id
  ]);

  const handleViewClick = useDoubleClick(null, () => setEditing(true));
  const finishedCallback = useCallback(
    () => {
      setEditing(false);
      setLabel(todo.id, todo.label.trim());
    },
    [todo]
  );

  const onEnter = useOnEnter(finishedCallback, [todo]);
  const ref = useRef();
  useOnClickOutside(ref, finishedCallback);

  //My code for adding a todo to Urgent
  const urgentHandler = (event) => {
    addUrgent(todo)
  }
  return (
    <li
      onClick={handleViewClick}
      className={`${editing ? "editing" : ""} ${todo.done ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.done}
          onChange={onDone}
          autoFocus={true}
        />
        <label>{todo.label}</label>
        <button className="destroy" onClick={onDelete} />
        <button className="urgent" type="button" onClick={urgentHandler}>urgent</button>
      </div>
      {editing && (
        <input
          ref={ref}
          className="edit"
          value={todo.label}
          onChange={onChange}
          onKeyPress={onEnter}
        />
      )}
    </li>
    
  );
}
