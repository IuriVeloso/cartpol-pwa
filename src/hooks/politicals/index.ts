import { useMutation } from "@tanstack/react-query";

import {
  getPoliticals,
  getPoliticalTypes,
  getVotes,
} from "../../api/politicals";

const useGetPoliticals = (county_id: string, political_type) => {
  const queryParams = { county_id, political_type };

  return useMutation({
    mutationKey: ["politicals"],
    mutationFn: () => getPoliticals(queryParams),
  });
};

const useGetVotes = (political_id: string) => {
  return useMutation({
    mutationKey: ["politicals", "votes"],
    mutationFn: () => getVotes(political_id),
  });
};

const useGetPoliticalTypes = (election_id: string) => {
  const queryParams = { election: election_id };

  return useMutation({
    mutationKey: ["politicals", "types"],
    mutationFn: () => getPoliticalTypes(queryParams),
  });
};

export { useGetPoliticals, useGetVotes, useGetPoliticalTypes };
