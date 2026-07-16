import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the API module
vi.mock('../utils/api', () => ({
  fetchWeather: vi.fn(),
}));

const { fetchWeather } = await import('../utils/api');

describe('Weather App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Enter city/i)).toBeInTheDocument();
  });

  it('shows error when city is not found', async () => {
    // Mock a failed API call
    (fetchWeather as any).mockRejectedValueOnce(new Error('City not found'));

    render(<App />);
    const input = screen.getByPlaceholderText(/Enter city/i);
    const button = screen.getByText(/Search/i);

    fireEvent.change(input, { target: { value: 'FakeCity123' } });
    fireEvent.click(button);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('City not found')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching', async () => {
    // Mock a pending promise
    const mockPromise = new Promise(() => {}); // Never resolves
    (fetchWeather as any).mockReturnValueOnce(mockPromise);

    render(<App />);
    const input = screen.getByPlaceholderText(/Enter city/i);
    const button = screen.getByText(/Search/i);

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    // Check button text changes to "..."
    expect(screen.getByText('...')).toBeInTheDocument();
    
    // Clean up: cancel the promise (optional in this simple test, but good practice)
    // In a real test, we would resolve the promise eventually.
  });
});