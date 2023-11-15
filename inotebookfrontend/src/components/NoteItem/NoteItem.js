import React, { useContext } from 'react'
import NoteContext from '../../context/notes/NoteContext'

export default function NoteItem(props) {
    const context = useContext(NoteContext)
    const {deleteNote} = context
    
    const {_id,title, description, tag} = props.note
    return (
        <div className="col-lg-3 col-md-4 col-sm-6">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex">
                        <h5 className="card-title">{title}</h5>
                        <div style={{marginLeft:'auto',marginRight:'0'}}>
                            <i className="fa-solid fa-pen-to-square mx-2" onClick={() => props.updateNote(props.note)}></i>
                            <i className="fa-solid fa-trash-can mx-2" onClick={() => {
                                    deleteNote(_id)
                                    props.showAlert('Deleted Successfully','success')
                                }
                            }></i>
                        </div>
                    </div>
                    <p className="card-text">{description}</p>
                    <p className="card-text">{tag}</p>
                </div>
            </div>
        </div>
    )
}
