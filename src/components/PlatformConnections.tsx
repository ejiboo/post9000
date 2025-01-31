'use client';

import { useEffect, useState } from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaTiktok, 
  FaPinterest 
} from 'react-icons/fa';
import type { Database, SocialPlatform } from '@/types/database';

type PlatformConnection = Database['public']['Tables']['platform_connections']['Row'];

const PLATFORM_CONFIG = {
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-600',
    icon: FaFacebook,
    scopes: ['public_profile', 'pages_manage_posts']
  },
  instagram: {
    name: 'Instagram',
    color: 'bg-pink-600',
    icon: FaInstagram,
    scopes: ['basic', 'publish_content']
  },
  twitter: {
    name: 'Twitter',
    color: 'bg-sky-500',
    icon: FaTwitter,
    scopes: ['tweet.write', 'users.read']
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-blue-700',
    icon: FaLinkedin,
    scopes: ['w_member_social']
  },
  tiktok: {
    name: 'TikTok',
    color: 'bg-black',
    icon: FaTiktok,
    scopes: ['video.upload']
  },
  pinterest: {
    name: 'Pinterest',
    color: 'bg-red-600',
    icon: FaPinterest,
    scopes: ['boards:write', 'pins:write']
  }
} as const;

export default function PlatformConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  async function fetchConnections() {
    try {
      const response = await fetch('/api/platform-connections');
      if (!response.ok) throw new Error('Failed to fetch connections');
      const data = await response.json();
      setConnections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConnect(platform: SocialPlatform) {
    try {
      window.location.href = `/api/auth/${platform}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate connection');
    }
  }

  async function handleDisconnect(connectionId: string) {
    try {
      const response = await fetch(`/api/platform-connections/${connectionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to disconnect platform');
      
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect platform');
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading connections...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(PLATFORM_CONFIG).map(([platform, config]) => {
        const connection = connections.find(c => c.platform === platform);
        
        return (
          <div key={platform} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center text-white`}>
                <config.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium">{config.name}</h3>
                <p className="text-sm text-gray-500">
                  {connection ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => connection 
                ? handleDisconnect(connection.id)
                : handleConnect(platform as SocialPlatform)
              }
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                connection
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {connection ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        );
      })}
    </div>
  );
} 