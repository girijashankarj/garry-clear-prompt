import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '@/components/shared/ModeToggle';

describe('ModeToggle', () => {
  it('should render a tablist', () => {
    render(<ModeToggle mode="basic" onModeChange={jest.fn()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('should render Basic and Advanced tabs', () => {
    render(<ModeToggle mode="basic" onModeChange={jest.fn()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
  });

  it('should mark Basic as selected when mode is basic', () => {
    render(<ModeToggle mode="basic" onModeChange={jest.fn()} />);
    const tabs = screen.getAllByRole('tab');
    const basicTab = tabs.find(t => t.textContent?.includes('Basic'));
    expect(basicTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should mark Advanced as selected when mode is advanced', () => {
    render(<ModeToggle mode="advanced" onModeChange={jest.fn()} />);
    const tabs = screen.getAllByRole('tab');
    const advancedTab = tabs.find(t => t.textContent?.includes('Advanced'));
    expect(advancedTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should call onModeChange when clicking a tab', () => {
    const onModeChange = jest.fn();
    render(<ModeToggle mode="basic" onModeChange={onModeChange} />);
    const tabs = screen.getAllByRole('tab');
    const advancedTab = tabs.find(t => t.textContent?.includes('Advanced'));
    fireEvent.click(advancedTab!);
    expect(onModeChange).toHaveBeenCalledWith('advanced');
  });
});
