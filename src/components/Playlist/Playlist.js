import "./Playlist.css";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Playlist({ isMain = false }) {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  const getCurrentUserId = async () => {
    const response = await fetch("http://127.0.0.1:5000/user/id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (data.id) {
      return data.id;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getCurrentUserId();
      const response = await fetch("http://127.0.0.1:5000/playlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (isMain || userId === 1) {
        setPlaylists(data);
        return;
      }
      const userPlaylists = data.filter(
        (playlist) => playlist.user_id === userId
      );
      setPlaylists(userPlaylists);
    };

    fetchData();
  }, []);

  const removePlaylist = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`http://127.0.0.1:5000/playlist/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          Swal.fire({
            title: "Playlist removed",
            icon: "success",
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
          const newPlaylists = playlists.filter(
            (playlist) => playlist.id !== id
          );
          setPlaylists(newPlaylists);
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred while removing the playlist",
            icon: "error",
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  const handleAddPlaylist = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Create a new playlist",
      html: `
    <input id="swal-input1" class="swal2-input" type="text">
    <input id="swal-input2" class="swal2-file" type="file">
  `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").files[0],
        ];
      },
    });
    if (formValues[0] && formValues[1]) {
      if (!formValues[1].type.includes("image")) {
        Swal.fire({
          title: "Error",
          text: "Cover image must be an image file",
          icon: "error",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", formValues[0]);
      formData.append("cover_image", formValues[1]);
      const response = await fetch("http://127.0.0.1:5000/playlist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          title: "Playlist created",
          icon: "success",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
        const newPlaylist = await response.json();
        console.log(newPlaylist);
        setPlaylists([...playlists, newPlaylist]);
      } else {
        Swal.fire({
          title: "Error",
          text: "An error occurred while creating the playlist",
          icon: "error",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <div className="playlists-back">
      <div className="playlist-header-container">
        <h2 className="playlist-header">Playlists</h2>
        {!isMain ? (
          <div className="add-playlist" onClick={handleAddPlaylist}>
            <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
              <path d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" />
            </svg>
          </div>
        ) : null}
      </div>
      <div className="playlist-container">
        {playlists.map((playlist, index) => (
          <div key={index} className="playlist">
            <div className="cover_div_playlist">
              <img
                src={`http://127.0.0.1:5000/playlist/cover/${playlist.cover_path}`}
                alt="cover"
                className="playlist_cover"
                onClick={() => {
                  localStorage.setItem("playlistId", playlist.id);
                  navigate("/playlists");
                }}
              />

              {!isMain && !playlist.default_playlist ? (
                <div
                  className="remove_playlist_button"
                  onClick={() => removePlaylist(playlist.id)}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
                  </svg>
                </div>
              ) : null}
            </div>
            <h3 className="playlist-title">
              {playlist.default_playlist
                ? `Liked by ${playlist.name}`
                : playlist.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
