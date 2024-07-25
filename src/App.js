import "./App.css";
import { useReducer } from "react";
import AppContext from "./AppContext";
import { initialState, reducer } from "./reducer";
import Login from "./sites/login/Login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./sites/signup/Signup";
import Profile from "./sites/profile/Profile";
import Main from "./sites/main/Main";
import Playbar from "./components/Playbar/Playbar";
import Settings from "./sites/settings/Settings";
import Playlists from "./sites/playlists/Playlists";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const RenderPlaybar = () => {
    const location = useLocation();
    if (location.pathname === "/login" || location.pathname === "/") {
      return null;
    }
    return <Playbar />;
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/main" element={<Main />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/playlists" element={<Playlists />} />
          </Routes>
          <RenderPlaybar />
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;
