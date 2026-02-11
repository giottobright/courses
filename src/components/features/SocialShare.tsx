// Social sharing component
'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
}

export function SocialShare({ title, description, url, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.error('Share failed:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  // Social media share links
  const handleTwitterShare = () => {
    const text = encodeURIComponent(title + (description ? ': ' + description : ''));
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        {/* Native Share Button (mobile-friendly) */}
        {typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="gap-2"
          >
            <Share2 size={18} />
            Share
          </Button>
        )}

        {/* Social Media Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleTwitterShare}
          title="Share on Twitter"
          className="w-10 h-10 p-0"
        >
          <Twitter size={18} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLinkedInShare}
          title="Share on LinkedIn"
          className="w-10 h-10 p-0"
        >
          <Linkedin size={18} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleFacebookShare}
          title="Share on Facebook"
          className="w-10 h-10 p-0"
        >
          <Facebook size={18} />
        </Button>

        {/* Copy Link Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          title="Copy link"
          className="gap-2"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </div>
    </div>
  );
}

// Simple share button (just the icon)
export function ShareButton({ title, description, url }: SocialShareProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async () => {
    const canShare = typeof window !== 'undefined' && 
                     'navigator' in window && 
                     'share' in navigator;
    
    if (canShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const canCopy = typeof window !== 'undefined' && 
                      'navigator' in window && 
                      navigator.clipboard;
      
      if (canCopy) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        } catch (error) {
          toast.error('Failed to copy link');
        }
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="Share"
    >
      <Share2 size={20} />
    </button>
  );
}

// Share modal/card component
export function ShareCard({ title, description, url, onClose }: SocialShareProps & { onClose?: () => void }) {
  return (
    <Card className="max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Share this course</h3>
        <p className="text-gray-600 text-sm">
          Help others discover this amazing content
        </p>
      </div>

      <SocialShare title={title} description={description} url={url} />

      {onClose && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={onClose}
        >
          Close
        </Button>
      )}
    </Card>
  );
}
