'use client';

import * as React from 'react';
import { Rating } from '@/components/common/Rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  isAuthenticated: boolean;
  isPending: boolean;
  onSubmit: (rating: number, comment: string, author: string) => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  productName,
  isAuthenticated,
  isPending,
  onSubmit,
}: ReviewModalProps) {
  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newRating, newComment, newAuthor);
  };

  // Reset form states when modal closes or opens
  React.useEffect(() => {
    if (!isOpen) {
      setNewRating(5);
      setNewComment('');
      setNewAuthor('');
    }
  }, [isOpen]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="md">
      <DialogHeader>
        <DialogTitle className="font-serif italic text-lg text-foreground">Write a Testimonial</DialogTitle>
        <DialogDescription>Share your honest feedback about {productName} with other scent collectors.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 p-6 font-sans">
          {/* Rating Selector */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Scent Rating:</label>
            <Rating rating={newRating} size={24} interactive onChange={(val) => setNewRating(val)} />
          </div>

          {/* Author Input (if guest) */}
          {!isAuthenticated && (
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Your Name:</label>
              <Input
                type="text"
                placeholder="e.g. Usman D."
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="rounded-xl border-border"
                required
              />
            </div>
          )}

          {/* Comment Field */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Olfactory Feedback:</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="How long does it last? What notes stand out to you?"
              rows={4}
              className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
        </DialogContent>
        <DialogFooter className="rounded-xl">
          <Button variant="outline" type="button" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="cursor-pointer rounded-xl bg-zinc-950 text-white hover:bg-zinc-800">
            {isPending ? 'Submitting...' : 'Submit Testimonial'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
