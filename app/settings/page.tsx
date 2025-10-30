"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Replace with actual session/auth logic
const DUMMY_USER_ID = "user_id_here";

export default function SettingsPage() {
  // === Profile State ===
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [socialLinks, setSocialLinks] = useState({ github: "", twitter: "", linkedin: "" });

  // === Meeting State ===
  const [meetingTitle, setMeetingTitle] = useState("Team Sync - {date}");
  const [meetingTemplates, setMeetingTemplates] = useState(["Daily Standup", "Weekly Review"]);
  const [templateInput, setTemplateInput] = useState("");
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [aiAssistant, setAIAssistant] = useState(false);
  const [meetingLayout, setMeetingLayout] = useState("Grid View");
  const [background, setBackground] = useState("None");

  // === Notifications State ===
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState("All");
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // === Privacy State ===
  const [joinWithoutLink, setJoinWithoutLink] = useState(false);
  const [screenSharing, setScreenSharing] = useState(true);
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // === Appearance/Theme State ===
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [navbarOpacity, setNavbarOpacity] = useState(0.8);

  // === System State ===
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [integration, setIntegration] = useState("Calendar");

  // === Feedback & Save ===
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // === Load settings on mount ===
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings?user_id=${DUMMY_USER_ID}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name ?? "");
          setEmail(data.email ?? "");
          setTheme(data.theme ?? "dark");
          setAccentColor(data.accentColor ?? "#3b82f6");
          setNotifications(data.notifications ?? true);
          setLanguage(data.language ?? "English");
          setProfilePic(data.profilePic ?? "");
          setMeetingTitle(data.meetingTitle ?? "Team Sync - {date}");
          setAIAssistant(data.aiAssistant ?? false);
          setMeetingLayout(data.meetingLayout ?? "Grid View");
          setBackground(data.background ?? "None");
          setEmailNotifications(data.emailNotifications ?? "All");
          setSoundAlerts(data.soundAlerts ?? true);
          setJoinWithoutLink(data.joinWithoutLink ?? false);
          setScreenSharing(data.screenSharing ?? true);
          setWaitingRoom(data.waitingRoom ?? true);
          setTwoFactor(data.twoFactor ?? false);
          setTimezone(data.timezone ?? "Asia/Kolkata (IST)");
          setIntegration(data.integration ?? "Calendar");
          setBio(data.bio ?? "");
          setPhone(data.phone ?? "");
          setLocation(data.location ?? "");
          setSocialLinks(data.socialLinks ?? { github: "", twitter: "", linkedin: "" });
          setPushNotifications(data.pushNotifications ?? false);
          setNavbarOpacity(data.navbarOpacity ?? 0.8);
          setMeetingTemplates(data.meetingTemplates ?? ["Daily Standup", "Weekly Review"]);
          setMeetingDuration(data.meetingDuration ?? 30);
        }
      } catch (e) {}
    };
    fetchSettings();
  }, []);

  // === Live theme switch (Tailwind) ===
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // === Helper: Validate email ===
  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // === Profile pic preview ===
  const handleProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setNewProfilePic(file);
    }
  };

  // === Modular Save handler ===
  const saveSettings = async (opts?: { instantFieldsOnly?: boolean }) => {
    setSaving(true);
    setSuccessMsg(""); setErrorMsg("");
    // Only validate email for grouped saves
    if (!opts?.instantFieldsOnly && !validateEmail(email)) {
      setErrorMsg("Enter a valid email address.");
      setSaving(false);
      return;
    }
    try {
      const settings = {
        user_id: DUMMY_USER_ID,
        name,
        email,
        profilePic,
        theme,
        notifications,
        language,
        accentColor,
        meetingTitle,
        aiAssistant,
        meetingLayout,
        background,
        emailNotifications,
        soundAlerts,
        joinWithoutLink,
        screenSharing,
        waitingRoom,
        twoFactor,
        timezone,
        integration,
        bio,
        phone,
        location,
        socialLinks,
        pushNotifications,
        navbarOpacity,
        meetingTemplates,
        meetingDuration,
      };
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        if (!opts?.instantFieldsOnly) setSuccessMsg("Settings saved!");
      } else {
        setErrorMsg("Error saving settings.");
      }
    } catch {
      setErrorMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  // === Advanced modular JSX ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Settings (Advanced)</h1>
      <Tabs defaultValue="profile" className="max-w-5xl mx-auto">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 bg-slate-800/50 p-2 rounded-xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        {(successMsg || errorMsg) && (
          <div className={`text-center mt-4 ${successMsg ? 'text-green-400' : 'text-red-400'}`}>{successMsg || errorMsg}</div>
        )}
        {/* Profile Advanced */}
        <TabsContent value="profile">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader><h2 className="text-xl font-semibold">Profile & Account</h2></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div>
                  <Label>Profile Picture</Label>
                  <Input type="file" accept="image/*" onChange={handleProfilePic} />
                  {profilePic && <img src={profilePic} alt="Profile preview" className="mt-2 rounded-full w-28 h-28 object-cover shadow-xl" />}
                </div>
                <div className="flex-1 space-y-4">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                  <Label>Email</Label>
                  <Input
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value) ? "" : "Enter a valid email.");
                    }}
                    placeholder="Your email"
                  />
                  {emailError && <span className="text-sm text-red-400">{emailError}</span>}
                  <Label>Bio</Label>
                  <Input value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio" />
                  <Label>Phone</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" />
                  <Label>Location</Label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="City/Country" />
                </div>
              </div>
              <div>
                <Label>Social Links</Label>
                <div className="flex gap-4">
                  <Input value={socialLinks.github} onChange={e => setSocialLinks({ ...socialLinks, github: e.target.value })} placeholder="GitHub" className="flex-1" />
                  <Input value={socialLinks.twitter} onChange={e => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="Twitter" className="flex-1" />
                  <Input value={socialLinks.linkedin} onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="LinkedIn" className="flex-1" />
                </div>
              </div>
              <div>
                <Label>Change Password</Label>
                <div className="flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="New password"
                  />
                  <Button type="button" className="ml-2" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
              <Button onClick={() => saveSettings()} disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Meeting Advanced */}
        <TabsContent value="meeting">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader><h2 className="text-xl font-semibold">Meeting Preferences</h2></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Meeting Title</Label>
                <Input value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} placeholder="Meeting title template" />
              </div>
              <div>
                <Label>Templates</Label>
                <div className="flex gap-2 mb-2">
                  <Input value={templateInput} onChange={e => setTemplateInput(e.target.value)} placeholder="Add template" />
                  <Button
                    onClick={() => {
                      if (templateInput.trim()) {
                        setMeetingTemplates(t => [...t, templateInput.trim()]);
                        setTemplateInput("");
                        saveSettings();
                      }
                    }}
                  >Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meetingTemplates.map((tpl, i) => (
                    <span key={tpl} className="px-2 py-1 bg-blue-700 text-xs rounded-full">
                      {tpl} <button className="ml-1 text-red-400" onClick={() => { setMeetingTemplates(mt => mt.filter((t, idx) => idx !== i)); saveSettings(); }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label>Default Duration (min)</Label>
                <Input type="number" min={15} max={180} value={meetingDuration} onChange={e => setMeetingDuration(Number(e.target.value))} />
              </div>
              <div className="flex justify-between items-center"><Label>Enable AI Assistant</Label>
                <Switch checked={aiAssistant} onCheckedChange={setAIAssistant} />
              </div>
              <div>
                <Label>Layout</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full" value={meetingLayout} onChange={e => setMeetingLayout(e.target.value)}>
                  <option value="Grid View">Grid View</option>
                  <option value="Speaker View">Speaker View</option>
                  <option value="Sidebar View">Sidebar View</option>
                </select>
              </div>
              <div>
                <Label>Background</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full" value={background} onChange={e => setBackground(e.target.value)}>
                  <option value="None">None</option>
                  <option value="Blur">Blur</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
              <Button onClick={() => saveSettings()} disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Notifications Advanced */}
        <TabsContent value="notifications">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader><h2 className="text-xl font-semibold">Notifications</h2></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><Label>Meeting Reminders (Email)</Label>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex justify-between items-center"><Label>Push Notifications</Label>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div>
                <Label>Email Level</Label>
                <select className="bg-slate-900 border border-slate-700 p-2 rounded w-full" value={emailNotifications} onChange={e => setEmailNotifications(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Important only">Important only</option>
                  <option value="None">None</option>
                </select>
              </div>
              <div className="flex justify-between items-center"><Label>Sound Alerts</Label>
                <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
              </div>
              <Button onClick={() => saveSettings()} disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Privacy Advanced */}
        <TabsContent value="privacy">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader><h2 className="text-xl font-semibold">Privacy & Security</h2></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center"><Label>Allow Joining Without Link</Label>
                  <Switch checked={joinWithoutLink} onCheckedChange={setJoinWithoutLink} />
                </div>
                <div className="flex justify-between items-center"><Label>Screen Sharing Permission</Label>
                  <Switch checked={screenSharing} onCheckedChange={setScreenSharing} />
                </div>
                <div className="flex justify-between items-center"><Label>Enable Waiting Room</Label>
                  <Switch checked={waitingRoom} onCheckedChange={setWaitingRoom} />
                </div>
                <div className="flex justify-between items-center"><Label>Two-Factor Authentication</Label>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </div>
              <Button onClick={() => saveSettings()} disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Appearance Advanced */}
        <TabsContent value="appearance">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader><h2 className="text-xl font-semibold">Appearance Customization</h2></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Theme Mode</Label>
                <select value={theme} onChange={async (e) => { setTheme(e.target.value); await saveSettings({ instantFieldsOnly: true }); }} className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div><Label>Accent Color</Label>
                <Input type="color" value={accentColor} onChange={async (e) => { setAccentColor(e.target.value); await saveSettings({ instantFieldsOnly: true }); }} />
              </div>
              <div><Label>Navbar Opacity</Label>
                <input type="range" min={0.5} max={1} step={0.01} value={navbarOpacity} onChange={e => setNavbarOpacity(Number(e.target.value))} className="w-full" />
                <span className="text-xs">{navbarOpacity}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* System Advanced */}
        <TabsContent value="system">
          <Card className="mt-6 bg-slate-800/60 border border-slate-700">
            <CardHeader><h2 className="text-xl font-semibold">System Settings</h2></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Language</Label>
                <select value={language} onChange={async (e) => { setLanguage(e.target.value); await saveSettings({ instantFieldsOnly: true }); }} className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>English</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div><Label>Timezone</Label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                  <option>EST</option>
                </select>
              </div>
              <div><Label>Integrations</Label>
                <select value={integration} onChange={e => setIntegration(e.target.value)} className="bg-slate-900 border border-slate-700 p-2 rounded w-full">
                  <option>Calendar</option>
                  <option>Slack</option>
                  <option>None</option>
                </select>
              </div>
              <Button onClick={() => saveSettings()} disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
