import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background/Background";
import Container from "../../components/Container/Container";
import Song from "../../components/Song/Song";
import Theme from "../../components/theme/Theme";
import "./Playlists.css";

function Playlists() {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState({ name: "", songs: [], author: "" });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
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
            if (!localStorage.getItem("playlistId")) {
              navigate("/main");
            } else {
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
                .then((playlistData) => {
                  fetch(`http://127.0.0.1:5000/user`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                    .then((response) => response.json())
                    .then((userData) => {
                      const filteredUserData = userData.filter(
                        (user) => user.id === playlistData.user_id
                      );
                      playlistData.author = filteredUserData[0].username;
                      setPlaylist(playlistData);
                      setSongs(playlistData.songs);
                      localStorage.setItem(
                        "playlist",
                        JSON.stringify(playlistData)
                      );
                    });
                });
            }
          }
        });
    }
  }, [navigate]);

  return (
    <div className="playlists">
      <Background>
        <div className="profile-navbar">
          <div className="back-button">
            <svg
              width="25"
              height="25"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              fill="currentColor"
              className="back-svg"
              onClick={() => navigate("/main")}
            >
              <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm3 5.753l-6.44 5.247 6.44 5.263-.678.737-7.322-6 7.335-6 .665.753z" />
            </svg>
          </div>
          <Theme />
        </div>
        <Container>
          <div className="current-playlist">
            <div className="current-playlist-info">
              <div className="current-playlist-cover-container">
                <img
                  src={
                    playlist.cover_path
                      ? `http://127.0.0.1:5000/playlist/cover/${playlist.cover_path}`
                      : "/assets/neko.png"
                  }
                  alt=""
                  className="current-playlist-cover"
                />
              </div>
              <div className="current-playlist-details">
                <h3 className="current-playlist-title">
                  {!playlist.default_playlist
                    ? playlist.name
                    : `Liked by ${playlist.name}`}
                </h3>
                <h4 className="current-playlist-autor">
                  <img
                    src={`http://127.0.0.1:5000/user/${playlist.user_id}/photo`}
                    alt="author profile"
                  />
                  {playlist.author} •&nbsp;
                  <span style={{ fontWeight: "400" }}>
                    {playlist.songs.length} songs
                  </span>
                </h4>
              </div>
            </div>
            <div className="creator-panel-playlist">
              <div className="creator-panel">
                {songs.length > 0
                  ? songs.map((song, index) => (
                      <Song
                        key={index}
                        isInPlaylist={true}
                        userId={song.user_id}
                        songs={songs}
                        setSongs={setSongs}
                        setPlaylist={setPlaylist}
                        id={song.id}
                        title={song.title}
                        cover={song.cover_path}
                        file={song.song_path}
                        artist={song.artist}
                      />
                    ))
                  : "No songs in this playlist"}
              </div>
            </div>
          </div>
        </Container>
      </Background>
    </div>
  );
}

export default Playlists;
