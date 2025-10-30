"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Users,
  Settings,
  Calendar,
  Copy,
  ArrowRight,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { createSupabaseClient } from "@/lib/supabase";

export default function NewMeetingPage() {
  const router = useRouter();
  const [meetingTitle, setMeetingTitle] = useState("");
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createInstantMeeting = async () => {
    setIsCreating(true);
    const roomId = uuidv4();
    const creatorId = `creator-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      // Store meeting creation info in Supabase
      const supabase = createSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("meetings").insert({
          room_id: roomId,
          title: meetingTitle || "Instant Meeting",
          created_by: creatorId,
          created_at: new Date().toISOString(),
          is_active: true,
        });

        if (error) {
          console.log("Error storing meeting info:", error.message);
          // Continue anyway - meeting will work without host privileges
        } else {
          console.log("Meeting created successfully with creator:", creatorId);
          // Store creator ID in localStorage so they can claim host status
          localStorage.setItem(`meeting-creator-${roomId}`, creatorId);
        }
      }

      // Simulate meeting creation delay
      setTimeout(() => {
        setCreatedRoomId(roomId);
        setIsCreating(false);
        toast.success("Meeting room created successfully!");
      }, 1500);
    } catch (error) {
      console.error("Error creating meeting:", error);
      // Still create meeting even if database fails
      setTimeout(() => {
        setCreatedRoomId(roomId);
        setIsCreating(false);
        toast.success("Meeting room created successfully!");
      }, 1500);
    }
  };

  const joinMeeting = (roomId: string) => {
    router.push(`/meeting/${roomId}`);
  };

  const handleJoinMeeting = () => {
    if (joinMeetingId.trim()) {
      // Clean the meeting ID (remove any spaces, special chars)
      const cleanId = joinMeetingId.trim().replace(/[^a-zA-Z0-9-]/g, "");
      if (cleanId) {
        joinMeeting(cleanId);
      } else {
        toast.error("Please enter a valid meeting ID");
      }
    } else {
      toast.error("Please enter a meeting ID");
    }
  };

  const copyInviteLink = (roomId: string) => {
    const inviteLink = `${window.location.origin}/meeting/${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");

    setTimeout(() => setCopied(false), 2000);
  };

  const shareInvite = (roomId: string) => {
    const inviteLink = `${window.location.origin}/meeting/${roomId}`;
    const shareText = `Join my DarkMeet video call: ${inviteLink}`;

    if (navigator.share) {
      navigator.share({
        title: "Join my DarkMeet call",
        text: shareText,
        url: inviteLink,
      });
    } else {
      copyInviteLink(roomId);
    }
  };

  if (createdRoomId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-900 to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Meeting Ready!
            </h1>
            <p className="text-gray-400 mb-6">
              Your meeting room has been created
            </p>

            <div className="bg-dark-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">Meeting ID</div>
              <div className="text-lg font-mono text-neon-blue break-all">
                {createdRoomId}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => joinMeeting(createdRoomId)}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Video className="h-5 w-5" />
                <span>Join Meeting Now</span>
              </button>

              <button
                onClick={() => copyInviteLink(createdRoomId)}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Invite Link</span>
                  </>
                )}
              </button>

              <button
                onClick={() => shareInvite(createdRoomId)}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Invite</span>
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/dashboard"
                className="text-neon-blue hover:text-neon-purple transition-colors duration-300"
              >
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Video className="h-8 w-8 text-neon-blue" />
                <span className="text-2xl font-bold gradient-text">
                  DarkMeet
                </span>
              </Link>

              <Link href="/dashboard" className="btn-secondary">
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Start Your</span>{" "}
              <span className="gradient-text">Meeting</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create a new meeting room with AI-powered features and invite
              others to join
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instant Meeting */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-dark rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Instant Meeting
                </h2>
                <p className="text-gray-400">Start a meeting right now</p>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Meeting title (optional)"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="input-dark w-full"
                />
              </div>

              <button
                onClick={createInstantMeeting}
                disabled={isCreating}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <div className="spinner-sm"></div>
                    <span>Creating Meeting...</span>
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5" />
                    <span>Start Instant Meeting</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Join Meeting */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-dark rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Join Meeting
                </h2>
                <p className="text-gray-400">Enter meeting ID to join</p>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter meeting ID"
                  value={joinMeetingId}
                  onChange={(e) => setJoinMeetingId(e.target.value)}
                  className="input-dark w-full"
                />
              </div>

              <button
                onClick={handleJoinMeeting}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Join Meeting</span>
              </button>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass-dark rounded-2xl p-6 mt-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-neon-blue" />
              <span>Quick Actions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 group"
              >
                <Settings className="h-6 w-6 text-neon-purple group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="font-semibold text-white">Dashboard</div>
                  <div className="text-sm text-gray-400">Manage meetings</div>
                </div>
              </Link>

              <button className="h-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 group text-left">
                <Calendar className="h-6 w-6 text-neon-green group-hover:scale-110 transition-transform duration-300" />
                <div className="leading-tight">
                  <div className="font-semibold text-white">
                    Schedule Meeting
                  </div>
                  <div className="text-sm text-gray-400">Plan for later</div>
                </div>
              </button>

              <Link
                href="/settings"
                className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300 group"
              >
                <Settings className="h-6 w-6 text-neon-cyan group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="font-semibold text-white">Settings</div>
                  <div className="text-sm text-gray-400">
                    Configure preferences
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
