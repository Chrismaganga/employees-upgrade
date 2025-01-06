import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../components/login/Login';
import authReducer from '../slices/authSlice';

describe('Login Component', () => {
  const renderLogin = () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      }
    });

    const router = createMemoryRouter(
      createRoutesFromElements(
        <Route path="/" element={<Login />} />
      ),
      {
        initialEntries: ['/'],
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }
      }
    );

    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };

  it('renders login page with required elements', () => {
    renderLogin();
    expect(screen.getByText(/EMPLOYEES POLLS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows demo account information', () => {
    renderLogin();
    expect(screen.getByText(/demo accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/sarahedo.*password123/i)).toBeInTheDocument();
  });
});