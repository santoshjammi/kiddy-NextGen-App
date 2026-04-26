// Authentication is handled by Firebase Auth. This NextAuth route is no longer active.
export function GET() {
  return new Response('Authentication is handled by Firebase', { status: 404 });
}
export function POST() {
  return new Response('Authentication is handled by Firebase', { status: 404 });
}
