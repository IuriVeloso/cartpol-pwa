import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PoliticalResults from "../index";

// Mock the hooks
jest.mock("../../../hooks", () => ({
  useGetStates: () => ({
    data: [{ id: 1, name: "Test State" }],
    isFetching: false,
  }),
  useGetCounties: () => ({
    data: [{ id: 1, name: "Test County" }],
    isPending: false,
    mutate: jest.fn(),
  }),
  useGetPoliticalTypes: () => ({
    data: [{ id: 1, name: "Test Political Type" }],
    isPending: false,
    mutate: jest.fn(),
  }),
  useGetYears: () => ({
    data: [2020],
    isFetching: false,
  }),
  useGetPoliticals: () => ({
    data: [{ id: 1, name: "Test Political" }],
    isPending: false,
    mutate: jest.fn(),
  }),
  useGetVotes: () => ({
    data: {
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
    },
    isPending: false,
    mutate: jest.fn(),
  }),
  useGetGenerateReport: () => ({
    isPending: false,
    mutate: jest.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("PoliticalResults Component", () => {
  it("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PoliticalResults />
      </QueryClientProvider>,
    );
  });

  it("renders all select components", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PoliticalResults />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Ano/i)).toBeInTheDocument();
    expect(screen.getByText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByText(/Município/i)).toBeInTheDocument();
    expect(screen.getByText(/Tipo/i)).toBeInTheDocument();
    expect(screen.getByText(/Candidato/i)).toBeInTheDocument();
  });

  it("shows loading state when fetching data", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PoliticalResults />
      </QueryClientProvider>,
    );

    // You can add more specific loading state tests here
    // This would require modifying the mock hooks to return loading states
  });
});
