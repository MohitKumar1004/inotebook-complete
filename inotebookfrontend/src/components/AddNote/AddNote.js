import React, { useContext, useState } from 'react'
import NoteContext from '../../context/notes/NoteContext'

export default function AddNote(props) {
    const context = useContext(NoteContext)
    const { addNote } = context
    const [note,setNote] = useState({
        title:"",
        description:"",
        tag:""
    })
    const { showAlert } = props

    const handleClick = (e) => {
        e.preventDefault()
        addNote(note);
        setNote({
            title:"",
            description:"",
            tag:""
        })
        showAlert('Added Successfully','success')
    }

    const onChange = (e) => {
        setNote({...note,[e.target.name]: e.target.value})
    }

    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={3} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={3} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange}/>
                </div>
                <button disabled={note.title.length<3 && note.description.length>5} type="submit" onClick={handleClick} className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
