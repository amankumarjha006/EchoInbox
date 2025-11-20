"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2, Plus, MessageSquare, Share2, User as UserIcon  } from "lucide-react";
import PostCard from "@/components/PostCard";

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

  const handleShare = async () => {
    const username = session?.user?.username;
    if (!username) {
      toast.error("Username missing");
      return;
    }

    const profileUrl = `${window.location.origin}/u/${username}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my profile!",
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [status, router]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    if (!session) return;

    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data.posts || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchPosts();
  }, [session, fetchPosts]);

  // Create a post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Write something first");
      return;
    }

    setIsCreating(true);
    try {
      await axios.post("/api/posts", { content: newPostContent });
      toast.success("Post created successfully! 🎉");
      setNewPostContent("");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle accepting messages
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
      toast.success(prevState ? "Closed replies" : "Now accepting replies");
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
      <div className="flex justify-center items-center min-h-screen ">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl space-y-8">
        {/* HEADER */}
       <div className="text-center space-y-6">
  <div className="flex justify-center">
    <div className="rounded-full h-24 w-24 bg-primary/10 flex items-center justify-center">
      <UserIcon className="h-12 w-12 text-primary" />
    </div>
  </div>

  <div>
    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
      Welcome back, {session?.user?.username}
    </h1>
    <p className="text-muted-foreground mt-2">
      Manage your posts, replies and everything else in your creative space.
    </p>
  </div>

  <Button variant="outline" className="gap-2" onClick={handleShare}>
    <Share2 className="h-4 w-4" />
    Share Profile
  </Button>
</div>


        {/* CREATE POST */}
        <Card className="shadow-xl border-muted/30 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create a New Post
            </CardTitle>
            <CardDescription>
              Share a thought, question, or idea. Get anonymous feedback!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? 💭"
              maxLength={500}
              rows={4}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="resize-none focus-visible:ring-primary/40 bg-muted/10"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {newPostContent.length}/500 characters
              </span>

              <Button
              variant= "black"
                disabled={isCreating || !newPostContent.trim()}
                onClick={handleCreatePost}
                className="gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* POSTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your Posts</h2>
              <p className="text-sm text-muted-foreground">
                {posts.length} {posts.length === 1 ? "post" : "posts"} total
              </p>
            </div>
          </div>

          {/* POST LIST */}
          {posts.length === 0 ? (
            <Card className="border-none shadow-none bg-transparent">
  <CardContent className="text-center py-20 space-y-4 opacity-80">
    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
    <h3 className="font-semibold text-lg">You're all set!</h3>
    <p className="text-sm text-muted-foreground">
      Create your first post above and start receiving anonymous messages.
    </p>
  </CardContent>
</Card>

          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}