import { useMutation } from "@tanstack/react-query";

import {
  getPoliticals,
  getPoliticalTypes,
  getVotes,
  generateReport
} from "../../api/politicals";
import { County, Political, PoliticalTypes } from "../../api/types";
import { Election } from "../../api/time/types";

const useGetPoliticals = (
  county: County | null,
  political_type: PoliticalTypes | null,
  election: Election | null,
) => {
  const queryParams = {
    county_id: county == null ? null : `${county.id}`,
    political_type: political_type == null ? "" : `${political_type.id}`,
    year: election == null ? "" : `${election.year}`,
  };

  return useMutation({
    mutationKey: ["politicals"],
    mutationFn: () => getPoliticals(queryParams),
  });
};

const useGetVotes = (political: Political | null, county: County | null,) => {
  const county_id = county == null ? null : `${county.id}`;
  const political_id = political == null ? "" : `${political.id}`

  return useMutation({
    mutationKey: ["politicals", "votes"],
    mutationFn: () => getVotes(political_id, county_id),
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

const useGetGenerateReport = (election: Election | null, political: Political | null) => {

  
  return useMutation({
    mutationKey: ["politicals", "types"],
    mutationFn: () => generateReport(election?.year, political?.id),
  });
};

export { useGetPoliticals, useGetVotes, useGetPoliticalTypes, useGetGenerateReport };
