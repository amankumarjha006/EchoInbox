"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  MessageSquare,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Share2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Plus,
  LogIn,
} from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";

interface Post {
  _id: string;
  content: string;
  isAcceptingMessages: boolean;
  createdAt: Date;
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [username]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get<
        ApiResponse & { posts: Post[]; username: string }
      >(`/api/users/${username}/posts`);
      setPosts(response.data.posts || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "User not found");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/u/${username}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${username}'s Profile`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied! 🔗");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          new Date(date).getFullYear() !== now.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="text-center space-y-6 mb-12">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center shadow-xl">
              <UserIcon className="h-14 w-14 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Username & Stats */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              @{username}
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
              <span>•</span>
              <span>Public Profile</span>
            </div>
          </div>

          {/* Share Button */}
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Posts Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Posts</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tap any post to send an anonymous reply
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="text-center py-16 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">No posts yet</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  @{username} hasn't created any posts yet. Check back later!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Link
                key={post._id}
                href={`/u/${username}/posts/${post._id}`}
                className="block group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    {/* Status & Date */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>

                      {post.isAcceptingMessages ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            Open
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted">
                          <XCircle className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Closed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <CardTitle className="text-base leading-relaxed font-medium group-hover:text-primary transition-colors">
                      {post.content}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between py-3 px-4 -mx-2 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          Plus anonymous reply
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <footer className="border-t mt-12 pt-10 pb-6 text-center">
          <div className="space-y-4 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold tracking-tight">
                Want your own anonymous inbox?
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Sign up and start getting honest replies today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link href="/sign-up">
              <Button size="sm" >
                  <Plus />
                  Create Account
                
              </Button>
              </Link>

              <Link href="/sign-in">
                <Button  variant="ghost" size="sm"> 
                  Sign In
                  <LogIn />
                </Button>
              </Link>
            </div>
          </div>

          <Separator className="my-4" />

          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              WhisperBack
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
