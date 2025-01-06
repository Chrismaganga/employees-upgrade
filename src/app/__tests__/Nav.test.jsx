import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Nav from '../components/navbar/Nav';
import authReducer from '../slices/authSlice';
import '@testing-library/jest-dom';

const mockStore = configureStore({
  reducer: {
    auth: authReducer
  },
  preloadedState: {
    auth: {
      isAuthenticated: true,
      userProfile: {
        id: 'testuser',
        name: 'Test User',
        avatarURL: '/avatar.jpg'
      },
      loading: false,
      error: null
    }
  }
});

describe('Nav', () => {
  const renderNav = () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Nav />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders navigation links', () => {
    renderNav();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('New Poll')).toBeInTheDocument();
  });

  test('displays user info', () => {
    renderNav();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar of Test User')).toBeInTheDocument();
  });

  test('shows logout button', () => {
    renderNav();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
