import { render, screen } from '@testing-library/react';
import { ExportButtons } from '@/components/shared/ExportButtons';
import { createMockEngineResult } from '../../../mock';

describe('ExportButtons', () => {
  it('should render copy and download buttons', () => {
    const result = createMockEngineResult();
    render(<ExportButtons result={result} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('should include a Copy Prompt button', () => {
    const result = createMockEngineResult();
    render(<ExportButtons result={result} />);
    expect(screen.getByText(/Copy Prompt/i)).toBeInTheDocument();
  });

  it('should include a Copy Meta button when meta prompt exists', () => {
    const result = createMockEngineResult({ metaPrompt: 'You are an expert' });
    render(<ExportButtons result={result} />);
    expect(screen.getByText(/Copy Meta/i)).toBeInTheDocument();
  });
});
