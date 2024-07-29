import { useMutation } from "@tanstack/react-query";

import { getPoliticals } from "../../api/politicals";

const useGetPoliticals = (county_id: string) => {
  const queryParams = { county_id };

  return useMutation({
    mutationKey: ["politicals"],
    mutationFn: () => getPoliticals(queryParams),
  });
};

export { useGetPoliticals };
