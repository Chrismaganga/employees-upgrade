import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPoll.css';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { addQuestion } from '../../../features/questionsSlice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { _saveQuestion } from '../../data';

interface NewQuestion {
  optionOneText: string;
  optionTwoText: string;
  author: string;
}

function NewPoll() {
  const [optionOne, setOptionOne] = useState('');
  const [optionTwo, setOptionTwo] = useState('');
  const [error, setError] = useState<string | null | undefined>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authedUser = useSelector((state: RootState) => state.auth.authedUser);

  useEffect(() => {
    if (!authedUser) {
      navigate('/login');
    }
  }, [authedUser, navigate]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!optionOne.trim() || !optionTwo.trim()) {
      setError('Both options are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newPoll: NewQuestion = {
        optionOneText: optionOne.trim(),
        optionTwoText: optionTwo.trim(),
        author: authedUser
      };

      const result = await dispatch(addQuestion(newPoll)).unwrap();
      
      if (result?.id) {
        setOptionOne('');
        setOptionTwo('');
        navigate('/');
      } else {
        throw new Error('Failed to create poll');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error creating poll:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authedUser) {
    return null;
  }

  return (
    <div className="new-poll-container">
      <h2>Would You Rather</h2>
      <p className="subtitle">Create Your New Poll</p>
      
      <form onSubmit={handleSubmit} className="new-poll-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label htmlFor="optionOne">Option One</label>
          <input
            id="optionOne"
            type="text"
            value={optionOne}
            onChange={(e) => setOptionOne(e.target.value)}
            placeholder="Enter first option"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="divider">OR</div>

        <div className="input-group">
          <label htmlFor="optionTwo">Option Two</label>
          <input
            id="optionTwo"
            type="text"
            value={optionTwo}
            onChange={(e) => setOptionTwo(e.target.value)}
            placeholder="Enter second option"
            disabled={isSubmitting}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!optionOne.trim() || !optionTwo.trim() || isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}

export default NewPoll;