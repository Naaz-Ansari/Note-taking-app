import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Card(props) {

  const [fav, setFav] = useState(false);

  const date = props.note.date;
  const dateObj = new Date(date);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes().toString().padStart(2, "0"); // Ensures two-digit minutes
  let amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Converts 24-hour to 12-hour format

  const formattedDate = `${month} ${day}, ${year} • ${hours}:${minutes} ${amPm}`;

  const deleteHandler = (note) => {
    axios.delete(`http://localhost:6006/delete-note/${note.id}`)
    .then(() => {
        toast.success("Note Deleted");
        props.setReloadNotes(prev => !prev);
    })
    .catch((err) => {
        toast.error("Something went wrong")
        console.error(err)
    })
  }

  const favHandler = (note) => {
    setFav((prev) => {
      const newFav = !prev;  // Flip the current value
  
      axios.patch(`http://localhost:6006/addfav/${note.id}`, {
        favourite: newFav  // Use the updated value
      })
      .then(response => { props.setReloadNotes(prev => !prev) })
      .catch(error => console.error("Update Failed", error));
  
      return newFav;  // Return the updated state
    });
  };

  const editHandler = (note) => {
    props.setEdit(note);
  }
  

  return (
    <div>
      <div className="card p-0" style={{ width: "300px", height: "350px" }}>
        <div className="card-body d-flex-column">
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h6
                className="card-subtitle mb-2"
                style={{
                  color: "rgb(195, 195, 204)",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                {formattedDate}
              </h6>
              <button
                style={{ color: "rgb(105, 0, 167)" }}
                onClick={() => {
                  favHandler(props.note);
                }}
              >
                <i
                    className={`bi ${
                    props.note.favourite === true ? "bi-star-fill" : "bi-star"
                  }`}
                ></i>
              </button>
            </div>

            <h5 className="card-title" style={{ fontWeight: "800" }}>
              {props.note.title}
            </h5>
            <p
              className="card-text"
              style={{ color: "rgb(111, 111, 116)", fontWeight: "500" }}
            >
              {props.note.content}
            </p>
          </div>

          <div
            className="d-flex justify-content-end gap-3 p-3 mt-3"
            style={{ color: "grey" }}
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(props.note?.content);
                toast.success("Copied to Clipboard");
              }}
              style={{ color: "grey" }}
            >
              <i className="bi bi-clipboard"></i>
            </button>
            <button
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              style={{ color: "grey" }}
              onClick={() => editHandler(props.note)}
            >
              <i className="bi bi-pencil-square"></i>
            </button>

            <button
              style={{ color: "grey" }}
              onClick={() => deleteHandler(props.note)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
