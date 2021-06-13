import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import agent from '../agent';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await agent.Auth.login(email, password);
  
      localStorage.setItem('jwt', result.user.token);
      agent.setToken(result.user.token);
  
      return result;      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const result = await agent.Auth.register(username, email, password);
  
      localStorage.setItem('jwt', result.user.token);
      agent.setToken(result.user.token);
  
      return result;      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

const initialState = {
  inProgress: false,
  errors: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginPageUnloaded: () => initialState,
    registerPageUnloaded: () => initialState,
  },
  extraReducers: builder => {
    const buildLoadingState = state => {
      state.inProgress = true;
    };
    const buildSuccessState = state => {
      state.inProgress = false;
    };
    const buildErrorState = (state, action) => {
      state.inProgress = false;
      state.errors = action.payload.errors;
    };

    builder.addCase(login.pending, buildLoadingState);
    builder.addCase(register.pending, buildLoadingState);

    builder.addCase(login.fulfilled, buildSuccessState);
    builder.addCase(register.fulfilled, buildSuccessState);

    builder.addCase(login.rejected, buildErrorState);
    builder.addCase(register.rejected, buildErrorState);
  },
});

export const { loginPageUnloaded, registerPageUnloaded } = authSlice.actions;

export default authSlice.reducer;
