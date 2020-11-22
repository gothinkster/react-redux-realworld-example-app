import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HOCLoader from './HOCLoader';

describe('<HOCLoader />', () => {
  test('it should mount', () => {
    render(<HOCLoader />);
    
    const hocLoader = screen.getByTestId('HOCLoader');

    expect(hocLoader).toBeInTheDocument();
  });
});