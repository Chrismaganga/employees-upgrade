import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';

import { answerQuestion } from '../../../features/questionsSlice';
import './PollDetail.css';

interface Question {
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

interface User {
  avatarURL: string;
  name: string;
}

interface State {
  auth: {
    authedUser: string | null;
  };
  users: {
    users: { [key: string]: User };
  };
  questions: {
    questions: { [key: string]: Question };
  };
}

const PollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authedUser = useSelector((state: State) => state.auth.authedUser);
  const users = useSelector((state: State) => state.users.users);
  const question = useSelector((state: State) => state.questions.questions[id]);

  useEffect(() => {
    if (!authedUser) {
      navigate('/login');
    }
  }, [authedUser, navigate]);

  if (!question) {
    return (
      <div className="poll-detail-container error">
        <h2>Poll Not Found</h2>
        <p>The poll you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Polls
        </button>
      </div>
    );
  }

  const author = users[question.author];
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const hasVoted = question.optionOne.votes.includes(authedUser || '') ||
                   question.optionTwo.votes.includes(authedUser || '');

  const calculateStats = (option: { votes: string[]; text: string }) => {
    const votes = option.votes.length;
    const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
    return { votes, percentage };
  };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleVote = async () => {
    if (!selectedOption || !authedUser || hasVoted || isVoting) {
      return;
    }

    setIsVoting(true);
    setError(null);

  try{
    const result = await dispatch(answerQuestion({ 
      authedUser: authedUser as string, 
      qid: id as string, 
      answer: selectedOption 
    })).unwrap();
    if (result) {
      navigate('/');
    } else {
      throw new Error('Failed to vote');
    }
  } catch (err) {
    setError('Failed to vote. Please try again.');
  } finally {
    setIsVoting(false);
  }

  const getUserVote = () => {
    if (question.optionOne.votes.includes(authedUser || '')) return 'optionOne';
    if (question.optionTwo.votes.includes(authedUser || '')) return 'optionTwo';
    return null;
  };

  return (
    <div className="poll-detail-container">
      <div className="poll-author">
        <img 
          src={author?.avatarURL} 
          alt={`Avatar of ${author?.name}`} 
          className="author-avatar"
        />
        <div className="author-info">
          <h3>{author?.name} asks:</h3>
          <span className="timestamp">
            {new Date(question.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="poll-content">
        <h2>Would You Rather...</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="options-container">
          {["optionOne", "optionTwo"].map((optionKey) => {
            const option = question[optionKey as keyof Question];
            const stats = calculateStats(option);
            const isSelected = getUserVote() === optionKey;

            return (
              <div 
                key={optionKey} 
                className={`option ${isSelected ? 'voted' : ''}`}
              >
                <div className="option-content">
                  <h3>{option.text}</h3>
                  {hasVoted && (
                    <div className="vote-stats">
                      <div 
                        className="vote-bar" 
                        style={{ width: `${stats.percentage}%` }} 
                      />
                      <div className="stats-text">
                        <span>{stats.votes} votes</span>
                        <span>{stats.percentage}%</span>
                      </div>
                      {isSelected && <span className="your-vote-badge">Your vote</span>}
                    </div>
                  )}
                </div>
                {!hasVoted && (
                  <button
                    className={`vote-button ${selectedOption === optionKey ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(optionKey)}
                    disabled={isVoting}
                  >
                    Select
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {!hasVoted && (
          <button
            className="submit-vote-button"
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
          >
            {isVoting ? 'Submitting...' : 'Submit Vote'}
          </button>
        )}

        <button 
          onClick={() => navigate('/')} 
          className="back-button"
        >
          Back to Polls
        </button>
      </div>
    </div>
  );
};
}
export default PollDetail;
