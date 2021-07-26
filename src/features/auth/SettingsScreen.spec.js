import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import faker from 'faker';
import fetchMock from 'jest-fetch-mock';
import { createMemoryHistory } from 'history';

import agent from '../../agent';
import { makeStore } from '../../app/store';
import { Status } from '../../common/utils';
import render from '../../test/utils';
import SettingsScreen from './SettingsScreen';

describe('<SettingsScreen />', () => {
  const successRootState = {
    /**
     * @type {import('./authSlice').AuthState}
     */
    auth: {
      status: Status.SUCCESS,
      token: '{"sub":"warren_boyd"}',
      user: {
        email: 'warren.boyd@mailinator.com',
        username: 'warren_boyd',
        bio: 'Asperiores quos dolorem iure et.',
        image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
      },
    },
  };

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    agent.setToken('{"sub":"warren_boyd"}');
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should render the settings form', async () => {
    const history = createMemoryHistory({ initialEntries: ['/settings'] });
    const store = makeStore(successRootState);

    render(<SettingsScreen />, { history, store });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    screen.getByRole('button', { name: 'Update Settings' });
    screen.getByRole('button', { name: 'Or click here to logout.' });
  });

  it('should submit the settings form', async () => {
    fetchMock.mockResponse(async (request) => {
      const { user } = await request.json();

      return JSON.stringify({
        user: {
          ...user,
          token: `{"sub":"${user.username}"}`,
          password: undefined,
        },
      });
    });
    const history = createMemoryHistory({ initialEntries: ['/settings'] });
    const store = makeStore(successRootState);
    const data = {
      image: faker.internet.avatar(),
      username: faker.internet.userName().replaceAll(/\W/g, '_').toLowerCase(),
      bio: faker.hacker.phrase(),
      email: faker.internet.exampleEmail().toLowerCase(),
      password: faker.internet.password(9, true),
    };

    render(<SettingsScreen />, { history, store });

    user.type(
      screen.getByPlaceholderText('URL of profile picture'),
      data.image
    );
    user.type(screen.getByPlaceholderText('Username'), data.username);
    user.type(screen.getByPlaceholderText('Short bio about you'), data.bio);
    user.type(screen.getByPlaceholderText('Email'), data.email);
    user.type(screen.getByPlaceholderText('New Password'), data.password);

    user.click(screen.getByRole('button', { name: /update settings/i }));

    expect(
      screen.getByRole('button', { name: /update settings/i })
    ).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /update settings/i })
      ).not.toBeDisabled();
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should show the validation errors', async () => {
    fetchMock.mockResponse(
      `{
        "errors": {
          "password": ["is too short (minimum is 8 characters)"]
        }
      }`,
      { status: 422 }
    );
    const history = createMemoryHistory({ initialEntries: ['/settings'] });
    const store = makeStore(successRootState);

    render(<SettingsScreen />, { history, store });

    user.type(
      screen.getByPlaceholderText('New Password'),
      faker.internet.password(6, true)
    );

    user.click(screen.getByRole('button', { name: /update settings/i }));

    expect(
      screen.getByRole('button', { name: /update settings/i })
    ).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /update settings/i })
      ).not.toBeDisabled();
    });

    expect(screen.getByRole('list')).not.toBeEmptyDOMElement();
  });

  it('should close the session and redirect', async () => {
    const history = createMemoryHistory({ initialEntries: ['/settings'] });
    const store = makeStore(successRootState);

    render(<SettingsScreen />, { history, store });

    user.click(
      screen.getByRole('button', { name: 'Or click here to logout.' })
    );

    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
    });
  });

  it('should redirect if is not authenticated', async () => {
    const history = createMemoryHistory({ initialEntries: ['/settings'] });

    render(<SettingsScreen />, { history });

    expect(
      screen.queryByRole('heading', { name: 'Your Settings' })
    ).not.toBeInTheDocument();

    expect(history.location.pathname).toBe('/');
  });
});
