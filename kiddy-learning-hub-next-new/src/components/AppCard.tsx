import Link from 'next/link';

interface App {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={app.path}>
      <div className="app-card cursor-pointer">
        <div className="text-center">
          <div className="text-6xl mb-4">{app.icon}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{app.title}</h3>
          <p className="text-gray-600 text-sm">{app.description}</p>
        </div>
      </div>
    </Link>
  );
}