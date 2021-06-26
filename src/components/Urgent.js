import React from 'react';
import "../styles/Urgent.css"

export default function Urgent({todo}) {
    return (
            <li className="urgent-li">{todo.label}</li>
    )
}
