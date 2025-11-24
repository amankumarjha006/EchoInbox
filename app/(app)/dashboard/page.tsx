"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Loader2, Plus, MessageSquare, LayoutDashboard, Sparkles, Copy, Check } from "lucide-react";
import PostCard from "@/components/PostCard";
import { motion } from "framer-motion";

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  isAcceptingMessages: boolean;
  replies: any[];
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/sign-in");
  }, [status]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    if (!session) return;

    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data.posts || []);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchPosts();
  }, [session, fetchPosts]);

  // Create post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Write something first");
      return;
    }

    setIsCreating(true);
    try {
      await axios.post("/api/posts", { content: newPostContent });
      toast.success("Post created!");
      setNewPostContent("");
      fetchPosts();
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle replies
  const handleToggleMessages = async (id: string, prevState: boolean) => {
    try {
      await axios.patch(`/api/posts/${id}/toggle-messages`, {
        isAcceptingMessages: !prevState,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isAcceptingMessages: !prevState } : p
        )
      );
      toast.success(prevState ? "Replies disabled" : "Replies enabled");
    } catch {
      toast.error("Failed to update");
    }
  };

  // Delete post
  const handleDeletePost = async (id: string) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const copyProfileLink = () => {
    const username = session?.user?.username;
    if (!username) return;
    const url = `${window.location.origin}/u/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-10 relative z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl h-16 w-16 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-display">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">@{session?.user?.username}</span>
              </p>
            </div>
          </div>

          <Button
            onClick={copyProfileLink}
            variant="outline"
            className="glass hover:bg-white/10 gap-2 h-11 px-6 rounded-full"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Profile Link"}
          </Button>
        </div>

        {/* CREATE POST */}
        <div className="animate-slide-up delay-100">
          <Card className="glass-card border-none shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-cyan-500/50 to-teal-500/50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Create a new post
              </CardTitle>
              <CardDescription>
                Share your thoughts. People will reply anonymously.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                maxLength={500}
                rows={4}
                className="bg-background/50 border-white/10 focus:border-primary/50 resize-none text-lg p-4 rounded-xl transition-all"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {newPostContent.length}/500 characters
                </span>

                <Button
                  disabled={isCreating}
                  onClick={handleCreatePost}
                  className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* POSTS */}
        <div className="space-y-6 animate-slide-up delay-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display">Your Posts</h2>
            <div className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>

          {posts.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent shadow-none text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No posts yet</h3>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                Create your first post above to start receiving anonymous messages.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard
                    postId={post._id}
                    content={post.content}
                    createdAt={new Date(post.createdAt)}
                    isAcceptingMessages={post.isAcceptingMessages}
                    repliesCount={post.replies.length}
                    username={session?.user?.username || ""}
                    onToggleAccepting={() =>
                      handleToggleMessages(post._id, post.isAcceptingMessages)
                    }
                    onDelete={() => handleDeletePost(post._id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
