import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render the button with its children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should apply additional classNames', () => {
    render(<Button className="custom-class">Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeDisabled();
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call the onClick handler when disabled and clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
