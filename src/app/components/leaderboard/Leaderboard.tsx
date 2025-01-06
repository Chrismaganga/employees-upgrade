import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './leaderboard.css';

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

interface Score {
  total: number;
  answered: number;
  created: number;
}

interface UserWithScore extends User {
  score: Score;
}

interface RootState {
  users: {
    users: Record<string, User>;
  };
  auth: {
    isAuthenticated: boolean;
  };
}

const Leaderboard: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.users);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'answered' | 'created'>('score');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const calculateScore = (user: User): Score => {
    const answeredCount = Object.keys(user.answers).length;
    const createdCount = user.questions.length;
    return {
      total: answeredCount + createdCount,
      answered: answeredCount,
      created: createdCount
    };
  };

  const sortedUsers: UserWithScore[] = Object.values(users)
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(user => ({
      ...user,
      score: calculateScore(user)
    }))
    .sort((a, b) => {
      if (sortBy === 'score') {
        return b.score.total - a.score.total;
      } else if (sortBy === 'answered') {
        return b.score.answered - a.score.answered;
      } else {
        return b.score.created - a.score.created;
      }
    });

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      
      <div className="leaderboard-controls">
        <input
          type="text"
          className="leaderboard-search"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="leaderboard-sort"
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'score' | 'answered' | 'created')}
        >
          <option value="score">Total Score</option>
          <option value="answered">Questions Answered</option>
          <option value="created">Questions Created</option>
        </select>
      </div>

      <div className="leaderboard-list">
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="leaderboard-item">
            <div className="rank">{index + 1}</div>
            <div className="user-profile">
              <img
                src={user.avatarURL}
                alt={`Avatar of ${user.name}`}
                className="user-avatar"
              />
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>Questions Created: {user.score.created}</p>
                <p>Questions Answered: {user.score.answered}</p>
              </div>
            </div>
            <div className="score-info">
              <div className="total-score">{user.score.total}</div>
              <div className="score-label">Total Score</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
