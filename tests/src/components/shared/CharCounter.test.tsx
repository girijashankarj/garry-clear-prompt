import { render, screen } from '@testing-library/react';
import { CharCounter } from '@/components/shared/CharCounter';

describe('CharCounter', () => {
  it('should display current character count', () => {
    render(<CharCounter current={150} />);
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('should display max when provided', () => {
    render(<CharCounter current={150} max={2000} />);
    expect(screen.getByText(/150.*\/.*2,000/)).toBeInTheDocument();
  });

  it('should show word count when showWords and text are provided', () => {
    render(<CharCounter current={26} showWords text="hello world test text here" />);
    expect(screen.getByText(/5 words/)).toBeInTheDocument();
  });

  it('should use singular "word" for single word', () => {
    render(<CharCounter current={5} showWords text="hello" />);
    expect(screen.getByText(/1 word(?!s)/)).toBeInTheDocument();
  });

  it('should not show word count when text is empty', () => {
    render(<CharCounter current={0} showWords text="" />);
    expect(screen.queryByText(/word/)).not.toBeInTheDocument();
  });

  it('should show "chars" label', () => {
    render(<CharCounter current={50} />);
    expect(screen.getByText(/chars/)).toBeInTheDocument();
  });
});
