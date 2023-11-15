import React, { useState } from 'react'
import NoteContext from './NoteContext.js'

const NoteState = (props) => {

    const host = "http://localhost:5001"

    // Fetch all Notes
    const [notes,setNotes] = useState([])

    // Get all Note
    const getNotes = async () => {
      // API Call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
        }
      })
      const json = await response.json()
      setNotes(json)
    }

    // Add a Note
    const addNote = async ({title,description,tag}) => {
        // TODO:Call API
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag})
        })
        const note = await response.json()
        setNotes(notes.concat(note))
    }

    // Delete a Note
    const deleteNote = async (id) => {
        // API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
          }
      })
      const json = await response.json()
      console.log(json)
      const newNotes=notes.filter((note) => {return note._id!==id})
      setNotes(newNotes)
    }

    // Edit a Note
    const editNote = async ({id, etitle, edescription, etag}) => {
        // TODO:Call API

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title: etitle, description: edescription, tag: etag})
        })
        const json = await response.json()
        console.log(json)
        // Logic to edit in client
        for(let index=0; index<notes.length; index++) {
            if(notes[index]._id === id){
              notes[index].title= etitle
              notes[index].description= edescription
              notes[index].tag= etag
              break;
            }
        }
        console.log(notes)
        setNotes(notes)
    }

    return (
        <NoteContext.Provider value={{notes, setNotes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState