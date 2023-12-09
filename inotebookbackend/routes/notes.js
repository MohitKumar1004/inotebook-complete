const express = require('express')
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body,validationResult } = require('express-validator')

const router = express.Router()

// ROUTE 4:
//      Get All Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req,res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ errors: "Internal Server Error" })
    }
})

// ROUTE 5:
//      Add A Notes using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title','Enter a valid title').isLength({min: 3}),
    body('description','Description is too short').isLength({min: 5})
], async (req,res) => {
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {title,description,tag} = req.body

        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote)
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ errors: "Internal Server Error" })
    }
})

// ROUTE 6:
//      Update An Existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const {title,description,tag} = req.body

        const newNote = {}
        // Create a newNote object
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        // Find the note to be updated and update it
        // const note = Note.findByIdAndUpdate()
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not Found")
        }

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})

        res.json({note})
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ errors: "Internal Server Error" })
    }

})

// ROUTE 7:
//      Delete An Existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        // Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not Found")
        }

        // Allow deletion if user owns this Note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)

        res.json({ "Success": "Note has been deleted", note: note })
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ errors: "Internal Server Error" })
    }

})

module.exports = router