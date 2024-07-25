import "./Settings.css";
import Background from "../../components/Background/Background";
import Theme from "../../components/theme/Theme";
import Container from "../../components/Container/Container";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RefreshSongs from "../../refreshSongs";
import AppContext from "../../AppContext";
import Swal from "sweetalert2";

function Settings() {
  const { state, dispatch } = useContext(AppContext);
  const [form, setForm] = useState("");
  const navigate = useNavigate();
  const [id, setId] = useState(-1);
  const [username, setUsername] = useState("Username");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [songs, setSongs] = useState([]);
  const [profilePicUrl, setProfilePicUrl] = useState(
    `http://127.0.0.1:5000/user/${id}/photo`
  );
  const isFormVisible = form !== "";

  const containerStyle = {
    width: isFormVisible ? "70%" : "50%",
    transition: "width 0.5s",
    justifyContent: isFormVisible ? "center" : "space-between",
  };

  const buttonsStyle = {
    width: isFormVisible ? "40%" : "100%",
    transition: "width 0.5s",
  };

  const formStyle = {
    width: isFormVisible ? "50%" : "0%",
    transition: "width 0.5s",
  };

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
            setId(data.id);
            fetch("http://127.0.0.1:5000/user")
              .then((response) => response.json())
              .then((userData) => {
                const user = userData.filter((user) => user.id === data.id);
                setUsername(user[0].username);
              });
          }
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (id !== -1) {
      setProfilePicUrl(`http://127.0.0.1:5000/user/${id}/photo`);
      RefreshSongs(id, setSongs, dispatch);
    } else {
      setProfilePicUrl("./static/profiles/default.jpg");
    }
  }, [id, dispatch]);

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const confirmUsernameChange = async () => {
    const response = await fetch(`http://127.0.0.1:5000/user/${id}/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username: newUsername }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      Swal.fire({
        icon: "success",
        title: "Username changed successfully",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      setUsername(newUsername);
    }
    RefreshSongs(id, setSongs, dispatch);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const confirmImageChange = async () => {
    if (!image) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Missing file!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const formData = new FormData();
    formData.append("photo", image);

    const response = await fetch(`http://127.0.0.1:5000/user/${id}/photo`, {
      method: "PUT",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    const newProfilePicUrl = `http://127.0.0.1:5000/static/profiles/${id}_${image.name}`;
    setProfilePicUrl(newProfilePicUrl);

    RefreshSongs(id, setSongs, dispatch);
  };

  const confirmPasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
    } else {
      const response = await fetch(
        `http://127.0.0.1:5000/user/${id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ new_password: newPassword }),
        }
      );
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        Swal.fire({
          icon: "success",
          title: "Password changed successfully",
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    RefreshSongs(id, setSongs, dispatch);
  };

  const deleteAccount = async () => {
    if (id === 1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't delete the admin account!",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const response = await fetch(`http://127.0.0.1:5000/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      Swal.fire({
        icon: "success",
        title: "Account removed successfully",
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      });
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="settings">
      <Background>
        <div className="settings-navbar">
          <div className="back-button-settings">
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
        <div className="user-info-settings">
          <div className="profile-img-container-settings">
            <img
              className="profile-img-settings"
              src={profilePicUrl}
              alt="profile-pic"
            />
          </div>
          <div className="username-settings">{username}</div>
        </div>
        <div className="settings-container" style={containerStyle}>
          <Container>
            {/* <div className="buttons-form-container"> */}
            <div className="settings-buttons" style={buttonsStyle}>
              <h2 className="settings-title">Settings</h2>
              <button
                className="username-change-button"
                type="button"
                onClick={() => setForm("username")}
              >
                Change username
              </button>
              <button
                className="password-change-button"
                type="button"
                onClick={() => setForm("password")}
              >
                Change password
              </button>
              <button
                className="profile-picture-change-button"
                type="button"
                onClick={() => setForm("profile-pic")}
              >
                Change profile picture
              </button>
              <button
                className="delete-account-button"
                type="button"
                onClick={() => setForm("delete")}
              >
                Delete account
              </button>
            </div>
            <div className="settings-form" style={formStyle}>
              {form === "username" ? (
                <div className="username-form">
                  <input
                    type="text"
                    id="username-change"
                    value={newUsername}
                    onChange={handleUsernameChange}
                    placeholder="New username"
                  />
                  <button
                    type="submit"
                    className="confirm-change-button"
                    onClick={confirmUsernameChange}
                  >
                    Confirm change
                  </button>
                </div>
              ) : form === "password" ? (
                <div className="password-form">
                  <input
                    type="password"
                    id="password-change"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    id="password-change-confirm"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="confirm-change-button"
                    onClick={confirmPasswordChange}
                  >
                    Confirm change
                  </button>
                </div>
              ) : form === "profile-pic" ? (
                <div className="profile-pic-form">
                  <input
                    type="file"
                    id="imageChange"
                    accept="image/png"
                    onChange={handleImageChange}
                  />
                  <button
                    type="submit"
                    className="confirm-change-button"
                    onClick={confirmImageChange}
                  >
                    Confirm change
                  </button>
                </div>
              ) : form === "delete" ? (
                <button
                  type="button"
                  className="delete-account-button"
                  onClick={deleteAccount}
                >
                  Delete account
                </button>
              ) : null}
            </div>
            {/* </div> */}
          </Container>
        </div>
      </Background>
    </div>
  );
}

export default Settings;
