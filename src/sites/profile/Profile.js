import "./Profile.css";
import Background from "../../components/Background/Background";
import Theme from "../../components/theme/Theme";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container/Container";
import AddSong from "../../components/AddSong/AddSong";
import CreatorPanel from "../../components/CreatorPanel/CreatorPanel";
import Playlist from "../../components/Playlist/Playlist";

function Profile() {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [userId, setUserId] = useState(-1);
  const [username, setUsername] = useState("Username");
  const navigate = useNavigate();

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
            fetch("http://127.0.0.1:5000/user")
              .then((response) => response.json())
              .then((userData) => {
                const user = userData.filter((user) => user.id === data.id);
                setUsername(user[0].username);
                setUserId(data.id);
              });
          }
        });
    }
  }, [navigate]);

  return (
    <div className="profile">
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
        <div className="user-info">
          <div className="profile-img-container">
            <img
              className="profile-img"
              src={
                userId !== -1
                  ? `http://127.0.0.1:5000/user/${userId}/photo`
                  : "./assets/icons/profile-pic.jpg"
              }
              alt="profile-pic"
            />
          </div>
          <div className="username">{username}</div>
        </div>
        <Container>
          <Playlist playlist={playlist} setPlaylist={setPlaylist} />
        </Container>
        <Container>
          <AddSong
            userId={userId}
            username={username}
            songs={songs}
            setSongs={setSongs}
          />
          {userId !== -1 && (
            <CreatorPanel userId={userId} songs={songs} setSongs={setSongs} />
          )}
        </Container>
      </Background>
    </div>
  );
}

export default Profile;
