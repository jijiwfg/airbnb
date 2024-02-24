// Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // 导入 Jest 的扩展

import Button from './components/loginButton';
import TextInput from './components/textInput';
import Counter from './components/counter';
describe('Button Component Test', () => {
  it('renders button component with provided label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when button is clicked', () => {
    const onClickMock = jest.fn();
    render(<Button label="Click me" onClick={onClickMock} />);

    fireEvent.click(screen.getByTestId('custom-button'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});

test('renders TextInput component', () => {
  const { getByPlaceholderText } = render(<TextInput value="" onChange={() => { }} />);
  const inputElement = getByPlaceholderText(/inputText/i);
  expect(inputElement).toBeInTheDocument();
});

test('calls onChange prop when input value changes', () => {
  const mockOnChange = jest.fn();
  const { getByRole } = render(<TextInput value="" onChange={mockOnChange} />);
  const inputElement = getByRole('textbox'); // 或者 getByRole('textbox', { name: '' })，取决于你的需求

  fireEvent.change(inputElement, { target: { value: 'new value' } });

  expect(mockOnChange).toHaveBeenCalledWith('new value');
});

test('renders Counter component with initial count of 0', () => {
  const { getByText } = render(<Counter />);
  const countElement = getByText(/Count: 0/i);
  expect(countElement).toBeInTheDocument();
});

test('increments count when the increment button is clicked', () => {
  const { getByText } = render(<Counter />);
  const incrementButton = getByText(/Increment/i);
  const countElement = getByText(/Count: 0/i);

  fireEvent.click(incrementButton);

  expect(countElement).toHaveTextContent('Count: 1');
});

test('decrements count when the decrement button is clicked', () => {
  const { getByText } = render(<Counter />);
  const decrementButton = getByText(/Decrement/i);
  const countElement = getByText(/Count: 0/i);

  fireEvent.click(decrementButton);

  expect(countElement).toHaveTextContent('Count: -1');
});
