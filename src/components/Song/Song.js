import "./Song.css";
import React, { useContext, useState, useEffect } from "react";
import Heart from "@react-sandbox/heart";
import AppContext from "../../AppContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Song({
  isManaged = false,
  isInPlaylist = false,
  userId,
  songs,
  setSongs,
  setPlaylist,
  id,
  title,
  cover,
  file,
  artist,
}) {
  const [loggedId, setLoggedId] = useState(-1);
  const [username, setUsername] = useState("Username");
  const [isFavorite, setIsFavorite] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [playlistToAdd, setPlaylistToAdd] = useState([]);

  const coverPath = `http://127.0.0.1:5000/songs/cover/${cover}`;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/user/id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.id) {
          navigate("/login");
        } else {
          fetch("http://127.0.0.1:5000/user")
            .then((response) => response.json())
            .then((userData) => {
              const user = userData.filter((user) => user.id === data.id);
              setUsername(user[0].username);
              setLoggedId(data.id);
            });
          fetch("http://127.0.0.1:5000/playlist", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => response.json())
            .then((playlistData) => {
              const filteredPlaylists = playlistData.filter(
                (playlist) =>
                  playlist.user_id === data.id && !playlist.default_playlist
              );
              setPlaylistToAdd(filteredPlaylists);
            });
          getFavorites(username).then((data) => {
            const isFavorite =
              data.songs.find((song) => song.id === id) !== undefined;
            setIsFavorite(isFavorite);
          });
        }
      });
  }, [id, navigate, username]);

  const getFavorites = async (username) => {
    const response = await fetch("http://127.0.0.1:5000/playlist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    const filteredPlaylist = data.find(
      (playlist) => playlist.name === username
    );
    return {
      favoritesId: filteredPlaylist ? filteredPlaylist.id : null,
      songs: filteredPlaylist ? filteredPlaylist.songs : [],
    };
  };

  const toggleFavorite = async () => {
    const { favoritesId } = await getFavorites(username);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/playlist/${favoritesId}/song/${id}`,
        {
          method: isFavorite ? "DELETE" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      setIsFavorite(!isFavorite);

      if (isInPlaylist) {
        fetch(
          `http://127.0.0.1:5000/playlist/${localStorage.getItem(
            "playlistId"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (isInPlaylist) {
              localStorage.setItem("playlist", JSON.stringify(data));
              setPlaylist(data);
              setSongs(data.songs);
            }
          });
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: isFavorite
          ? "Song removed from favorites!"
          : "Song added to favorites!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const deleteSong = async () => {
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
        const response = await fetch(`http://127.0.0.1:5000/songs/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (data.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        dispatch({
          type: "SET_CURRENT_SONG",
          payload: { id: -1, title: "", cover: "", file: "", artist: "" },
        });

        fetch("http://127.0.0.1:5000/songs")
          .then((response) => response.json())
          .then((data) => {
            try {
              if (userId === 1) {
                setSongs(data.songs);
                localStorage.setItem("songList", JSON.stringify(data.songs));
              } else {
                const filteredSongs = data.songs.filter(
                  (song) => song.user_id === userId
                );
                setSongs(filteredSongs);
                localStorage.setItem("songList", JSON.stringify(filteredSongs));
              }
            } catch (e) {
              console.log(e);
            }
          });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Song deleted successfully!",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleAddToPlaylist = async () => {
    const playlistResponse = await fetch("http://127.0.0.1:5000/playlist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const playlistData = await playlistResponse.json();
    const filteredPlaylists = playlistData.filter(
      (playlist) => playlist.user_id === loggedId && !playlist.default_playlist
    );

    const { value: fruit } = await Swal.fire({
      title: "Choose playlist",
      input: "select",
      inputOptions: {
        ...filteredPlaylists.map((playlist) => playlist.name),
      },
      inputPlaceholder: "Select a playlist",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === "") {
            resolve("You need to select a playlist!");
          } else {
            resolve();
          }
        });
      },
    });
    if (fruit) {
      const playlistId = filteredPlaylists.find(
        (p) => p.name === filteredPlaylists[fruit].name
      ).id;
      const response = await fetch(
        `http://127.0.0.1:5000/playlist/${playlistId}/song/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error + "!",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Song added to playlist!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleRemoveFromPlaylist = async () => {
    const response = await fetch(
      `http://127.0.0.1:5000/playlist/${localStorage.getItem(
        "playlistId"
      )}/song/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    fetch("http://127.0.0.1:5000/playlist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredPlaylists = data.filter(
          (playlist) =>
            playlist.id === parseInt(localStorage.getItem("playlistId"))
        );
        setPlaylist(filteredPlaylists[0]);
        setSongs(filteredPlaylists[0].songs);
      });

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Song removed from playlist!",
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div
      className="song"
      style={{
        backgroundColor:
          state.currentSong.id === id
            ? "var(--playbar-color)"
            : "var(--background-color1)",
      }}
    >
      <div className="title-cover-div">
        <div className="song-cover_div">
          <img src={coverPath} alt="cover" className="song_cover" />
          <div
            className="dark_div_play"
            onClick={() => {
              if (state.currentSong.file !== file) {
                dispatch({
                  type: "SET_CURRENT_SONG",
                  payload: { id, title, cover, file, artist },
                });
                localStorage.setItem("songList", JSON.stringify(songs));
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path
                d={
                  "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 18v-12l10 6-10 6z"
                }
              />
            </svg>
          </div>
        </div>
        <div className="song-info">
          <h3 className="song-title">{title}</h3>
          <h4 className="song-artist">{artist}</h4>
        </div>
      </div>
      <div className="song-buttons">
        {!isInPlaylist ? (
          <div className="add-to-playlist" onClick={handleAddToPlaylist}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" />
            </svg>
          </div>
        ) : playlistToAdd.find(
            (playlist) =>
              playlist.user_id === loggedId &&
              playlist.id === parseInt(localStorage.getItem("playlistId"))
          )?.user_id === loggedId ? (
          <div className="add-to-playlist" onClick={handleRemoveFromPlaylist}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm4.253 7.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z" />
            </svg>
          </div>
        ) : null}

        {isManaged ? (
          <div className="trash-button" onClick={deleteSong}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z" />
            </svg>
          </div>
        ) : null}

        <div className="like-button">
          <Heart
            activeColor="var(--heart-playlist)"
            inactiveColor="var(--heart-playlist)"
            width={20}
            height={20}
            active={isFavorite}
            onClick={toggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}

export default Song;
