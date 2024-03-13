import fetchMock from 'jest-fetch-mock';
import { Reducer, Selector, Thunk } from 'redux-testkit';

import { Status } from '../../common/utils';
import tagsReducer, { getAllTags, selectTags } from './tagsSlice';

describe('Tags reducer', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should have initial state', () => {
    expect(tagsReducer(undefined, { type: '' })).toMatchInlineSnapshot(`
      Object {
        "status": "idle",
        "tags": Array [],
      }
    `);
  });

  it('should fetch all the tags', async () => {
    fetchMock.mockResponse(`{
      "tags": [
        "react",
        "redux",
        "markdown",
        "dragons",
        "training"
      ]
    }`);
    const dispatched = await Thunk(getAllTags).execute();

    expect(dispatched).toHaveLength(2);

    Reducer(tagsReducer)
      .expect(dispatched[0].getAction())
      .toChangeInState({ status: Status.LOADING });

    Reducer(tagsReducer)
      .expect(dispatched[1].getAction())
      .toChangeInState({
        status: Status.SUCCESS,
        tags: ['react', 'redux', 'markdown', 'dragons', 'training'],
      });
  });
});

describe('Tags selectors', () => {
  it('should get the tags', () => {
    Selector(selectTags)
      .expect({
        tags: {
          status: Status.IDLE,
          tags: [],
        },
      })
      .toReturn([]);
  });
});
