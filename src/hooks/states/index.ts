import { useQuery } from "@tanstack/react-query";

import { getStates } from "../../api/states";

const useGetStates = () =>
  useQuery({ queryKey: ["states"], queryFn: getStates, initialData: [] });

export { useGetStates };
