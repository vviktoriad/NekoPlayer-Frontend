import "./CreatorPanel.css";
import React, { useEffect, useContext } from "react";
import Song from "../Song/Song";
import AppContext from "../../AppContext";

function CreatorPanel({ userId, songs, setSongs }) {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
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

    return () => {
      setSongs([]);
    };
  }, []);

  return (
    <div className="creator-panel">
      {songs.map((song, index) => (
        <Song
          key={index}
          userId={userId}
          songs={songs}
          setSongs={setSongs}
          id={song.id}
          isManaged={true}
          title={song.title}
          cover={song.cover_path}
          file={song.song_path}
          artist={song.artist}
        />
      ))}
    </div>
  );
}

export default CreatorPanel;
