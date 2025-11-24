"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader2, RefreshCcw, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import ExplorePostCard from "@/components/ExplorePostCard";

interface Post {
  _id: string;
  content: string;
  createdAt: Date;
  username: string;
  isAcceptingMessages: boolean;
  replies: any[];
}

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/posts/explore?page=${pageNum}&limit=10`
      );
      const newPosts = response.data.posts;
      const pagination = response.data.pagination;

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(pagination.hasMore);
    } catch (error) {
      console.error("Error fetching explore:", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 py-10 max-w-5xl relative z-10 space-y-10">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-start mb-6 gap-4">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 shadow-lg">
              <Compass className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Explore
            </h1>
          </div>

          {/* Description */}
          <p className="text-muted-foreground max-w-2xl mb-6 text-left">
            Browse anonymous messages from the community. Tap any post to reply.
          </p>
        </div>

        <Separator />

        {/* Posts Section */}
        <div className="space-y-6 animate-slide-up delay-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Latest Posts</h2>

            {/* Refresh */}
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {initialLoad ? (
          <div className="flex justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading explore...
              </p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Compass className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Be the first to create a post and start the conversation!
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ExplorePostCard
                    postId={post._id}
                    content={post.content}
                    createdAt={new Date(post.createdAt)}
                    username={post.username}
                    isAcceptingMessages={post.isAcceptingMessages}
                  />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-8">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : hasMore ? (
                <Button
                  onClick={loadMore}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                >
                  Load More Posts
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">
                  You've reached the end 🎉
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
