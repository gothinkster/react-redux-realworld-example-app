import fetchMock from 'jest-fetch-mock';
import { Reducer, Selector, Thunk } from 'redux-testkit';

import agent from '../../agent';
import { Status } from '../../common/utils';
import commentsReducer, {
  createComment,
  getCommentsForArticle,
  removeComment,
  selectAllComments,
  selectIsAuthor,
} from './commentsSlice';

describe('Comments reducer', () => {
  const initialRootState = {
    auth: {
      status: Status.IDLE,
    },
    comments: {
      status: Status.IDLE,
      ids: [],
      entities: {},
    },
  };
  const withUserRootState = {
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
    comments: {
      status: Status.IDLE,
      ids: [],
      entities: {},
    },
  };
  const successRootState = {
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
    comments: {
      status: Status.SUCCESS,
      ids: [1],
      entities: {
        1: {
          id: 1,
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:22:56.637Z',
          body: 'It takes a Jacobian',
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false,
          },
        },
      },
    },
  };

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    agent.setToken();
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should have initial state', () => {
    expect(commentsReducer(undefined, { type: '' })).toMatchInlineSnapshot(`
      Object {
        "entities": Object {},
        "ids": Array [],
        "status": "idle",
      }
    `);
  });

  it('should require to be authenticated to create a comment', async () => {
    const dispatched = await Thunk(createComment)
      .withState(initialRootState)
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        comment: {
          body: 'Dolore explicabo veniam at quo qui vero qui voluptas.',
        },
      });

    expect(dispatched).toHaveLength(0);
  });

  it('should create a comment', async () => {
    agent.setToken('jwt.token.here');
    fetchMock.mockResponse(async (request) => {
      expect(request.method).toBe('POST');
      expect(request.headers.has('authorization')).toBe(true);
      expect(request.headers.get('authorization')).toMatch(/Token .*/);
      await expect(request.json()).resolves.toMatchObject({
        comment: {
          body: expect.any(String),
        },
      });

      return `{
        "comment": {
          "id": 1,
          "createdAt": "${new Date().toISOString()}",
          "updatedAt": "${new Date().toISOString()}",
          "body": "Dolore explicabo veniam at quo qui vero qui voluptas.",
          "author": {
            "username": "warren_boyd",
            "bio": "Asperiores quos dolorem iure et.",
            "image": "https://cdn.fakercloud.com/avatars/sprayaga_128.jpg",
            "following": false
          }
        }
      }`;
    });
    const dispatched = await Thunk(createComment)
      .withState(withUserRootState)
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        comment: {
          body: 'Dolore explicabo veniam at quo qui vero qui voluptas.',
        },
      });

    expect(dispatched).toHaveLength(2);

    let sliceState = Reducer(commentsReducer)
      .withState(withUserRootState.comments)
      .execute(dispatched[0].getAction());

    expect(sliceState).toHaveProperty('status', Status.LOADING);
    expect(sliceState).toHaveProperty('ids', [
      dispatched[0].getAction().meta.requestId,
    ]);
    expect(sliceState).toHaveProperty(
      `entities.${dispatched[0].getAction().meta.requestId}`
    );
    expect(
      sliceState.entities[dispatched[0].getAction().meta.requestId]
    ).toMatchObject({
      id: expect.any(String),
      body: 'Dolore explicabo veniam at quo qui vero qui voluptas.',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      author: {
        bio: 'Asperiores quos dolorem iure et.',
        email: 'warren.boyd@mailinator.com',
        image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
        username: 'warren_boyd',
      },
    });

    sliceState = Reducer(commentsReducer)
      .withState(sliceState)
      .execute(dispatched[1].getAction());

    expect(sliceState).toHaveProperty('status', Status.SUCCESS);
    expect(sliceState).toHaveProperty('ids', [1]);
    expect(sliceState).toHaveProperty('entities', {
      1: {
        id: expect.any(Number),
        body: 'Dolore explicabo veniam at quo qui vero qui voluptas.',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        author: {
          username: 'warren_boyd',
          bio: 'Asperiores quos dolorem iure et.',
          image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
          following: false,
        },
      },
    });
  });

  it('should only send one create comment request at once', async () => {
    const dispatched = await Thunk(createComment)
      .withState({
        ...withUserRootState,
        comments: {
          ...withUserRootState.comments,
          status: Status.LOADING,
        },
      })
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        comment: {
          body: 'Dolore explicabo veniam at quo qui vero qui voluptas.',
        },
      });

    expect(dispatched).toHaveLength(0);
  });

  it('should handle the create errors', async () => {
    fetchMock.mockResponse(
      `{
        "errors": {
          "body": ["can't be blank"]
        }
      }`,
      { status: 422 }
    );
    const dispatched = await Thunk(createComment)
      .withState(withUserRootState)
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        comment: { body: '' },
      });

    expect(dispatched).toHaveLength(2);

    Reducer(commentsReducer)
      .withState(withUserRootState.comments)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(commentsReducer)
      .withState({
        ...withUserRootState.comments,
        status: Status.LOADING,
      })
      .expect(dispatched[1].getAction())
      .toReturnState({
        status: Status.FAILURE,
        ids: [],
        entities: {},
        errors: {
          body: ["can't be blank"],
        },
      });
  });

  it('should get all comments for an article', async () => {
    fetchMock.mockResponse(`{
      "comments": [
        {
          "id": 1,
          "createdAt": "2016-02-18T03:22:56.637Z",
          "updatedAt": "2016-02-18T03:22:56.637Z",
          "body": "It takes a Jacobian",
          "author": {
            "username": "jake",
            "bio": "I work at statefarm",
            "image": "https://i.stack.imgur.com/xHWG8.jpg",
            "following": false
          }
        }
      ]
    }`);
    const dispatched = await Thunk(getCommentsForArticle)
      .withState(withUserRootState)
      .execute('how-to-train-your-dragon');

    expect(dispatched).toHaveLength(2);

    Reducer(commentsReducer)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(commentsReducer)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.SUCCESS,
        ids: [1],
        entities: {
          1: {
            id: 1,
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: '2016-02-18T03:22:56.637Z',
            body: 'It takes a Jacobian',
            author: {
              username: 'jake',
              bio: 'I work at statefarm',
              image: 'https://i.stack.imgur.com/xHWG8.jpg',
              following: false,
            },
          },
        },
      });
  });

  it('should only send one get all comments request at once', async () => {
    const dispatched = await Thunk(getCommentsForArticle)
      .withState({
        ...withUserRootState,
        comments: {
          ...withUserRootState.comments,
          status: Status.LOADING,
        },
      })
      .execute('how-to-train-your-dragon');

    expect(dispatched).toHaveLength(0);
  });

  it('should require to be authenticated to remove a comment', async () => {
    const dispatched = await Thunk(removeComment)
      .withState(initialRootState)
      .execute(1);

    expect(dispatched).toHaveLength(0);
  });

  it('should remove a comment', async () => {
    agent.setToken('jwt.token.here');
    fetchMock.mockResponse(async (request) => {
      expect(request.method).toBe('DELETE');
      expect(request.headers.has('authorization')).toBe(true);
      expect(request.headers.get('authorization')).toMatch(/Token .*/);

      return '{}';
    });
    const dispatched = await Thunk(removeComment)
      .withState(successRootState)
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        commentId: 1,
      });

    expect(dispatched).toHaveLength(2);

    Reducer(commentsReducer)
      .withState(successRootState.comments)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(commentsReducer)
      .withState({ ...successRootState.comments, status: Status.LOADING })
      .expect(dispatched[1].getAction())
      .toReturnState({
        status: Status.SUCCESS,
        ids: [],
        entities: {},
      });
  });

  it('should only send one remove comment request at once', async () => {
    const dispatched = await Thunk(removeComment)
      .withState({
        ...withUserRootState,
        comments: {
          ...withUserRootState.comments,
          status: Status.LOADING,
        },
      })
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        commentId: 1,
      });

    expect(dispatched).toHaveLength(0);
  });

  it('should only send remove comment request when the comment exists in state', async () => {
    const dispatched = await Thunk(removeComment)
      .withState(successRootState)
      .execute({
        articleSlug: 'how-to-train-your-dragon',
        commentId: 2,
      });

    expect(dispatched).toHaveLength(0);
  });
});

