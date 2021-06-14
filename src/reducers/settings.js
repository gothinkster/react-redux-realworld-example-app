import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import agent from '../agent';

const initialState = {
  inProgress: false,
  errors: undefined,
};

export const saveSettings = createAsyncThunk('settings/save', agent.Auth.save);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    settingsPageUnloaded: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(saveSettings.pending, state => {
      state.inProgress = true;
    });

    builder.addCase(saveSettings.fulfilled, state => {
      state.inProgress = false;
    });

    builder.addCase(saveSettings.rejected, (state, action) => {
      state.inProgress = false;
      state.errors = action.payload.errors;
    });
  },
});

export const { settingsPageUnloaded } = settingsSlice.actions;

export default settingsSlice.reducer;
