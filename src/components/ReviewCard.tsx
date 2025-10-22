import { Star, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    studentName: string;
    createdAt: string;
  };
  canEdit?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ReviewCard = ({ review, canEdit, onEdit, onDelete }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-warning text-warning' : 'text-muted'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="font-medium">{review.studentName}</p>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(review.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(review.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
