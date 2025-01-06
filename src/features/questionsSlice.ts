import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getQuestions, _saveQuestion, _saveQuestionAnswer } from '../app/data';

export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: {
    votes: string[];
    text: string;
  };
  optionTwo: {
    votes: string[];
    text: string;
  };
}

interface QuestionsState {
  questions: Record<string, Question>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface NewQuestion {
  optionOneText: string;
  optionTwoText: string;
  author: string;
}

interface QuestionAnswer {
  authedUser: string;
  qid: string;
  answer: 'optionOne' | 'optionTwo';
}

export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions', 
  async () => {
    const questions = await _getQuestions();
    return questions;
  }
);

export const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async (question: NewQuestion) => {
    const savedQuestion = await _saveQuestion(question);
    return savedQuestion;
  }
);

export const answerQuestion = createAsyncThunk(
  'questions/answerQuestion',
  async (answer: QuestionAnswer) => {
    await _saveQuestionAnswer(answer);
    return answer;
  }
);

const initialState: QuestionsState = {
  questions: {},
  status: 'idle',
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Record<string, Question>>) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch questions';
      })
      .addCase(addQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        state.questions[action.payload.id] = action.payload;
      })
      .addCase(answerQuestion.fulfilled, (state, action: PayloadAction<QuestionAnswer>) => {
        const { qid, answer, authedUser } = action.payload;
        if (state.questions[qid]) {
          state.questions[qid][answer].votes.push(authedUser);
        }
      });
  },
});

export default questionsSlice.reducer;