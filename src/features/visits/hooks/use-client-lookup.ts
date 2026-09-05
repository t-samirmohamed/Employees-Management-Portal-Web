import { useClients } from "@features/clients/hooks/use-clients";

export function useClientLookup() {
  const { data: clients } = useClients();
  const byId = new Map((clients ?? []).map((c) => [c.id, c]));

  return {
    getClientName: (id: number) => byId.get(id)?.name ?? `#${id}`,
    clients: clients ?? [],
  };
}
