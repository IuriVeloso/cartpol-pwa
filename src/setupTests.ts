import "@testing-library/jest-dom";

// Mock Leaflet since it requires browser environment
jest.mock("leaflet", () => ({
  geoJson: () => ({
    "addTo": jest.fn().mockReturnThis()
  }),
  control: {
    attribution: jest.fn().mockReturnThis(),
    addTo: jest.fn(),
  },
  map: jest.fn(),
}));

// Mock shpjs since it requires browser environment
jest.mock("shpjs", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    type: "FeatureCollection",
    features: [],
  }),
}));

// Mock react-leaflet
jest.mock("react-leaflet", () => {
  return {
    MapContainer: function MockMapContainer({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return children;
    },
    TileLayer: () => null,
    useMap: () => null,
  };
});
