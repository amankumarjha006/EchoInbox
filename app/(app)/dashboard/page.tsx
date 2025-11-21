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

import { Loader2, Plus, MessageSquare, Share2, LayoutDashboard } from "lucide-react";
import PostCard from "@/components/PostCard";
import ThemeToggle from "@/components/theme-toggle";

// Framer Motion for smooth UI transitions
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

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="
  min-h-screen">
      
     

      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">

        {/* HEADER SECTION */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full h-24 w-24 bg-primary/10 flex items-center justify-center shadow-md">
              <LayoutDashboard className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome back, {session?.user?.username}
            </h2>
            <p className="text-muted-foreground mt-2">
              Manage your posts and anonymous replies.
            </p>
          </div>
        </div>

        {/* CREATE POST */}
        <Card className="shadow-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create a new post
            </CardTitle>
            <CardDescription>
              Share your thoughts. People will reply anonymously.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write something..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              maxLength={500}
              rows={4}
              className="bg-muted/20 focus-visible:ring-primary"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {newPostContent.length}/500
              </span>

              <Button disabled={isCreating} onClick={handleCreatePost}>
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* POSTS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Posts</h2>

          {posts.length === 0 ? (
            <Card className="border-dashed shadow-none text-center py-16">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                You haven’t posted anything yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
