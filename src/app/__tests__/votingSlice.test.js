import votingReducer, {
  setUser,
  vote,
  resetVotes,
  enableVotingRights,
} from '../slices/pollsSlice';

describe('votingSlice', () => {
  it('should handle initial state', () => {
    expect(votingReducer(undefined, { type: 'unknown' })).toEqual({
      votes: {},
      canVote: false,
      user: null,
    });
  });

  it('should handle setUser', () => {
    const initialState = {
      votes: {},
      canVote: false,
      user: null,
    };
    const user = { id: 'user1', name: 'Test User' };
    const actual = votingReducer(initialState, setUser(user));
    expect(actual.user).toEqual(user);
    expect(actual.canVote).toBe(true);
  });

  it('should handle vote when user has voting rights', () => {
    const stateWithUser = {
      votes: {},
      canVote: true,
      user: { id: 'user1' },
    };
    const votePayload = {
      pollId: 'poll1',
      option: 'optionOne',
    };
    const actual = votingReducer(stateWithUser, vote(votePayload));
    expect(actual.votes).toEqual({
      'poll1': 'optionOne',
    });
  });

  it('should not handle vote when user has no voting rights', () => {
    const stateWithoutRights = {
      votes: {},
      canVote: false,
      user: { id: 'user1' },
    };
    const votePayload = {
      pollId: 'poll1',
      option: 'optionOne',
    };
    const actual = votingReducer(stateWithoutRights, vote(votePayload));
    expect(actual.votes).toEqual({});
  });

  it('should handle resetVotes', () => {
    const stateWithVotes = {
      votes: { 'poll1': 'optionOne' },
      canVote: true,
      user: { id: 'user1' },
    };
    const actual = votingReducer(stateWithVotes, resetVotes());
    expect(actual).toEqual({
      votes: {},
      canVote: false,
      user: null,
    });
  });

  it('should handle enableVotingRights', () => {
    const stateWithoutRights = {
      votes: {},
      canVote: false,
      user: { id: 'user1' },
    };
    const actual = votingReducer(stateWithoutRights, enableVotingRights());
    expect(actual.canVote).toBe(true);
  });
});
