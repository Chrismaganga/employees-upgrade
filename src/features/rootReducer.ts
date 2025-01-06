import { combineReducers } from 'redux';
import questionsReducer from './questionsSlice';
import usersReducer from './usersSlice';
import authReducer from './authSlice';
import pollSlice from './pollsSlice'

const rootReducer = combineReducers({
  questions: questionsReducer,
  users: usersReducer,
  auth: authReducer,
  polls: pollSlice
});

export default rootReducer;
