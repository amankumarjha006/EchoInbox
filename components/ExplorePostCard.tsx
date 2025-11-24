"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  User as UserIcon,
  Clock,
  Share2,
  ExternalLink,
  MoreVertical,
  Quote,
} from "lucide-react";
import Link from "next/link";

interface FeedPostCardProps {
  postId: string;
  content: string;
  createdAt: Date;
  username: string;
  isAcceptingMessages: boolean;
}

export default function ExplorePostCard({
  postId,
  content,
  createdAt,
  username,
  isAcceptingMessages,
}: FeedPostCardProps) {
  const router = useRouter();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/u/${username}/posts/${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by @${username}`,
          url: postUrl,
        });
      } else {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Post link copied! 🔗");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleViewPost = () => {
    router.push(`/u/${username}/posts/${postId}`);
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

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/10">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="space-y-4 pb-2">
        <div className="flex items-start justify-between">
          <Link
            href={`/u/${username}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">@{username}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Anonymous Host
              </span>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleViewPost}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Reply to Post
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content with Quote Style */}
        <div className="relative pl-4 border-l-2 border-primary/20 py-1">
          <Quote className="absolute -top-2 -left-2 h-4 w-4 text-primary/20 fill-primary/10" />
          <p className="text-lg font-medium leading-relaxed text-foreground/90 font-serif italic">
            {content}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
            <Clock className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex justify-end gap-2 pt-4 border-t bg-muted/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Button size="sm" onClick={handleViewPost} className="shadow-sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          Reply
        </Button>
      </CardFooter>
    </Card>
  );
}
