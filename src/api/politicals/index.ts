import axios from "../../config/axios";
import { Political, PoliticalTypes, PoliticalVotes } from "./types";

export const getPoliticals = async (
  queryParams: Record<string, string> = {},
) => {
  const params = new URLSearchParams(queryParams);

  const url = "/political/?" + params;

  const { data }: { data: Array<Political> } = await axios.get(url);
  return data;
};

export const getPoliticalTypes = async (
  queryParams: Record<string, string> = {},
) => {
  const params = new URLSearchParams(queryParams);

  const url = "/political-type/?" + params;

  const { data }: { data: Array<PoliticalTypes> } = await axios.get(url);
  return data;
};

export const getVotes = async (
  political_id: string,
  county_id: string,
  neighborhood: boolean,
) => {
  const params = new URLSearchParams({
    county_id,
    neighborhood: neighborhood.toString(),
  });

  const url = "/political-votes/" + political_id + "?" + params;

  const { data }: { data: PoliticalVotes } = await axios.get(url);
  return data;
};

export const getStateVotes = async (
  political_id: string,
  state_id: string,
  neighborhood: boolean,
) => {
  const params = new URLSearchParams({
    state_id,
    neighborhood: neighborhood.toString(),
  });

  const url = "/political-votes/state/" + political_id + "?" + params;

  const { data }: { data: PoliticalVotes } = await axios.get(url);
  return data;
};

export const generateReport = async (
  year: number,
  political_id: number,
  queryParams: Record<string, string> = {},
) => {
  const params = new URLSearchParams(queryParams);

  const url =
    "/report/political-votes/" + year + "/" + political_id + "?" + params;

  await axios.get(url, { responseType: "blob" }).then((response) => {
    window.open(URL.createObjectURL(response.data));
  });
};
