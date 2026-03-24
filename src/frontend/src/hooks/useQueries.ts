import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContactMessage } from "../backend";
import { useActor } from "./useActor";

export function useSubmitContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: ContactMessage) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
  });
}
