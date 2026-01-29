import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/authOptions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold">Not signed in</h2>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
