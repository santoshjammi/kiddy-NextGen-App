import Link from 'next/link';
import { LearningApp } from '@/types';

interface AppCardProps {
  app: LearningApp;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={app.path}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-purple-300">
        <div className="text-center">
          <div className="text-6xl mb-4">{app.icon}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{app.title}</h3>
          <p className="text-gray-600 text-sm">{app.description}</p>
        </div>
      </div>
    </Link>
  );
}