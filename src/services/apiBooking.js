import supabase from "./supabaseClient";

export async function getBookings({
  filter,
  sortBy,
  search,
  page = 1,
  pageSize = 10,
} = {}) {
  let query = supabase.from("bookings").select(
    `
      id,
      cabinId,
      startDate,
      endDate,
      numNights,
      totalPrice,
      status,
      guests (
        fullName,
        email
      )
    `,
    { count: "exact" }
  );

  // Filter
  if (filter && filter !== "all") {
    query = query.eq("status", filter);
  }

  // Search
  if (search && search.trim() !== "") {
    query = query.ilike("guests.fullName", `%${search}%`);
  }

  // Sort
  if (sortBy && sortBy !== "all") {
    if (sortBy === "date-asc")
      query = query.order("startDate", { ascending: true });
    else if (sortBy === "date-desc")
      query = query.order("startDate", { ascending: false });
    else if (sortBy === "amount-asc")
      query = query.order("totalPrice", { ascending: true });
    else if (sortBy === "amount-desc")
      query = query.order("totalPrice", { ascending: false });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }
  return { data, count };
}

export async function getBookingById(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      startDate,
      endDate,
      numNights,
      numGuests,
      cabinPrice,
      extraPrice,
      totalPrice,
      status,
      hasBreakFast,
      isPaid,
      observation,
      created_at,
      cabins (
        id,
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image
      ),
      guests (
        fullName,
        email,
        nationalID,
        nationality,
        countryFlag
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be loaded");
  }
  return data;
}

export async function checkInBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "checkedin", isPaid: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Check-in failed");
  }
  return data;
}
export async function checkOutBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "checkedout", isPaid: true })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Check-out failed");
  }
  return data;
}
const deleteBooking = async (id) => {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
};

export { deleteBooking };
