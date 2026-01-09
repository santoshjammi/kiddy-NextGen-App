import Link from 'next/link';
import { LearningApp } from '@/types';

interface AppCardProps {
  app: LearningApp;
  progress?: number;
}

export const AppCard = ({ app, progress = 0 }: AppCardProps) => {
  return (
    <div className="app-card">
      <div className="app-icon">{app.icon}</div>
      <h2 className="app-title">{app.title}</h2>
      <p className="app-description">{app.description}</p>

      <div className="mb-4">
        <span className="text-xs text-gray-500 block mb-2">Learning Progress</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <Link href={app.route}>
        <button className="app-button">
          Start Learning
        </button>
      </Link>
    </div>
  );
};