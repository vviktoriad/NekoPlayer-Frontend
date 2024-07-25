import "./AddSong.css";
import React, { useState, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import AppContext from "../../AppContext";
import RefreshSongs from "../../refreshSongs";
import Swal from "sweetalert2";

function AddSong({ userId, username, setSongs }) {
  const currentTime = new Date().getTime();
  const { dispatch } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [mp3File, setMp3File] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type === "audio/mp3" || file.name.endsWith(".mp3")) {
        setMp3File(file);
      } else if (file.type.startsWith("image/")) {
        setImage(file);
      } else {
        console.warn(
          "Skipped " +
            file.name +
            " because an invalid file extension was provided."
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "audio/mp3": [".mp3"] },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !mp3File || !image) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields!",
      });
      return;
    }

    try {
      const formData = new FormData();
      const songData = {
        title: title,
        artist: username,
        release_date: currentTime, // Current date
      };
      // console.log(songData);
      formData.append("song_data", JSON.stringify(songData));
      formData.append("song_file", mp3File);
      formData.append("cover_image", image);

      const response = await fetch("http://127.0.0.1:5000/songs", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setTitle("");
        setMp3File(null);
        setImage(null);

        fetch("http://127.0.0.1:5000/songs")
          .then((response) => response.json())
          .then((data) => {
            try {
              if (userId === 1) {
                setSongs(data.songs);
              } else {
                const filteredSongs = data.songs.filter(
                  (song) => song.user_id === userId
                );
                setSongs(filteredSongs);
              }
            } catch (e) {
              console.log(e);
            }
          });
        Swal.fire({
          icon: "success",
          title: "Song added!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-song">
      <form className="addsong-form" onSubmit={handleSubmit}>
        <h2 className="addsong-title">Creator Panel</h2>
        <input
          className="input-title"
          name="title"
          placeholder="Song title"
          value={title}
          onChange={handleTitleChange}
        />
        <div
          {...getRootProps()}
          style={{
            backgroundColor: "var(--background-color1)",
            padding: "20px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "20px",
            height: "200px",
          }}
        >
          <input className="mp3-input" {...getInputProps()} />
          {mp3File ? (
            <p className="mp3-name">{mp3File.name}</p>
          ) : (
            <p className="drag-drop-text">
              Drag&Drop MP3 file here
              <br />
              <br /> or
              <br />
              <br />{" "}
              <button type="button" className="select">
                Choose File
              </button>
            </p>
          )}
        </div>
        <div className="cover-upload">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button className="addsong-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddSong;
