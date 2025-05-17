import React, { useState } from 'react';

export default function NoteForm({ onSubmit }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your note..."
          required/>
            <button type="submit">Add Note</button>
        </form>
    );
}