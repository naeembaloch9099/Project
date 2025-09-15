import { useQuery } from "@tanstack/react-query";
import getBookings from "../../services/apiBooking";
import { useSearchParams } from "react-router-dom";
export default function useBooking() {
  const [searchParams] = useSearchParams();
  //filter
  const filtervalue = searchParams.get("status") || "all";
  const filter =
    !filtervalue || filtervalue === "all"
      ? null
      : { field: "status", value: filtervalue };
  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings({ filter }),
  });
  return { isLoading, bookings, error };
}
