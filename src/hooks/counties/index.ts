import { useMutation } from "@tanstack/react-query";

import { getCounties } from "../../api/counties";
import { State } from "../../api/types";

const useGetCounties = (state: State) => {
  const queryParams = { state_id: state == null ? null : `${state.id}` };

  return useMutation({
    mutationKey: ["counties"],
    mutationFn: () => getCounties(queryParams),
  });
};

export { useGetCounties };
