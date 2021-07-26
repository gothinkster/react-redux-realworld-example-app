import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import faker from 'faker';
import { createMemoryHistory } from 'history';
import fetchMock from 'jest-fetch-mock';
import { Route } from 'react-router-dom';

import render from '../../test/utils';
import AuthScreen from './AuthScreen';

describe('<AuthScreen />', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should render the login form', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/login'],
    });

    render(<Route path="/login" component={AuthScreen} />, { history });

    expect(screen.getByText(/need an account\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('should submit the login form', async () => {
    fetchMock.mockResponse(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              JSON.stringify({
                user: {
                  email: 'warren.boyd@mailinator.com',
                  username: 'warren_boyd',
                  token: '{"sub":"warren_boyd"}',
                  bio: 'Asperiores quos dolorem iure et.',
                  image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
                },
              })
            );
          }, Math.random() * 100);
        })
    );
    const history = createMemoryHistory({
      initialEntries: ['/login'],
    });
    const data = {
      email: 'warren.boyd@mailinator.com',
      password: 'Pa$$w0rd!',
    };

    render(<Route path="/login" component={AuthScreen} />, { history });

    user.type(screen.getByPlaceholderText('Email'), data.email);
    user.type(screen.getByPlaceholderText('Password'), data.password);

    user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).not.toBeDisabled();
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should render the register form', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/register'],
    });

    render(<Route path="/register" component={AuthScreen} />, { history });

    expect(screen.getByText(/have an account\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('should submit the register form', async () => {
    fetchMock.mockResponse(async (request) => {
      const { user } = await request.json();

      return JSON.stringify({
        user: {
          email: user.email,
          username: user.username,
          token: `{"sub":"${user.username}"}`,
          bio: null,
          image: null,
        },
      });
    });
    const history = createMemoryHistory({
      initialEntries: ['/register'],
    });
    const data = {
      username: faker.internet
        .userName()
        .replaceAll(/\W/g, '_')
        .toLowerCase()
        .substr(0, 20),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(12),
    };

    render(<Route path="/register" component={AuthScreen} />, {
      history,
    });

    user.type(screen.getByPlaceholderText('Username'), data.username);
    user.type(screen.getByPlaceholderText('Email'), data.email);
    user.type(screen.getByPlaceholderText('Password'), data.password);

    user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i })
      ).not.toBeDisabled();
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should show the validation errors', async () => {
    fetchMock.mockResponse(
      JSON.stringify({
        errors: {
          email: ['is invalid'],
          password: ['is too short (minimum is 8 characters)'],
          username: ['is too long (maximum is 20 characters)'],
        },
      }),
      { status: 422 }
    );
    const history = createMemoryHistory({
      initialEntries: ['/register'],
    });
    const data = {
      username: faker.lorem.sentences().replaceAll(/\W/g, '_').toLowerCase(),
      email: faker.internet.userName().toLowerCase(),
      password: faker.internet.password(5),
    };

    render(<Route path="/register" component={AuthScreen} />, {
      history,
    });

    user.type(screen.getByPlaceholderText('Username'), data.username);
    user.type(screen.getByPlaceholderText('Email'), data.email);
    user.type(screen.getByPlaceholderText('Password'), data.password);

    user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i })
      ).not.toBeDisabled();
    });

    expect(screen.getByRole('list')).not.toBeEmptyDOMElement();
  });
});
