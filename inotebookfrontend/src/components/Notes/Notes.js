import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../../context/notes/NoteContext'
import NoteItem from '../NoteItem/NoteItem'
import AddNote from '../AddNote/AddNote'
import { useNavigate } from 'react-router-dom'

export default function Notes(props) {
    const context = useContext(NoteContext)
    let navigate = useNavigate()
    const { notes, getNotes, editNote } = context
    const { showAlert } = props

    useEffect(()=>{
        if(localStorage.getItem('token')!==null)
        {
            getNotes()
        }
        else
        {
            navigate('/login')
        }
    })
    
    const [note,setNote] = useState({
        id: "",
        etitle: "",
        edescription: "",
        etag: ""
    })

    const ref=useRef(null)
    const refClose=useRef(null)
    const updateNote = (currentNote) =>{
        ref.current.click()
        setNote({id: currentNote._id,etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
    }

    const handleClick = (e) => {
        // e.preventDefault()
        editNote(note)
        refClose.current.click()
        showAlert('Updated Successfully','success')
    }

    const onChange = (e) => {
        setNote({...note,[e.target.name]: e.target.value})
    }

    return (
        <div className="row">
            <AddNote showAlert={showAlert}/>
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Notes</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={3} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<3 && note.edescription.length>5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <h2>Your Notes</h2>
            {notes.length===0 && (<h4>No Notes to Display</h4>)}
            {
                notes.map((note)=> {
                    return <NoteItem key={note._id} showAlert={showAlert} updateNote={updateNote} note={note}/>
                })
            }
        </div>
    )
}
