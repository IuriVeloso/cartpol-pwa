import { useMutation } from "@tanstack/react-query";

import { getCounties } from "../../api/counties";

const useGetCounties = (state_id: string) => {
  const queryParams = { state_id };

  return useMutation({
    mutationKey: ["counties"],
    mutationFn: () => getCounties(queryParams),
  });
};

export { useGetCounties };
