import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../../components/Background/Background";
import Container from "../../components/Container/Container";
import Theme from "../../components/theme/Theme";
import Song from "../../components/Song/Song";
import Playlist from "../../components/Playlist/Playlist";
import AppContext from "../../AppContext";
import "./main.css";

function Main() {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const { state } = useContext(AppContext);

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
            fetch("http://127.0.0.1:5000/songs")
              .then((response) => response.json())
              .then((data) => {
                setSongs(data.songs);
              });

            return () => {
              setSongs([]);
            };
          }
        });
    }
    return () => {
      setSongs([]);
    };
  }, [navigate]);

  const handleLogin = () => {
    navigate("/profile");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div className="main">
      <Background>
        <div className="row1">
          <div className="menu-container">
            <button className="menu-btn" onClick={toggleMenu}>
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
              >
                <path d="m13 16.745c0-.414-.336-.75-.75-.75h-9.5c-.414 0-.75.336-.75.75s.336.75.75.75h9.5c.414 0 .75-.336.75-.75zm9-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm-4-5c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75z" />
              </svg>
            </button>
            <div className={`dropdown-menu ${isMenuVisible ? "visible" : ""}`}>
              <button className="btn" onClick={handleLogin}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z" />
                </svg>
              </button>
              <button className="btn" onClick={handleSettings}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                </svg>
              </button>

              <button
                className="btn"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                <svg
                  width="25"
                  height="25"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path d="M11 21h8.033v-2l1-1v4h-9.033v2l-10-3v-18l10-3v2h9.033v5l-1-1v-3h-8.033v18zm-1 1.656v-21.312l-8 2.4v16.512l8 2.4zm11.086-10.656l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="titlebar"
            // style={{ backgroundImage: "url(/assets/nyan.gif)" }}
          >
            <img alt="dancing neko arc" src="/assets/nekoarc.gif" />
            <h1>NekoPlayer</h1>
            <img alt="dancing neko arc" src="/assets/nekoarc.gif" />
          </div>
          <Theme></Theme>
        </div>

        {/* <div className="row"> */}
        <Container>
          <div className="current-song">
            <div className="current-song-info">
              <div className="current-song-cover-container">
                <img
                  src={
                    state.currentSong.cover
                      ? `http://127.0.0.1:5000/songs/cover/${state.currentSong.cover}`
                      : "/assets/neko.png"
                  }
                  alt=""
                  className="current-song-cover"
                />
              </div>
              <div className="current-song-details">
                <h3 className="current-song-title">
                  {state.currentSong.title
                    ? state.currentSong.title
                    : "No song to play"}
                </h3>
                <h4 className="current-song-artist">
                  {state.currentSong.title ? state.currentSong.artist : ""}
                </h4>
              </div>
            </div>
          </div>
          <div className="creator-panel-main">
            {songs.map((song, index) => (
              <Song
                key={index}
                userId={song.user_id}
                songs={songs}
                setSongs={setSongs}
                id={song.id}
                title={song.title}
                cover={song.cover_path}
                file={song.song_path}
                artist={song.artist}
              />
            ))}
          </div>
        </Container>
        {/* </div> */}
        <Container>
          <Playlist
            isMain={true}
            playlist={playlist}
            setPlaylist={setPlaylist}
          />
        </Container>
      </Background>
    </div>
  );
}

export default Main;
