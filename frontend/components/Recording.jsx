import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";
import Card from "./Card";
import logo from "../src/images/logo.png";
import "../src/App.css";

export default function Recording(props) {
  const startListening = () => {
    resetTranscript(); // Clear previous transcript
    prevTranscriptRef.current = ""; // Reset stored transcript
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const prevTranscriptRef = useRef(""); // Store previous transcript

  const [reloadNotes, setReloadNotes] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [favouriteNote, setfavouriteNote] = useState([]);
  const [edit, setEdit] = useState({ title, content });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    if (transcript && transcript !== prevTranscriptRef.current) {
      const newText = transcript.replace(prevTranscriptRef.current, "").trim();

      // Only update content if there's new valid text
      if (newText && newText !== "undefined") {
        setContent((prev) => (prev ? prev + " " + newText : newText));
      }
      prevTranscriptRef.current = transcript; // Update reference
    }
  }, [transcript]);

  useEffect(() => {
    const useremail = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:6006/get-all-notes/${useremail}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach JWT token
        },
      })
      .then((res) => {
        setNotes(res.data);
        const favNotes = res.data.filter((note) => note.favourite === true);
        setfavouriteNote(favNotes);
      })
      .catch((error) => console.error(error));
  }, [reloadNotes]);

  useEffect(() => {
    setTitle(edit.title);
    setContent(edit.content);
  }, [edit]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleContentChange = (e) => {
    setContent(e.target.value); // Allows manual input while keeping speech input
  };

  const useremail = localStorage.getItem("email");
  const clickHandler = (editNote) => {
    SpeechRecognition.stopListening();
    resetTranscript(); // Clear transcript after saving

    if (editNote.title != "" || editNote.content != "") {
      const updateNote = {
        email: useremail,
        id: editNote.id,
        title: title,
        content: content,
        date: new Date(),
      };

      axios
        .put(`http://localhost:6006/updatenote/${updateNote.id}`, updateNote)
        .then((res) => {
          toast.success("Updated Successfully");
          setTitle("");
          setContent("");
          setEdit("");
          setReloadNotes((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update.");
        });
    } else {
      const note = {
        email: useremail,
        id: Date.now().toString(12),
        title: title,
        content: content, // Use the updated content
        date: new Date(),
      };

      axios
        .post("http://localhost:6006/addnote", note)
        .then((res) => {
          if (title != "") {
            toast.success("Added successfully");
          }
          setTitle("");
          setContent("");
          setReloadNotes((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to add.");
        });
    }
  };

  const closeHandler = () => {
    SpeechRecognition.stopListening();
    setTitle("");
    setContent("");
    setEdit("");
  };

  //   const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredFavData, setFilteredFavData] = useState([]);

  const searchHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(value)
    );

    setFilteredData(filtered); // Update state

    const favFilter = favouriteNote.filter((note) =>
      note.title.toLowerCase().includes(value)
    );
    setFilteredFavData(favFilter);
  };

  const logoutHandler = () => {
    props.setVerified(false);
    localStorage.removeItem("token");
    localStorage.removeItem("verified");
    localStorage.removeItem("email");
  };

  return (
    <div className="main-container">
      {/* Left Panel  */}
      <div
        className="left-container"
      >
        <div className="d-flex align-items-center">
          <img src={logo} height="60px" alt="AI Notes Logo" />
          <h3 className="mt-2 nav-titles">
            AI Notes
          </h3>
        </div>

        <div>
          <ul
            style={{
              paddingLeft: "1rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li
              className="d-flex align-items-center gap-2 m-2 p-2 rounded"
              style={{
                backgroundColor:
                  activeTab === "home" ? "rgb(235, 235, 235)" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("home")}
            >
              <i
                className={`bi ${
                  activeTab === "home" ? "bi-house-fill" : "bi-house"
                }`}
                style={{ fontSize: "2rem", color: "rgb(105, 0, 167)" }}
              ></i>
              <div className="nav-titles">Home</div>
            </li>

            <li
              className="d-flex align-items-center gap-2 m-2 p-2 rounded"
              style={{
                backgroundColor:
                  activeTab === "favourites"
                    ? "rgb(235, 235, 235)"
                    : "transparent",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("favourites")}
            >
              <i
                className={`bi ${
                  activeTab === "favourites" ? "bi-star-fill" : "bi-star"
                }`}
                style={{ fontSize: "2rem", color: "rgb(105, 0, 167)" }}
              ></i>
              <div className="nav-titles">Favourites</div>
            </li>
          </ul>
        </div>

        <button
          className="btn my-auto mx-auto"
          style={{ border: "2px solid rgb(105, 0, 167)" }}
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="right-container">
        <div style={{ position: "relative", width: "75%", marginRight:"22px" }}>
          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              left: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgb(151, 148, 148)",
            }}
          ></i>
          <input
            className="py-2 m-3"
            type="search"
            style={{
              border: "1px solid rgb(208, 203, 203)",
              borderRadius: "20px",
              width: "100%",
              paddingLeft: "45px",
              outline: "none",
            }}
            placeholder="Search"
            onChange={(e) => searchHandler(e)}
          />
        </div>

        {/* Right Panel */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" style={{ width: "80vw" }}>
            <div className="modal-content" style={{ height: "90vh" }}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      Title
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Title"
                      aria-label="title"
                      aria-describedby="basic-addon1"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={startListening}
                >
                  Start Recording
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger m-2"
                  onClick={SpeechRecognition.stopListening}
                >
                  Stop
                </button>
                <div className="form-floating mt-2">
                  <textarea
                    className="form-control"
                    value={content}
                    id="floatingTextarea2"
                    style={{ height: "250px" }}
                    onChange={handleContentChange}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeHandler}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => clickHandler(edit ? edit : "")}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Returning Cards */}
        {activeTab === "home" ? (
          <div className="d-flex m-4 gap-3 flex-wrap justify-content-center">
            {filteredData.length > 0 ? (
              <>
                {filteredData.map((note, index) => {
                  return (
                    <Card
                      key={index}
                      note={note}
                      setReloadNotes={setReloadNotes}
                      setEdit={setEdit}
                    ></Card>
                  );
                })}
              </>
            ) : (
              <>
                {notes.map((note, index) => {
                  return (
                    <Card
                      key={index}
                      note={note}
                      setReloadNotes={setReloadNotes}
                      setEdit={setEdit}
                    ></Card>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <div className="d-flex m-4 gap-3 flex-wrap">
            {filteredFavData.length > 0 ? (
              <>
                {filteredFavData.map((note, index) => {
                  return (
                    <Card
                      key={index}
                      note={note}
                      setReloadNotes={setReloadNotes}
                      setEdit={setEdit}
                    ></Card>
                  );
                })}
              </>
            ) : (
              <>
                {favouriteNote.map((note, index) => {
                  return (
                    <Card
                      key={index}
                      note={note}
                      setReloadNotes={setReloadNotes}
                      setEdit={setEdit}
                    ></Card>
                  );
                })}
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary position-fixed bottom-0 start-50 translate-middle-x mb-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style={{
            backgroundColor: "rgb(105, 0, 167)",
            border: "1px solid rgb(105, 0, 167",
          }}
        >
          Create New Note
        </button>
      </div>
    </div>
  );
}
