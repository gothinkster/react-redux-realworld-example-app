import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import agent from '../agent';

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  agent.Profile.get
);

export const follow = createAsyncThunk('profile/follow', agent.Profile.follow);

export const unfollow = createAsyncThunk(
  'profile/unfollow',
  agent.Profile.unfollow
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {},
  reducers: {
    profilePageUnloaded: () => ({}),
  },
  extraReducers: (builder) => {
    const successCaseReducer = (_, action) => ({
      ...action.payload.profile,
    });

    builder.addCase(getProfile.fulfilled, successCaseReducer);
    builder.addCase(follow.fulfilled, successCaseReducer);
    builder.addCase(unfollow.fulfilled, successCaseReducer);
  },
});

export const { profilePageUnloaded } = profileSlice.actions;

export default profileSlice.reducer;
