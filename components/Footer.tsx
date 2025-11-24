import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-background/50 backdrop-blur-sm py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="font-display text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                            WhisperBack
                        </span>
                        <p className="text-sm text-muted-foreground">
                            Anonymous feedback for the modern web.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="https://github.com"
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link
                            href="https://twitter.com"
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link
                            href="https://linkedin.com"
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} WhisperBack. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
