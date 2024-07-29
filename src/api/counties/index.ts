import axios from "../../config/axios";
import { County } from "./types";

export const getCounties = async (queryParams: Record<string, string> = {}) => {
  const params = new URLSearchParams(queryParams);

  const url = "/county?" + params;

  const { data }: { data: Array<County> } = await axios.get(url);
  return data;
};
