import axios from "../../config/axios";
import { Election } from "./types.ts";

export const getYears = async () => {
  const { data }: { data: Array<Election> } = await axios.get("/election/");
  return data;
};
