import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutapi } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutapi,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });
  return { logout, isLoading };
}
