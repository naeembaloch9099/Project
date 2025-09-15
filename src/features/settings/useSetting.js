import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSetting";

export function useSettings() {
  const {
    isLaoding,
    error,
    data: settings,
  } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  return { isLaoding, error, settings };
}
