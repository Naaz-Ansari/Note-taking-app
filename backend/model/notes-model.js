import mongoose from 'mongoose';

const notesModel = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String
        },
        date: {
            type: Date,
            required: true
        },
        favourite: {
            type: Boolean,
            default: false,
            required: true
        }
    }
)

const Notes = new mongoose.model("notes", notesModel);
export default Notes;