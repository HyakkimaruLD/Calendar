import React, { useState } from 'react';

export default function NoteList({ notes, onEdit, onDelete }) {
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleEdit = (note) => {
        setEditingNoteId(note.id);
        setEditText(note.text);
    };

    const handleSave = (noteId) => {
        onEdit(noteId, editText);
        setEditingNoteId(null);
        setEditText('');
    };

    return (
        <div className="note-list">
            {notes.length === 0 ? (
                <p>No notes for this day.</p>
            ) : (
                notes.map((note) => (
                    <div key={note.id} className="note-item">
                        {editingNoteId === note.id ? (
                            <div>
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}/>
                                <button onClick={() => handleSave(note.id)}>Save</button>
                                <button onClick={() => setEditingNoteId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>{note.text}</p>
                                <small>{new Date(note.createdAt).toLocaleString()}</small>
                                <button onClick={() => handleEdit(note)}>Edit</button>
                                <button onClick={() => onDelete(note.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}