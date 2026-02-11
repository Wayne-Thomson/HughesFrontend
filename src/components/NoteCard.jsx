import React from 'react'

const NoteCard = ({ key, note}) => {
  return (
    <div>
      <div key={key} className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
        <p className="text-gray-700">{note.content}</p>
      </div>
    </div>
  )
}

export default NoteCard
