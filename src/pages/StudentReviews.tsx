import { useState, useEffect } from 'react';
import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/hooks/useAuth';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  studentName: string;
  teacherName: string;
  createdAt: string;
}

const StudentReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/students/my-reviews');
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const review = reviews.find(r => r.id === id);
    if (review) {
      setEditingReview(review);
      setEditRating(review.rating);
      setEditComment(review.comment);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      setSubmitting(true);
      await axiosClient.put(`/students/reviews/${editingReview.id}`, {
        rating: editRating,
        comment: editComment,
      });
      toast.success('Review updated successfully!');
      setEditingReview(null);
      fetchMyReviews();
    } catch (error) {
      toast.error('Failed to update review');
      console.error('Error updating review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await axiosClient.delete(`/students/reviews/${id}`);
      toast.success('Review deleted successfully!');
      fetchMyReviews();
    } catch (error) {
      toast.error('Failed to delete review');
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < currentRating ? 'fill-warning text-warning' : 'text-muted'
        }`}
        onClick={() => setEditRating(i + 1)}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Reviews</h1>
          <p className="text-muted-foreground">
            Manage all the reviews you've written for teachers
          </p>
        </div>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Review for: <span className="font-medium text-foreground">{review.teacherName}</span>
                </p>
                <ReviewCard
                  review={review}
                  canEdit={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-xl text-muted-foreground">You haven't written any reviews yet</p>
              <Button onClick={() => window.location.href = '/teachers'}>
                Browse Teachers
              </Button>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">{renderStars(editRating)}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-comment">Comment</Label>
                <Textarea
                  id="edit-comment"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditingReview(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentReviews;
