import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import addnotes from './controller/addnote-controller.js';
import getAllNotes from './controller/managenotes-controller.js';
import deleteNote from './controller/managenotes-controller.js';
import updateFav from './controller/managenotes-controller.js';
import updateNote from './controller/managenotes-controller.js';
import userRegister from './controller/register-controller.js';
import userLogin from './controller/login-controller.js';

import dotenv from 'dotenv';
dotenv.config();
console.log('TEST_VAR:', process.env.JWT_SECRET);

const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URI, {
    // useNewUrlParser: true,
    family: 4,
}).then(() => {
    console.log("Connected to database.")
}).catch((error) => {
    console.log("Error",error)
})

app.post("/register", userRegister);
app.post("/login", userLogin);
app.post("/addnote", addnotes.addnotes);
app.get("/get-all-notes/:email", getAllNotes.getAllNotes);
app.delete("/delete-note/:id", deleteNote.deleteNote);
app.patch("/addfav/:id", updateFav.updateFav);
app.put("/updatenote/:id", updateNote.updatedNote);

app.listen(6006, () => {
    console.log("App listening on port 6006")
})