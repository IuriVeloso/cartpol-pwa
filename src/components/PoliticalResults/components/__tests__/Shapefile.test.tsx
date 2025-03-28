import React from "react";
import { render } from "@testing-library/react";
import Shapefile from "../Shapefile";
import { MapContainer } from "react-leaflet";

// Mock the useLeafletContext hook
jest.mock("@react-leaflet/core", () => {
  return {
    useLeafletContext: () => {
      console.log("useLeafletContext called");
      return {
        map: {
          addTo: jest.fn().mockReturnThis(),
          fitBounds: jest.fn(),
        },
      };
    },
  };
});

describe("Shapefile Component", () => {
  const mockPoliticalData = {
    votes_by_neighborhood: [
      {
        neighborhood: "Test Neighborhood",
        total_votes: 100,
        ruesp_can: 0.5,
        rcan_uesp: 0.6,
        ruesp: 0.7,
      },
    ],
    min_ruesp_can: 0,
    max_ruesp_can: 1,
    min_rcan_uesp: 0,
    max_rcan_uesp: 1,
  };

  const mockSetVotesInfo = jest.fn();

  beforeEach(() => {
    console.log("Test setup");
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <MapContainer center={[0, 0]} zoom={13}>
        <Shapefile
          zipUrl="test.zip"
          politicalData={mockPoliticalData}
          setVotesInfo={mockSetVotesInfo}
        />
      </MapContainer>,
    );
    console.log("Render test completed");
  });

  it("calls setVotesInfo with initial data", () => {
    render(
      <MapContainer center={[0, 0]} zoom={13}>
        <Shapefile
          zipUrl="test.zip"
          politicalData={mockPoliticalData}
          setVotesInfo={mockSetVotesInfo}
        />
      </MapContainer>,
    );

    expect(mockSetVotesInfo).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          neighborhood: "Test Neighborhood",
          foundMap: false,
        }),
      ]),
    );
  });
});
