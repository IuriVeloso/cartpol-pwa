import axios from "../../config/axios";
import { Political } from "./types";

export const getPoliticals = async (
  queryParams: Record<string, string> = {},
) => {
  const params = new URLSearchParams(queryParams);

  const url = "/political/?" + params;

  const { data }: { data: Array<Political> } = await axios.get(url);
  return data;
};
