import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkUser,
  createUser,
  fetchUserInfo,
  signOut,
  updateUser,
} from "./authAPI";

const initialState = {
  loggedInUserToken: null,
  userInfo: null,
  status: "idle",
  error: null,
};

export const fetchUserInfoAsync = createAsyncThunk(
  "user/fetchUserInfo",
  async () => {
    const response = await fetchUserInfo();

    return response.data;
  }
);

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (userData) => {
    const response = await createUser(userData);
    return response.data;
  }
);

export const signOutAsync = createAsyncThunk("user/signOut", async () => {
  const response = await signOut();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const checkUserAsync = createAsyncThunk(
  "user/loginUser",
  async (loginInfo, { rejectWithValue }) => {
    try {
      const response = await checkUser(loginInfo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const checkAuthAsync = createAsyncThunk("user/checkAuth", async () => {
  try {
    const response = await fetchUserInfo();
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (userData) => {
    const response = await updateUser(userData);
    return response.data;
  }
);

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(checkUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload.data;
        state.userInfo = action.payload.userInfo.data.user;
      })
      .addCase(checkUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(updateUserAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo = action.payload;
      })
      .addCase(signOutAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = null;
        state.userInfo = null;
      })
      .addCase(fetchUserInfoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserInfoAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo = action.payload.user;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo = action.payload.user;
      });
  },
});

export const { increment } = authSlice.actions;

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserInfo = (state) => state.auth.userInfo;

export default authSlice.reducer;
