"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

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
        toast.success("Profile link copied!");
      }
    } catch {
      toast.error("Share failed");
    }
  };

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50 
        border-b 
        bg-background/80 
        backdrop-blur 
        supports-[backdrop-filter]:bg-background/60 
        py-4
      "
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Mystery Message
        </Link>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Section */}
          {session ? (
            <div className="flex flex-col md:flex-row items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.username || user?.email}
              </span>

              {/* Share Button */}
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4" />
                Share profile
              </Button>

              <Button
                className="w-full md:w-auto"
                variant="outline"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button asChild className="w-full md:w-auto" variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
