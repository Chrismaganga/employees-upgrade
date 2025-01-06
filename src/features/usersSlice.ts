import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getUsers } from '../app/data';

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

interface UsersState {
  users: Record<string, User>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface SaveAnswerPayload {
  authedUser: string;
  qid: string;
  answer: string;
}

interface AddQuestionPayload {
  authedUser: string;
  questionId: string;
}

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const users = await _getUsers();
    return users;
  }
);

const initialState: UsersState = {
  users: {},
  status: 'idle',
  error: null
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    saveAnswer: (state, action: PayloadAction<SaveAnswerPayload>) => {
      const { authedUser, qid, answer } = action.payload;
      if (state.users[authedUser]) {
        state.users[authedUser].answers[qid] = answer;
      }
    },
    addQuestion: (state, action: PayloadAction<AddQuestionPayload>) => {
      const { authedUser, questionId } = action.payload;
      if (state.users[authedUser]) {
        state.users[authedUser].questions.push(questionId);
      }
    },
    updateUserAnswers: (state, action: PayloadAction<{ userId: string; questionId: string; answer: string }>) => {
      const { userId, questionId, answer } = action.payload;
      if (state.users[userId]) {
        state.users[userId].answers[questionId] = answer;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { saveAnswer, addQuestion, updateUserAnswers } = usersSlice.actions;
export default usersSlice.reducer;;