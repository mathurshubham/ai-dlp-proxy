import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
    })
) as jest.Mock;

describe('Smoke Test', () => {
    it('renders the main dashboard page and shows the title', async () => {
        render(<Page />);

        // Check for "Sentinel AI" in the header
        const titleElements = screen.getAllByText(/Sentinel AI/i);
        expect(titleElements.length).toBeGreaterThan(0);

        // Additional check for "Privacy Proxy"
        expect(screen.getByText(/Privacy Proxy/i)).toBeInTheDocument();
    });
});
