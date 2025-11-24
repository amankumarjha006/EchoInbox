'use client'
import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X, Clock } from 'lucide-react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type Reply = {
    _id: string;
    content: string;
    createdAt: Date;
}

type MessageCardProps = {
    reply: Reply;
    postId: string;
    onReplyDelete: (replyId: string) => void;
}

const MessageCard = ({ reply, postId, onReplyDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/posts/${postId}/replies/${reply._id}`
            )
            toast.success(response.data.message)
            onReplyDelete(reply._id)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(
                axiosError.response?.data.message ?? 'Failed to delete reply'
            )
        }
    }

    return (
        <Card className="relative overflow-hidden transition-all hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm group">
            <CardHeader className="p-5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="relative pl-4 border-l-2 border-primary/20 py-1">
                            <p className="text-sm leading-relaxed text-foreground/90 font-medium">{reply.content}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass-card">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this reply?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this
                                    anonymous reply.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
        </Card>
    )
}

export default MessageCard