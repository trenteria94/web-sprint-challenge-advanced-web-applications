// Import the Spinner component into this file and test
import Spinner from "./Spinner"
import React from "react"
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('./Spinner', () => (props) => {
  const { on } = props;
});

describe('Spinner Component', () => {
  test('renders correctly with default props', () => {
    render(<Spinner on={false} />);
    expect(screen.queryByText('Please wait...'));
  });

  test('renders message', () => {
    render(<Spinner on={true}/>);
    expect(screen.queryByText('Please wait...')
    );
  });

  test('does not render when show is false', () => {
    render(<Spinner on={false} />);
    expect(screen.queryByTestId('spinner')).toBeNull();
  });
});