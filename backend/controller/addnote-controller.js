import Notes from '../model/notes-model.js';

const addnotes = async (req, res) => {
    try {
        await Notes.create({
            email: req.body.email,
            id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            date: req.body.date
        })
        res.json({status:"OK"})
    }
    catch(error) {
        res.json({status:error})
    }
}

export default {addnotes};