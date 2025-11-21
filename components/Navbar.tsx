"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { toast } from "sonner";
import { 
  Share2, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon,
  Home,
  LayoutDashboard,
  ChevronDown,
  LogIn,
  Plus
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isOpen, setIsOpen] = useState(false);

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
        toast.success("Profile link copied! 🔗");
      }
    } catch {
      toast.error("Share failed");
    }
    setIsOpen(false);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
  };

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50 
        border-b 
        bg-background/80 
        backdrop-blur-md
        supports-[backdrop-filter]:bg-background/60 
        py-3
      "
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className=" font-display text-xl font-bold italic hover:text-primary transition-colors">
          WhisperBack
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="max-w-[120px] truncate font-medium">
                    {user?.username || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.username || "User"}</span>
                    <span className="text-xs font-normal text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button  variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
                <LogIn/>
                
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 flex flex-col gap-4">
                {session ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Navigation Links */}
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Home className="h-4 w-4" />
                          <span>Home</span>
                        </Link>
                      </SheetClose>
                      
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SheetClose>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button 
                        onClick={handleShare} 
                        variant="outline" 
                        className="w-full justify-start gap-3"
                      >
                        <Share2 className="h-4 w-4" />
                        Share Profile
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest Navigation */}
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Home className="h-4 w-4" />
                          <span>Home</span>
                        </Link>
                      </SheetClose>
                    </div>

                    <Separator />

                    {/* Auth Buttons */}
                    <div className="space-y-2">
                      <SheetClose asChild >
                       <Link href="/sign-in">
                        <Button variant="ghost" className="w-full">
                          Sign In
                          <LogIn/>
                        </Button>
                        </Link>
                      </SheetClose>
                      
                      <SheetClose asChild>
                        <Link href="/sign-up">
                        <Button variant="default" className="w-full mt-2">
                          Create account
                          <Plus/>
                        </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;