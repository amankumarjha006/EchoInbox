'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MessageCircle,
  Share2,
  ExternalLink,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Quote,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'

interface PostCardProps {
  postId: string
  content: string
  createdAt: Date
  isAcceptingMessages: boolean
  repliesCount: number
  username: string
  onToggleAccepting?: () => void
  onDelete?: () => void
  isPublic?: boolean
}

export default function PostCard({
  postId,
  content,
  createdAt,
  isAcceptingMessages,
  repliesCount,
  username,
  onToggleAccepting,
  onDelete,
  isPublic = false,
}: PostCardProps) {

  const router = useRouter()
  const { data: session } = useSession()

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const handleShare = async () => {
    const targetUsername = isPublic ? username : session?.user?.username;

    if (!targetUsername) {
      toast.error("Username missing");
      return;
    }

    const url = `${window.location.origin}/u/${targetUsername}/posts/${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this post!",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleViewReplies = () => {
    router.push(`/u/${username}/posts/${postId}`)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - new Date(date).getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60))
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: new Date(date).getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 bg-gradient-to-br from-card to-muted/30 dark:from-card dark:to-muted/10">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="space-y-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {isPublic && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{username}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Anonymous Host</span>
                  </div>
                </div>
              )}
            </div>

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
                <DropdownMenuItem onClick={handleViewReplies}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isPublic ? "Reply" : "View Replies"}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>

                {!isPublic && onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative pl-4 border-l-2 border-primary/20 py-1">
            <Quote className="absolute -top-2 -left-2 h-4 w-4 text-primary/20 fill-primary/10" />
            <p className="text-lg font-medium leading-relaxed text-foreground/90 font-serif italic">
              {content}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
              <Clock className="h-3 w-3" />
              <span>{formatDate(createdAt)}</span>
            </div>

            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
              <MessageCircle className="h-3 w-3" />
              <span>{repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
            </div>

            {!isPublic && (
              isAcceptingMessages ? (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1">
                  <XCircle className="h-3 w-3" />
                  Closed
                </Badge>
              )
            )}
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t bg-muted/20">
          {!isPublic && onToggleAccepting && (
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <label
                htmlFor={`toggle-${postId}`}
                className="text-sm font-medium cursor-pointer select-none text-muted-foreground"
              >
                Accept replies
              </label>
              <Switch
                id={`toggle-${postId}`}
                checked={isAcceptingMessages}
                onCheckedChange={onToggleAccepting}
              />
            </div>
          )}

          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto ">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex-1 sm:flex-none hover:bg-primary/10 hover:text-primary"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button
              size="sm"
              onClick={handleViewReplies}
              className="flex-1 sm:flex-none shadow-sm"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isPublic ? "Reply" : "View Details"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* FULL SCREEN DELETE CONFIRMATION */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onDelete) onDelete()
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
