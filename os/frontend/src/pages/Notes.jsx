import React, { useState } from 'react';

const Notes = () => {
  const [notes, setNotes] = useState([
    'Finish project report',
    'Prepare for meeting',
    'Review attendance data',
  ]);
  const [input, setInput] = useState('');

  const addNote = () => {
    if (input.trim()) {
      setNotes([input, ...notes]);
      setInput('');
    }
  };

  return (
    <div className="glass-card w-full max-w-2xl mx-auto flex flex-col items-center gap-6 mt-8">
      <h2 className="text-2xl font-bold text-violet-300 mb-2 flex items-center gap-2">📝 Notes</h2>
      <div className="flex w-full gap-2">
        <input
          className="modern-input flex-1"
          placeholder="Add a new note..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNote()}
        />
        <button className="modern-btn" onClick={addNote}>Add</button>
      </div>
      <ul className="w-full flex flex-col gap-2">
        {notes.length === 0 ? (
          <li className="text-gray-400 text-center">No notes yet.</li>
        ) : (
          notes.map((note, idx) => (
            <li key={idx} className="glass-card p-3 text-white text-sm">{note}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notes; 