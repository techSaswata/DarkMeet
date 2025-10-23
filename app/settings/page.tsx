"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>

      <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 bg-slate-800/50 p-2 rounded-xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* 👤 Profile Settings */}
        <TabsContent value="profile">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Settings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input placeholder="Enter your name" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <Label>Email</Label>
                <Input placeholder="Enter your email" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <Label>Profile Picture</Label>
                <Input type="file" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <Label>Change Password</Label>
                <Input type="password" placeholder="New password" className="bg-slate-900 border-slate-700" />
              </div>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 📅 Meeting Preferences */}
        <TabsContent value="meeting">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader>
              <h2 className="text-xl font-semibold">Meeting Preferences</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Meeting Title</Label>
                <Input placeholder="Team Sync - {date}" className="bg-slate-900 border-slate-700" />
              </div>
              <div className="flex justify-between items-center">
                <Label>Enable AI Meeting Assistant</Label>
                <Switch />
              </div>
              <div>
                <Label>Default Layout</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>Grid View</option>
                  <option>Speaker View</option>
                </select>
              </div>
              <div>
                <Label>Background</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>None</option>
                  <option>Blur</option>
                  <option>Virtual</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔔 Notifications */}
        <TabsContent value="notifications">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Meeting Reminders</Label>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div>
                <Label>Email Notifications</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>All</option>
                  <option>Important only</option>
                  <option>None</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <Label>Sound Alerts</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔒 Privacy & Security */}
        <TabsContent value="privacy">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader>
              <h2 className="text-xl font-semibold">Privacy & Security</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Allow Join Without Link</Label>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <Label>Screen Sharing Permissions</Label>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <Label>Enable Waiting Room</Label>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <Label>Two-Factor Authentication</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🎨 Appearance & Theme */}
        <TabsContent value="appearance">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader>
              <h2 className="text-xl font-semibold">Appearance & Theme</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Mode</Label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-slate-900 border border-slate-700 p-2 rounded w-full"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <Label>Accent Color</Label>
                <Input type="color" defaultValue="#3b82f6" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ⚙️ System Settings */}
        <TabsContent value="system">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader>
              <h2 className="text-xl font-semibold">System Settings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Language</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>English</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div>
                <Label>Timezone</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                  <option>EST</option>
                </select>
              </div>
              <div>
                <Label>Integrations</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>Calendar</option>
                  <option>Slack</option>
                  <option>None</option>
                </select>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                Clear Cache / Reset Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
