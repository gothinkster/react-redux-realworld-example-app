import fetchMock from 'jest-fetch-mock';
import { Reducer, Selector, Thunk } from 'redux-testkit';

import agent from '../../agent';
import { Status } from '../../common/utils';
import authReducer, {
  getUser,
  login,
  logout,
  register,
  selectIsAuthenticated,
  updateUser,
} from './authSlice';

describe('Auth reducer', () => {
  const initialRootState = {
    /**
     * @type {import('./authSlice').AuthState}
     */
    auth: {
      status: Status.IDLE,
    },
  };
  const successRootState = {
    /**
     * @type {import('./authSlice').AuthState}
     */
    auth: {
      status: Status.SUCCESS,
      token: 'jwt.token.here',
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
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should have initial state', async () => {
    expect(authReducer(undefined, { type: '' })).toMatchInlineSnapshot(`
      Object {
        "status": "idle",
      }
    `);
  });

  it('should register a new user', async () => {
    fetchMock.mockResponse(async (request) => {
      await expect(request.json()).resolves.toMatchObject({
        user: {
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
        },
      });

      return `{
        "user": {
          "email": "warren.boyd@mailinator.com",
          "username": "warren_boyd",
          "token": "jwt.token.here",
          "bio": "Asperiores quos dolorem iure et.",
          "image": "https://cdn.fakercloud.com/avatars/sprayaga_128.jpg"
        }
      }`;
    });
    const dispatched = await Thunk(register)
      .withState(initialRootState)
      .execute({
        username: 'warren_boyd',
        email: 'warren.boyd@mailinator.com',
        password: 'Pa$$w0rd!',
      });

    expect(dispatched).toHaveLength(2);

    Reducer(authReducer)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(authReducer)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.SUCCESS,
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          username: expect.any(String),
          bio: expect.any(String),
          image: expect.any(String),
        }),
      });
  });

  it('should only send one register request at once', async () => {
    const dispatched = await Thunk(register)
      .withState({ auth: { status: Status.LOADING } })
      .execute({
        username: 'warren_boyd',
        email: 'warren.boyd@mailinator.com',
        password: 'Pa$$w0rd!',
      });

    expect(dispatched).toHaveLength(0);
  });

  it('should handle the register errors', async () => {
    fetchMock.mockResponse(
      `{
        "errors": {
          "email": [
            "can't be blank"
          ],
          "password": [
            "can't be blank"
          ],
          "username": [
            "can't be blank",
            "is too short (minimum is 1 character)"
          ]
        }
      }`,
      { status: 422 }
    );
    const dispatched = await Thunk(register)
      .withState(initialRootState)
      .execute({
        username: '',
        email: '',
        password: '',
      });

    expect(dispatched).toHaveLength(2);

    const state = Reducer(authReducer)
      .withState(initialRootState.auth)
      .execute(dispatched[0].getAction());

    Reducer(authReducer)
      .withState(state)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.FAILURE,
        errors: {
          email: ["can't be blank"],
          password: ["can't be blank"],
          username: ["can't be blank", 'is too short (minimum is 1 character)'],
        },
      });
  });

  it('should login with an existing user', async () => {
    fetchMock.mockResponse(async (request) => {
      await expect(request.json()).resolves.toMatchObject({
        user: {
          email: expect.any(String),
          password: expect.any(String),
        },
      });

      return `{
        "user": {
          "email": "warren.boyd@mailinator.com",
          "username": "warren_boyd",
          "token": "jwt.token.here",
          "bio": "Asperiores quos dolorem iure et.",
          "image": "https://cdn.fakercloud.com/avatars/sprayaga_128.jpg"
        }
      }`;
    });
    const dispatched = await Thunk(login).withState(initialRootState).execute({
      email: 'warren.boyd@mailinator.com',
      password: 'Pa$$w0rd!',
    });

    expect(dispatched).toHaveLength(2);

    Reducer(authReducer)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(authReducer)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.SUCCESS,
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          username: expect.any(String),
          bio: expect.any(String),
          image: expect.any(String),
        }),
      });
  });

  it('should only send one login request at once', async () => {
    const dispatched = await Thunk(login)
      .withState({ auth: { status: Status.LOADING } })
      .execute({
        email: 'warren.boyd@mailinator.com',
        password: 'Pa$$w0rd!',
      });

    expect(dispatched).toHaveLength(0);
  });

  it('should handle the login errors', async () => {
    fetchMock.mockResponse(
      `{
        "errors": {
          "email or password": ["is invalid"]
        }
      }`,
      { status: 422 }
    );
    const dispatched = await Thunk(login).withState(initialRootState).execute({
      email: 'warren.boyd@mailinator.com',
      password: 'password',
    });

    expect(dispatched).toHaveLength(2);

    const state = Reducer(authReducer)
      .withState(initialRootState.auth)
      .execute(dispatched[0].getAction());

    Reducer(authReducer)
      .withState(state)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.FAILURE,
        errors: {
          'email or password': ['is invalid'],
        },
      });
  });

  it('should get the current user', async () => {
    agent.setToken('jwt.token.here');
    fetchMock.mockResponse(async (request) => {
      expect(request.headers.has('authorization')).toBe(true);
      expect(request.headers.get('authorization')).toMatch(/Token .*/);

      return `{
        "user": {
          "email": "warren.boyd@mailinator.com",
          "username": "warren_boyd",
          "token": "jwt.token.2",
          "bio": "Asperiores quos dolorem iure et.",
          "image": "https://cdn.fakercloud.com/avatars/sprayaga_128.jpg"
        }
      }`;
    });
    const dispatched = await Thunk(getUser)
      .withState({
        auth: {
          status: Status.SUCCESS,
          token: 'jwt.token.here',
        },
      })
      .execute();

    expect(dispatched).toHaveLength(2);

    Reducer(authReducer)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(authReducer)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.SUCCESS,
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          username: expect.any(String),
          bio: expect.any(String),
          image: expect.any(String),
        }),
      });
  });

  it('should require the token to get current user', async () => {
    const dispatched = await Thunk(getUser)
      .withState(initialRootState)
      .execute();

    expect(dispatched).toHaveLength(0);
  });

  it('should update the current user', async () => {
    agent.setToken('jwt.token.here');
    fetchMock.mockResponse(async (request) => {
      expect(request.headers.has('authorization')).toBe(true);
      expect(request.headers.get('authorization')).toMatch(/Token .*/);
      expect(request.method).toBe('PUT');

      await expect(request.json()).resolves.toMatchObject({
        user: {
          username: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          bio: expect.any(String),
          image: expect.any(String),
        },
      });

      return `{
        "user": {
          "email": "brittany77@mailinator.com",
          "username": "brittany_lang",
          "token": "json.web.token",
          "bio": "You can't connect the sensor without bypassing the cross-platform HTTP array!",
          "image": "https://cdn.fakercloud.com/avatars/yehudab_128.jpg"
        }
      }`;
    });
    const dispatched = await Thunk(updateUser)
      .withState(successRootState)
      .execute({
        email: 'brittany77@mailinator.com',
        username: 'brittany_lang',
        password: 'aR4LSPOnzSoQGHE',
        bio: "You can't connect the sensor without bypassing the cross-platform HTTP array!",
        image: 'https://cdn.fakercloud.com/avatars/yehudab_128.jpg',
      });

    expect(dispatched).toHaveLength(2);

    const state = Reducer(authReducer)
      .withState(successRootState.auth)
      .execute(dispatched[0].getAction());

    expect(state).toHaveProperty('status', Status.LOADING);

    Reducer(authReducer)
      .withState({ ...successRootState.auth, status: Status.LOADING })
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.SUCCESS,
        token: 'json.web.token',
        user: {
          email: 'brittany77@mailinator.com',
          username: 'brittany_lang',
          bio: "You can't connect the sensor without bypassing the cross-platform HTTP array!",
          image: 'https://cdn.fakercloud.com/avatars/yehudab_128.jpg',
        },
      });
  });

  it('should handle the update user errors', async () => {
    agent.setToken('jwt.token.here');
    fetchMock.mockResponse(
      `{
        "errors": {
          "password": ["is too short (minimum is 8 characters)"]
        }
      }`,
      { status: 422 }
    );
    const dispatched = await Thunk(updateUser)
      .withState(successRootState)
      .execute({ password: 'pasword' });

    expect(dispatched).toHaveLength(2);

    const state = Reducer(authReducer)
      .withState(initialRootState.auth)
      .execute(dispatched[0].getAction());

    Reducer(authReducer)
      .withState(state)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.FAILURE,
        errors: {
          password: ['is too short (minimum is 8 characters)'],
        },
      });
  });

  it('should logout the current user', async () => {
    Reducer(authReducer)
      .withState(successRootState.auth)
      .expect(logout)
      .toReturnState({ status: Status.IDLE });
  });
});

describe('Auth selectors', () => {
  it('should get if is authenticated', () => {
    Selector(selectIsAuthenticated)
      .expect({
        auth: {
          status: Status.SUCCESS,
          token: 'jwt.token.here',
          user: {
            email: 'warren.boyd@mailinator.com',
            username: 'warren_boyd',
            bio: 'Asperiores quos dolorem iure et.',
            image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
          },
        },
      })
      .toReturn(true);

    Selector(selectIsAuthenticated)
      .expect({
        auth: {
          status: Status.FAILURE,
          token: 'jwt.token.here',
          errors: {
            'email or password': ['is invalid'],
          },
        },
      })
      .toReturn(false);

    Selector(selectIsAuthenticated)
      .expect({
        auth: {
          status: Status.SUCCESS,
          user: {
            email: 'warren.boyd@mailinator.com',
            username: 'warren_boyd',
            bio: 'Asperiores quos dolorem iure et.',
            image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
          },
        },
      })
      .toReturn(false);

    Selector(selectIsAuthenticated)
      .expect({
        auth: {
          status: Status.IDLE,
        },
      })
      .toReturn(false);
  });
});
