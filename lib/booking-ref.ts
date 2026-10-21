export function createBookingReference(): string {
  const year = new Date().getUTCFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NT-${year}-${random}`;
}

export function videoLinkFor(reference: string): string {
  return `https://meet.nathan-tutors.co.ke/${reference.toLowerCase()}`;
}

export function calendarLink(input: {
  title: string;
  start: string;
  end: string;
  details: string;
  location: string;
}): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${input.start}/${input.end}`,
    details: input.details,
    location: input.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
