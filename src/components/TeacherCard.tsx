import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeacherCardProps {
  teacher: {
    id: string;
    name: string;
    subject: string;
    city: string;
    hourlyRate: number;
    profilePicture?: string;
    averageRating: number;
    totalReviews: number;
    bio?: string;
  };
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Link to={`/teachers/${teacher.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden bg-gradient-hero">
            {teacher.profilePicture ? (
              <img
                src={teacher.profilePicture}
                alt={teacher.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {teacher.name.charAt(0)}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{teacher.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {teacher.subject}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-warning">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">{teacher.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({teacher.totalReviews})</span>
              </div>
            </div>

            {teacher.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">{teacher.bio}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{teacher.city}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-primary">
                <DollarSign className="h-4 w-4" />
                <span>{teacher.hourlyRate}/hr</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TeacherCard;
