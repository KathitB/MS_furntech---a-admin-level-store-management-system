import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./components/Redux/Slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
