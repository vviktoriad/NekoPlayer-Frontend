import "./Playbar.css";
import React, { useRef, useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";

function Playbar() {
  if (!localStorage.getItem("volume")) {
    localStorage.setItem("volume", 50);
  }

  const audioRef = useRef(null);
  const { state, dispatch } = useContext(AppContext);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(
    localStorage.getItem("volume")
  );
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (state.currentSong.file) {
      const path = `http://127.0.0.1:5000/songs/file/${state.currentSong.file}`;
      fetch(path, {
        method: "GET",
        headers: {
          "Content-Type": "audio/mp3",
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          if (!audioRef.current) return;
          audioRef.current.src = URL.createObjectURL(blob);
        });
    }
  }, [state.currentSong.file]);

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "00:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const handlePause = () => {
    if (!state.currentSong.file) return;
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing the audio:", error);
      });
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setVolumeLevel(newVolume);
    setIsMuted(false);
    localStorage.setItem("volume", newVolume);
  };

  const handleNextSong = async () => {
    if (!state.currentSong.file) return;
    const songList = JSON.parse(localStorage.getItem("songList"));
    const currentSongIndex = songList.findIndex(
      (song) => song.id === state.currentSong.id
    );
    if (currentSongIndex === songList.length - 1) return;
    const nextSong = songList[currentSongIndex + 1];
    dispatch({
      type: "SET_CURRENT_SONG",
      payload: {
        id: nextSong.id,
        title: nextSong.title,
        artist: nextSong.artist,
        cover: nextSong.cover_path,
        file: nextSong.song_path,
      },
    });
  };

  const handlePrevSong = async () => {
    if (!state.currentSong.file) return;
    const songList = JSON.parse(localStorage.getItem("songList"));
    const currentSongIndex = songList.findIndex(
      (song) => song.id === state.currentSong.id
    );
    if (currentSongIndex === 0) return;
    const prevSong = songList[currentSongIndex - 1];
    dispatch({
      type: "SET_CURRENT_SONG",
      payload: {
        id: prevSong.id,
        title: prevSong.title,
        artist: prevSong.artist,
        cover: prevSong.cover_path,
        file: prevSong.song_path,
      },
    });
  };

  return (
    <div className="playbar">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => {
          setIsPlaying(false);
          audioRef.current.volume = localStorage.getItem("volume") / 100;

          if (!isPlaying) {
            audioRef.current.play().catch((error) => {
              console.error("Error playing the audio:", error);
            });
          } else {
            audioRef.current.pause();
            audioRef.current.play().catch((error) => {
              console.error("Error playing the audio:", error);
            });
          }
          setDuration(e.target.duration);
        }}
        onEnded={handleNextSong}
      />

      <div className="song-info-playbar">
        <div className="cover-playbar-container">
          <div className="cover-playbar">
            {state.currentSong.cover && (
              <img
                src={`http://127.0.0.1:5000/songs/cover/${state.currentSong.cover}`}
                alt=""
              />
            )}
          </div>
        </div>
        <div className="song-title-artist-playbar">
          <div className="song-title-playbar">
            {state.currentSong.title && <h4>{state.currentSong.title}</h4>}
          </div>
          <div className="song-artist-playbar">
            {state.currentSong.title && <h5>{state.currentSong.artist}</h5>}
          </div>
        </div>
      </div>
      <div className="control-panel-container">
        <div className="control-panel">
          <div className="control-buttons">
            <div className="previous-button" onClick={handlePrevSong}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 12l15-9v18l-15-9zm-9 0l13 8v-3.268l-7.888-4.732 7.888-4.732v-3.268l-13 8z" />
              </svg>
            </div>
            <div className="play-button" onClick={handlePause}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d={
                    !isPlaying
                      ? "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17h-3v-10h3v10zm5 0h-3v-10h3v10z"
                      : "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 18v-12l10 6-10 6z"
                  }
                />
              </svg>
            </div>
            <div className="next-button" onClick={handleNextSong}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0 21v-18l15 9-15 9zm11-17v3.268l7.888 4.732-7.888 4.732v3.268l13-8-13-8z" />
              </svg>
            </div>
          </div>
          <div className="progress-slider">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              className="slider"
              id="progressRange"
              onChange={(e) => {
                const newTime = e.target.value;
                setCurrentTime(newTime);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
              }}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="volume-slider">
        <div
          className="volume-button"
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.volume = volumeLevel / 100;
              } else {
                audioRef.current.volume = 0;
              }
            }
            setIsMuted(!isMuted);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d={
                isMuted
                  ? "M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm15.324 4.993l1.646-1.659-1.324-1.324-1.651 1.67-1.665-1.648-1.316 1.318 1.67 1.657-1.65 1.669 1.318 1.317 1.658-1.672 1.666 1.653 1.324-1.325-1.676-1.656z"
                  : "M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm11.008 2.093c.742.743 1.2 1.77 1.198 2.903-.002 1.133-.462 2.158-1.205 2.9l1.219 1.223c1.057-1.053 1.712-2.511 1.715-4.121.002-1.611-.648-3.068-1.702-4.125l-1.225 1.22zm2.142-2.135c1.288 1.292 2.082 3.073 2.079 5.041s-.804 3.75-2.096 5.039l1.25 1.254c1.612-1.608 2.613-3.834 2.616-6.291.005-2.457-.986-4.681-2.595-6.293l-1.254 1.25z"
              }
            />
          </svg>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volumeLevel}
          onChange={handleVolumeChange}
          className="slider"
          id="myRange"
        ></input>
      </div>
    </div>
  );
}

export default Playbar;
