import { useFetchQuery } from "~/lib/hooks/useFetchQuery";

export function useActionHistory(actionId: number | null) {
  return useFetchQuery(
    "/api/actions/{id}/history",
    "get",
    {
      path: { id: String(actionId) },
    },
    undefined,
    actionId !== null,
  );
}