describe('Comments selector', () => {
  const successRootState = {
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
    comments: {
      status: Status.SUCCESS,
      ids: [1, 2],
      entities: {
        1: {
          id: 1,
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:22:56.637Z',
          body: 'It takes a Jacobian',
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false,
          },
        },
        2: {
          id: 2,
          createdAt: '2016-02-18T04:22:56.637Z',
          updatedAt: '2016-02-18T04:22:56.637Z',
          body: 'Dolore explicabo veniam at quo qui vero qui voluptas. Aperiam nisi dicta. Minima in rem.',
          author: {
            username: 'warren_boyd',
            bio: 'Asperiores quos dolorem iure et.',
            image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
            following: false,
          },
        },
      },
    },
  };

  it("should get if is the comment's author", () => {
    Selector(selectIsAuthor(1)).expect(successRootState).toReturn(false);

    Selector(selectIsAuthor(2)).expect(successRootState).toReturn(true);
  });

  it('should get all the comments', () => {
    Selector(selectAllComments)
      .expect(successRootState)
      .toReturn([
        {
          id: 1,
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:22:56.637Z',
          body: 'It takes a Jacobian',
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false,
          },
        },
        {
          id: 2,
          createdAt: '2016-02-18T04:22:56.637Z',
          updatedAt: '2016-02-18T04:22:56.637Z',
          body: 'Dolore explicabo veniam at quo qui vero qui voluptas. Aperiam nisi dicta. Minima in rem.',
          author: {
            username: 'warren_boyd',
            bio: 'Asperiores quos dolorem iure et.',
            image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
            following: false,
          },
        },
      ]);
  });
});
