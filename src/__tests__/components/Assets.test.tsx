
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockAsset } from '@/utils/testUtils';
import Assets from '@/pages/Assets';
import { dataService } from '@/services/dataService';

// Mock the data service
jest.mock('@/services/dataService', () => ({
  dataService: {
    getRegions: jest.fn(),
    getSiteAssets: jest.fn(),
  },
}));

const mockDataService = dataService as jest.Mocked<typeof dataService>;

describe('Assets Page', () => {
  const mockRegions = [
    {
      id: 'region-1',
      name: 'Test Region',
      sites: [
        {
          id: 'site-1',
          name: 'Test Site',
          location: 'Test Location',
          region: 'region-1',
          status: 'online' as const,
          totalCapacity: 1000,
          currentOutput: 800,
          efficiency: 95,
          lastUpdate: '2 min ago',
        },
      ],
    },
  ];

  const mockAssets = [
    mockAsset(),
    mockAsset({
      id: 'asset-2',
      name: 'Test Battery',
      type: 'battery',
      status: 'charging',
    }),
  ];

  beforeEach(() => {
    mockDataService.getRegions.mockResolvedValue(mockRegions);
    mockDataService.getSiteAssets.mockResolvedValue(mockAssets);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders assets page with title', async () => {
    render(<Assets />);
    
    expect(screen.getByText('Asset Management')).toBeInTheDocument();
    expect(screen.getByText('Monitor and control your renewable energy assets')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<Assets />);
    
    expect(screen.getByText('Loading assets...')).toBeInTheDocument();
  });

  it('displays assets after loading', async () => {
    render(<Assets />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Asset')).toBeInTheDocument();
      expect(screen.getByText('Test Battery')).toBeInTheDocument();
    });
  });

  it('filters assets by search term', async () => {
    const user = userEvent.setup();
    render(<Assets />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Asset')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search assets, sites, or types...');
    await user.type(searchInput, 'Battery');

    expect(screen.getByText('Test Battery')).toBeInTheDocument();
    expect(screen.queryByText('Test Asset')).not.toBeInTheDocument();
  });

  it('shows no results message when no assets match search', async () => {
    const user = userEvent.setup();
    render(<Assets />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Asset')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search assets, sites, or types...');
    await user.type(searchInput, 'Nonexistent');

    expect(screen.getByText('No assets found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });
});
