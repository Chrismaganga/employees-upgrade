import { useEffect } from 'react';
import Poll from '../poll/Poll';
import './Home.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchQuestions } from '../../../features/questionsSlice';
import type { Question } from '../../data';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state) => state.questions?.questions ?? {});

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <div className="home-container">
      <h2>All Polls</h2>
      <div className="polls-list">
        {Object.values<Question>(questions).map((poll) => (
          <Poll key={poll.id} poll={poll} />
        ))}
      </div>
    </div>
  );
};

export default Home;