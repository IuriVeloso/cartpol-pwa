import axios from "../../config/axios";
import { State } from "./types";

export const getStates = async () => {
  const { data }: { data: Array<State> } = await axios.get("/state");
  return data;
};
