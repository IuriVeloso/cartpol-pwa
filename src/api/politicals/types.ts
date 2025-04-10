export type Political = {
  id: number;
  name: string;
  full_name: string;
  region: string;
  region_id: number;
  political_code: number;
  political_party: number;
  political_type: number;
  election: number;
};

export type PoliticalVotes = {
  votes: Array<VotesNeighborhood>;
  min_ruesp_can: number;
  max_ruesp_can: number;
  min_rcan_uesp: number;
  max_rcan_uesp: number;
};

export type VotesNeighborhood = {
  total_votes: number;
  neighborhood: string;
  ruesp_can: number;
  rcan_uesp: number;
  ruesp: number;
};

export type PoliticalTypes = {
  id: number;
  name: string;
  description: string;
  election: number;
};
