import { render, screen } from '@testing-library/react';
import { ScoreBadge } from '@/components/shared/ScoreBadge';

describe('ScoreBadge', () => {
  it('should render a meter element', () => {
    render(<ScoreBadge score={75} band="good" />);
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });

  it('should set aria-valuenow to the score', () => {
    render(<ScoreBadge score={85} band="good" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '85');
  });

  it('should set aria-valuemin to 0 and aria-valuemax to 100', () => {
    render(<ScoreBadge score={50} band="average" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('should include the band in aria-label', () => {
    render(<ScoreBadge score={50} band="average" />);
    const meter = screen.getByRole('meter');
    expect(meter.getAttribute('aria-label')).toContain('Average');
  });

  it('should render with sm size by default', () => {
    const { container } = render(<ScoreBadge score={70} band="average" />);
    // Check that an SVG is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should render with lg size', () => {
    const { container } = render(<ScoreBadge score={90} band="excellent" size="lg" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should display the band label', () => {
    render(<ScoreBadge score={42} band="weak" />);
    // The band label should be displayed (score animates from 0)
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });
});
