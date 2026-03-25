import { useMutation } from "@tanstack/react-query";

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: async (_message: ContactMessage) => {
      // Contact form - local only (backend simplified to ticket storage only)
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  });
}
