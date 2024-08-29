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

export const getVotes = async (political_id: string) => {
  const url = "/political-votes/" + political_id;

  const { data }: { data: PoliticalVotes } = await axios.get(url);
  return data;
};
