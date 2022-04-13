import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import render from '../../test/utils';
import TagsSidebar from './TagsSidebar';

describe('<TagsSidebar />', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should render the list of tags', async () => {
    fetchMock.mockResponse(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              JSON.stringify({
                tags: ['react', 'redux', 'markdown', 'dragons', 'training'],
              })
            );
          }, Math.random() * 500);
        })
    );

    render(<TagsSidebar />);

    screen.getByText(/popular tags/i);

    await waitForElementToBeRemoved(screen.getByText(/loading tags/i));

    expect(screen.getAllByRole('button')).not.toHaveLength(0);
  });
});
