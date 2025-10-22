import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/hooks/useAuth';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, MapPin, DollarSign, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  city: string;
  hourlyRate: number;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  studentName: string;
  createdAt: string;
}

const TeacherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeacherProfile();
  }, [id]);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/teachers/${id}`);
      setTeacher(response.data.teacher);
      setReviews(response.data.reviews || []);
    } catch (error) {
      toast.error('Failed to load teacher profile');
      console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'student') {
      toast.error('Only students can submit reviews');
      return;
    }

    try {
      setSubmitting(true);
      await axiosClient.post(`/students/teachers/${id}/reviews`, {
        rating,
        comment,
      });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchTeacherProfile();
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < currentRating ? 'fill-warning text-warning' : 'text-muted'
        }`}
        onClick={() => setRating(i + 1)}
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

  if (!teacher) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-muted-foreground">Teacher not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* Teacher Info Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                {teacher.profilePicture ? (
                  <img
                    src={teacher.profilePicture}
                    alt={teacher.name}
                    className="h-48 w-48 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-48 w-48 rounded-full bg-gradient-primary flex items-center justify-center text-6xl font-bold text-primary-foreground shadow-lg">
                    {teacher.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
                  <p className="text-xl text-primary font-semibold">{teacher.subject}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(teacher.averageRating) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{teacher.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({teacher.totalReviews} reviews)</span>
                </div>

                {teacher.bio && (
                  <p className="text-muted-foreground">{teacher.bio}</p>
                )}

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{teacher.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <DollarSign className="h-5 w-5" />
                    <span>{teacher.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                    <span>{teacher.email}</span>
                  </div>
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-5 w-5" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reviews</h2>

          {user?.role === 'student' && (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Rating</Label>
                    <div className="flex gap-1">{renderStars(rating)}</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with this teacher..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to review this teacher!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
