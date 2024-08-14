import { useQuery } from "@tanstack/react-query";

import { getYears } from "../../api/time";

const useGetYears = () =>
  useQuery({ queryKey: ["years"], queryFn: getYears, initialData: [] });

export { useGetYears };
