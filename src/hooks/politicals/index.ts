import { useMutation } from "@tanstack/react-query";

import {
  getPoliticals,
  getPoliticalTypes,
  getVotes,
  generateReport,
  getStateVotes,
} from "../../api/politicals";
import { County, Political, PoliticalTypes, State } from "../../api/types";
import { Election } from "../../api/year/types";

const countIsNull = (county: County) =>
  county == null || county.id == null ? "" : `${county.id}`;

const useGetPoliticals = (
  county: County,
  political_type: PoliticalTypes | null,
  election: Election,
  state: State | null,
) => {
  const queryParams: Record<string, string> = {
    county_id: countIsNull(county),
    political_type_id: political_type == null ? "" : `${political_type.id}`,
    year: election == null ? "" : `${election.year}`,
    state_id: state == null || Boolean(county?.id) ? "" : `${state.id}`,
  };

  for (const key in queryParams) {
    if (queryParams[key] === "") {
      delete queryParams[key];
    }
  }

  return useMutation({
    mutationKey: ["politicals"],
    mutationFn: () => getPoliticals(queryParams),
  });
};

const useGetVotes = (
  political: Political | null,
  county: County,
  neighborhood: boolean,
) => {
  const county_id = countIsNull(county);
  const political_id = political == null ? "" : `${political.id}`;

  return useMutation({
    mutationKey: ["politicals", "votes"],
    mutationFn: () => getVotes(political_id, county_id, neighborhood),
    initialData: [],
  });
};

const useGetStateVotes = (
  political: Political | null,
  state: State | null,
  neighborhood: boolean,
) => {
  const state_id = state == null ? "" : `${state.id}`;
  const political_id = political == null ? "" : `${political.id}`;

  return useMutation({
    mutationKey: ["politicals", "state_votes"],
    mutationFn: () => getStateVotes(political_id, state_id, neighborhood),
  });
};

const useGetPoliticalTypes = (election: Election | null) => {
  const queryParams = { election: election == null ? "" : `${election.id}` };

  return useMutation({
    mutationKey: ["politicals", "types"],
    mutationFn: () => getPoliticalTypes(queryParams),
  });
};

const useGetGenerateReport = (
  election: Election,
  political: Political | null,
  county: County,
  state: State | null,
) => {
  const queryParams: Record<string, string> = {
    county_id: countIsNull(county),
    state_id: state == null ? "" : `${state.id}`,
  };

  for (const key in queryParams) {
    if (queryParams[key] === "") {
      delete queryParams[key];
    }
  }

  return useMutation({
    mutationKey: ["politicals", "types"],
    mutationFn: () =>
      generateReport(election?.year, political?.id, queryParams),
  });
};

export {
  useGetPoliticals,
  useGetVotes,
  useGetPoliticalTypes,
  useGetGenerateReport,
  useGetStateVotes,
};
