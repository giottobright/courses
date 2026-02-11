'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Settings, Database, Key, Mail, CreditCard, Video } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-dark mb-2">
          Platform Settings
        </h1>
        <p className="text-gray-600">Configure integrations and platform settings</p>
      </div>

      {/* Integrations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Key className="text-primary-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Memberstack</h3>
              <p className="text-sm text-gray-600">Authentication & User Management</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-4">
            Status: <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Stripe</h3>
              <p className="text-sm text-gray-600">Payment Processing</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-4">
            Status: <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Video className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Vimeo</h3>
              <p className="text-sm text-gray-600">Video Hosting</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-4">
            Status: <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Mail className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">SendGrid</h3>
              <p className="text-sm text-gray-600">Email Service</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-4">
            Status: <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Database className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Database</h3>
              <p className="text-sm text-gray-600">PostgreSQL + Prisma</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-4">
            Status: <span className="text-green-600 font-semibold">Connected</span>
          </div>
          <Button variant="outline" size="sm">
            View Schema
          </Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Settings className="text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">General Settings</h3>
              <p className="text-sm text-gray-600">Platform Configuration</p>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-4">
            Configure platform-wide settings
          </div>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-lg mb-3">Configuration Guide</h3>
        <p className="text-sm text-gray-700 mb-3">
          All integrations are configured via environment variables. See the{' '}
          <code className="bg-blue-100 px-2 py-1 rounded text-xs">.env.example</code> file for required keys.
        </p>
        <p className="text-sm text-gray-700">
          For detailed setup instructions, refer to{' '}
          <code className="bg-blue-100 px-2 py-1 rounded text-xs">INTEGRATION-GUIDE.md</code>
        </p>
      </Card>
    </div>
  );
}
