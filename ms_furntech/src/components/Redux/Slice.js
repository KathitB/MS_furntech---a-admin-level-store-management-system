// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import { apiRequest } from "../../api/api";
// import { apiRequest } from "../api/api";

// // const initialState = {
// //   user: null,
// //   token: null,
// //   isAuthenticated: false,
// //   sessionExpired: false,
// //   isLoading: false,
// // };
// const initialState = {
//   user: JSON.parse(localStorage.getItem("user")) || null,
//   token: localStorage.getItem("token") || null,
//   loading: false,
//   error: null,
// };

// // Async thunk for login
// // export const loginWithCredentials = createAsyncThunk(
// //   "auth/loginWithCredentials",
// //   async ({ email, password }, { rejectWithValue }) => {
// //     try {
// //       const response = await apiRequest("/auth/login", {
// //         method: "POST",
// //         body: JSON.stringify({ email, password }),
// //       });

// //       return response; // { user, token }
// //     } catch (error) {
// //       return rejectWithValue(error.message || "Login failed");
// //     }
// //   },
// // );

// export const loginWithCredentials = createAsyncThunk(
//   "auth/loginWithCredentials",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const data = await apiRequest("/api/user/login", {
//         method: "POST",
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   },
// );
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       const { user, token } = action.payload;

//       state.user = user;
//       state.token = token;
//       state.isAuthenticated = true;
//       state.sessionExpired = false;
//     },

//     logout: (state) => {
//       state.user = null;
//       state.token = null;

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     },

//     setSessionExpired: (state, action) => {
//       state.sessionExpired = action.payload;
//     },

//     setIsLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },

//     hydrateAuth: (state) => {
//       if (state.token) {
//         state.isAuthenticated = true;
//       }
//     },
//   },

//   extraReducers: (builder) => {
//     builder.addCase(loginWithCredentials.pending, (state) => {
//       state.isLoading = true;
//     });

//     // //   .addCase(loginWithCredentials.fulfilled, (state, action) => {
//     // //     const { user, token } = action.payload;

//     // //     state.user = user;
//     // //     state.token = token;
//     // //     state.isAuthenticated = true;
//     // //     state.sessionExpired = false;
//     // //     state.isLoading = false;
//     // //   })

//     builder.addCase(loginWithCredentials.rejected, (state) => {
//       state.isLoading = false;
//     });

//     builder.addCase(loginWithCredentials.fulfilled, (state, action) => {
//       state.loading = false;

//       state.user = action.payload.session.user;
//       state.token = action.payload.session.token;

//       localStorage.setItem("token", action.payload.token);
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//     });
//   },
// });

// export const { login, logout, setSessionExpired, setIsLoading, hydrateAuth } =
//   authSlice.actions;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { apiRequest } from "../api/api";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,

  token: localStorage.getItem("token") || null,

  loading: false,

  error: null,
};

export const loginWithCredentials = createAsyncThunk(
  "auth/loginWithCredentials",

  async ({ email, password, devicetoken }, { rejectWithValue }) => {
    try {
      const payload = { email, password };
      if (devicetoken) {
        payload.devicetoken = devicetoken;
      }
      const response = await apiRequest("/api/user/login", {
        method: "POST",

        body: JSON.stringify(payload),
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        state.loading = false;

        const token = action.payload.session?.token;

        const user = action.payload.data;

        state.user = user;
        state.token = token;

        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(user));
      })

      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
