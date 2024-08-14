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
  total_votes: number;
  neighborhood: string;
  ruesp_can: number;
  rcan_uesp: number;
};

export type PoliticalTypes = {
  id: number;
  name: string;
  description: string;
  election: number;
};
