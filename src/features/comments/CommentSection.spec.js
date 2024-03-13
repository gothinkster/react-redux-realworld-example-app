import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import faker from 'faker';
import { createMemoryHistory } from 'history';
import fetchMock from 'jest-fetch-mock';
import { Route } from 'react-router-dom';

import agent from '../../agent';
import { makeStore } from '../../app/store';
import { Status } from '../../common/utils';
import render from '../../test/utils';
import CommentSection from './CommentSection';

describe('<CommentSection />', () => {
  const unauthenticatedRootState = {
    articleList: {
      articlesCount: 1,
      articlesPerPage: 10,
      currentPage: 0,
      articles: [
        {
          slug: 'how-to-train-your-dragon-2',
          title: 'How to train your dragon 2',
          description: 'So toothless',
          body: 'It a dragon',
          tagList: ['dragons', 'training'],
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:48:35.824Z',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: false,
          },
        },
      ],
    },
    auth: {
      status: Status.IDLE,
    },
    comments: {
      status: Status.IDLE,
      ids: [],
      entities: {},
    },
  };
  const authenticatedRootState = {
    articleList: {
      articlesCount: 1,
      articlesPerPage: 10,
      currentPage: 0,
      articles: [
        {
          slug: 'how-to-train-your-dragon-2',
          title: 'How to train your dragon 2',
          description: 'So toothless',
          body: 'It a dragon',
          tagList: ['dragons', 'training'],
          createdAt: '2016-02-18T03:22:56.637Z',
          updatedAt: '2016-02-18T03:48:35.824Z',
          favorited: true,
          favoritesCount: 1,
          author: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://i.stack.imgur.com/xHWG8.jpg',
            following: true,
          },
        },
      ],
    },
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
    comments: {
      status: Status.IDLE,
      ids: [],
      entities: {},
    },
  };
  const commentsResponse = JSON.stringify({
    comments: [
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
        createdAt: '2018-07-28T03:13:47.736Z',
        updatedAt: '2018-07-28T03:13:47.736Z',
        body: 'Dolore explicabo veniam at quo qui vero qui voluptas.',
        author: {
          username: 'warren_boyd',
          bio: 'Asperiores quos dolorem iure et.',
          image: 'https://cdn.fakercloud.com/avatars/sprayaga_128.jpg',
          following: false,
        },
      },
    ],
  });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should render the comment section', async () => {
    fetchMock.mockResponse(commentsResponse);
    const history = createMemoryHistory({
      initialEntries: ['/article/how-to-train-your-dragon-2'],
    });
    const store = makeStore(unauthenticatedRootState);

    render(<Route path="/article/:slug" component={CommentSection} />, {
      history,
      store,
    });

    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText('Loading comments'));

    await expect(screen.findAllByTestId('comment')).resolves.not.toHaveLength(
      0
    );
  });

  it('should create a new comment', async () => {
    agent.setToken(authenticatedRootState.auth.token);
    fetchMock.mockResponses(commentsResponse, async (request) => {
      const { comment } = await request.json();

      return JSON.stringify({
        comment: {
          id: Date.now() / (24 * 36e5),
          createdAt: new Date(),
          updatedAt: new Date(),
          body: comment.body,
          author: {
            ...authenticatedRootState.auth.user,
            following: false,
            email: undefined,
          },
        },
      });
    });
    const history = createMemoryHistory({
      initialEntries: ['/article/how-to-train-your-dragon-2'],
    });
    const store = makeStore(authenticatedRootState);
    const comment = faker.lorem.sentence();

    render(<Route path="/article/:slug" component={CommentSection} />, {
      history,
      store,
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText('Loading comments'));

    await expect(screen.findAllByTestId('comment')).resolves.not.toHaveLength(
      0
    );

    user.type(screen.getByPlaceholderText('Write a comment...'), comment);
    user.click(screen.getByRole('button', { name: /post comment/i }));

    within(screen.getAllByTestId('comment')[0]).getByText(comment);
  });

  it('should show the validation errors', async () => {
    agent.setToken(authenticatedRootState.auth.token);
    fetchMock.mockResponses(commentsResponse, [
      `{
      "errors": {
        "body": ["can't be blank"]
      }
    }`,
      { status: 422 },
    ]);
    const history = createMemoryHistory({
      initialEntries: ['/article/how-to-train-your-dragon-2'],
    });
    const store = makeStore(authenticatedRootState);

    render(<Route path="/article/:slug" component={CommentSection} />, {
      history,
      store,
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText('Loading comments'));

    await expect(screen.findAllByTestId('comment')).resolves.not.toHaveLength(
      0
    );

    user.click(screen.getByRole('button', { name: /post comment/i }));

    await expect(screen.findByRole('list')).resolves.not.toBeEmptyDOMElement();
  });

  it('should remove a comment', async () => {
    agent.setToken(authenticatedRootState.auth.token);
    fetchMock.mockResponses(commentsResponse, '{}');
    const history = createMemoryHistory({
      initialEntries: ['/article/how-to-train-your-dragon-2'],
    });
    const store = makeStore(authenticatedRootState);

    render(<Route path="/article/:slug" component={CommentSection} />, {
      history,
      store,
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText('Loading comments'));

    await expect(screen.findAllByTestId('comment')).resolves.not.toHaveLength(
      0
    );
    user.click(screen.getByRole('button', { name: /delete comment/i }));

    await waitForElementToBeRemoved(
      screen.getByRole('button', { name: /delete comment/i })
    );
  });
});
