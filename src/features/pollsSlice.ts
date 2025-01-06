import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface PollsState {
  votes: Record<string, string>;
  canVote: boolean;
  user: string | null;
}

interface VotePayload {
  pollId: string;
  option: string;
}

const initialState: PollsState = {
  votes: {},
  canVote: false,
  user: null
};

export const pollsSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.canVote = true;
    },
    vote: (state, action: PayloadAction<VotePayload>) => {
      if (!state.canVote) return;
      const { pollId, option } = action.payload;
      if (!state.votes[pollId]) {
        state.votes[pollId] = option;
      }
    },
    resetVotes: (state) => {
      state.votes = {};
      state.canVote = false;
      state.user = null;
    },
    enableVotingRights: (state) => {
      state.canVote = true;
    }
  }
});

export const { setUser, vote, resetVotes, enableVotingRights } = pollsSlice.actions;
export default pollsSlice.reducer;