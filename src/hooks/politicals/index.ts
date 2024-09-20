import { useMutation } from "@tanstack/react-query";

import {
  getPoliticals,
  getPoliticalTypes,
  getVotes,
} from "../../api/politicals";
import { County, Political, PoliticalTypes } from "../../api/types";
import { Election } from "../../api/time/types";

const useGetPoliticals = (
  county: County | null,
  political_type: PoliticalTypes | null,
) => {
  const queryParams = {
    county_id: county == null ? null : `${county.id}`,
    political_type: political_type == null ? "" : `${political_type.id}`,
  };

  return useMutation({
    mutationKey: ["politicals"],
    mutationFn: () => getPoliticals(queryParams),
  });
};

const useGetVotes = (political: Political | null) => {
  return useMutation({
    mutationKey: ["politicals", "votes"],
    mutationFn: () => getVotes(political == null ? "" : `${political.id}`),
    initialData: [],
  });
};

const useGetPoliticalTypes = (election: Election | null) => {
  const queryParams = { election: election == null ? "" : `${election.id}` };

  return useMutation({
    mutationKey: ["politicals", "types"],
    mutationFn: () => getPoliticalTypes(queryParams),
  });
};

export { useGetPoliticals, useGetVotes, useGetPoliticalTypes };
