import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getUsers } from '../app/data'

interface User {
  id: string;
  password: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

interface AuthState {
  authedUser: string | null;
  userProfile: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const initialState: AuthState = {
  authedUser: null,
  userProfile: null,
  isAuthenticated: false,
  status: 'idle',
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const users = await _getUsers();
      if (!users) {
        return rejectWithValue('Failed to fetch users');
      }

      const user = users[username];

      if (!user) {
        return rejectWithValue('User not found');
      }

      if (user.password !== password) {
        return rejectWithValue('Incorrect password');
      }

      return {
        authedUser: username,
        userProfile: user
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthedUser(state, action: PayloadAction<string | null>) {
      state.authedUser = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.userProfile = action.payload;
    },
    logout(state) {
      state.authedUser = null;
      state.userProfile = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    clearErrors(state) {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.authedUser = action.payload.authedUser;
        state.userProfile = action.payload.userProfile;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  }
});

export const { setAuthedUser, setUser, logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;