import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI, {
    // useNewUrlParser: true,
    family: 4,
});


client.connect(err => {
    if(err) {
        console.error('Failed to connect',err);
        return;
    }
    client.close(); 
});

const database = client.db('test');
const collection = database.collection('notes');

const getAllNotes = async (req, res) => {
    try {
      // Query to find all documents
    const useremail = req.params.email;
    const data = await collection.find({email:useremail}).toArray();
    //   console.log("data",data)
  
      res.status(200).json(data); // Send the fetched data as JSON
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: error });
    }
}

const deleteNote = async(req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ status: "Error", message: "ID is required" });
      }
    
      try {
    
        const deletedNote = await collection.deleteOne({ id: id });
    
        if (deletedNote.deletedCount === 0) {
          return res.status(404).json({ status: "Error", message: "Note not found" });
        }
    
        res.json({
          status: "OK",
          message: "Note deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({
          status: "Error",
          message: "Failed to delete note",
          error: error.message,
        });
      }
}

const updateFav = async(req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
   
    const updatedNote = await collection.findOneAndUpdate(
      { id: id }, 
      { $set: updatedData },  // Update fields
      { returnDocument: "after" }  // Return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
}

const updatedNote = async(req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    
    const updatedNote = await collection.findOneAndUpdate(
      { id: id }, 
      { $set: updatedData },  // Update fields
      { returnDocument: "after" }  // Return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
}

export default {getAllNotes, deleteNote, updateFav, updatedNote};