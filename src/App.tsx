import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate, Outlet } from 'react-router';
import { Footer, Home, Leaderboard, Login, Nav, NewPoll, NotFound, PollDetail } from './app/components';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchUsers } from './features/usersSlice';
import { fetchQuestions } from './features/questionsSlice';

import type { RootState } from './app/store';

export type AppDispatch = typeof useAppDispatch;
export type AppSelector = typeof useAppSelector;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppRootState = typeof useAppSelector<RootState>;

interface ProtectedLayoutProps {
  auth: string | null;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ auth }) => {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
};

const router = (auth: string | null) => createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={auth ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedLayout auth={auth} />}>
        <Route path="/" element={<Home />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="add" element={<NewPoll />} />
        <Route path="questions/:id" element={<PollDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.authedUser);
  const usersStatus = useAppSelector((state) => state.users.status);
  const questionsStatus = useAppSelector((state) => state.questions.status);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
    if (questionsStatus === 'idle') {
      dispatch(fetchQuestions());
    }
  }, [dispatch, usersStatus, questionsStatus]);

  return <RouterProvider router={router(auth)} />;
};

export default App;