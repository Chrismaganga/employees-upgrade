import { Link } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import './Poll.css';
import type { Question, User } from '../../data';

interface PollProps {
  poll: Question;
  
}

const Poll: React.FC<PollProps> = ({ poll }) => {
  const authedUser = useSelector((state: RootState) => state.auth.authedUser);
  const users = useSelector((state: RootState) => state.users.users);
  const author: User | undefined = users[poll.author];

  const hasVoted = poll.optionOne.votes.includes(authedUser || '') || 
                  poll.optionTwo.votes.includes(authedUser || '');

  const totalVotes = poll.optionOne.votes.length + poll.optionTwo.votes.length;
  const optionOnePercent = totalVotes === 0 ? 0 : 
    Math.round((poll.optionOne.votes.length / totalVotes) * 100);
  const optionTwoPercent = totalVotes === 0 ? 0 : 
    Math.round((poll.optionTwo.votes.length / totalVotes) * 100);

  return (
    <div className="poll-container">
      <div className="poll-header">
        <img 
          src={author?.avatarURL} 
          alt={`Avatar of ${author?.name}`} 
          className="author-avatar"
        />
        <div className="author-info">
          <h3>{author?.name}</h3>
          <p className="timestamp">
            {new Date(poll.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="poll-content">
        <h4>Would you rather...</h4>
        <div className={`poll-options ${hasVoted ? 'voted' : ''}`}>
          <div className="option">
            <p>{poll.optionOne.text}</p>
            {hasVoted && (
              <div className="vote-info">
                <div className="vote-bar" style={{ width: `${optionOnePercent}%` }} />
                <span>{optionOnePercent}% ({poll.optionOne.votes.length} votes)</span>
              </div>
            )}
          </div>
          <div className="option">
            <p>{poll.optionTwo.text}</p>
            {hasVoted && (
              <div className="vote-info">
                <div className="vote-bar" style={{ width: `${optionTwoPercent}%` }} />
                <span>{optionTwoPercent}% ({poll.optionTwo.votes.length} votes)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Link to={`/questions/${poll.id}`} className="view-poll-button">
        View Poll
      </Link>
    </div>
  );
};

export default Poll;