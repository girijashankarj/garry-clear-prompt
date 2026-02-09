import { render, screen } from '@testing-library/react';
import { InfoTooltip } from '@/components/shared/InfoTooltip';

describe('InfoTooltip', () => {
  it('should render a button with "More information" label', () => {
    render(<InfoTooltip content="Help text" />);
    expect(screen.getByRole('button', { name: /more information/i })).toBeInTheDocument();
  });

  it('should render the Info icon', () => {
    const { container } = render(<InfoTooltip content="Help text" />);
    // Lucide renders an SVG element
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
