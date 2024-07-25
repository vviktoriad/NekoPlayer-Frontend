export function reducer(state, action) {
  switch (action.type) {
    case "ADD_TOKEN": {
      return {
        ...state,
        token: action.payload,
      };
    }
    case "REMOVE_TOKEN": {
      return {
        ...state,
        token: null,
      };
    }
    case "SET_CURRENT_SONG": {
      return {
        ...state,
        currentSong: action.payload,
      };
    }
    default:
      throw Error("Unknown action: " + action.type);
  }
}

export const initialState = {
  token: null,
  currentSong: {
    id: -1,
    title: "",
    artist: "",
    cover: "",
    file: "",
  },
  songs: [],
};
