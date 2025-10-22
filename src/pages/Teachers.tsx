import { useState, useEffect } from 'react';
import axiosClient from '@/api/axiosClient';
import TeacherCard from '@/components/TeacherCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  city: string;
  hourlyRate: number;
  profilePicture?: string;
  averageRating: number;
  totalReviews: number;
  bio?: string;
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchTeachers();
  }, [subject, city, sortBy]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (subject !== 'all') params.append('subject', subject);
      if (city !== 'all') params.append('city', city);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await axiosClient.get(`/teachers?${params.toString()}`);
      setTeachers(response.data);
    } catch (error) {
      toast.error('Failed to load teachers');
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      const filtered = teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(search.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(search.toLowerCase())
      );
      setTeachers(filtered);
    } else {
      fetchTeachers();
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Find Your Perfect Teacher</h1>
          <p className="text-muted-foreground">
            Browse our community of expert tutors and find the best match for your learning goals.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Filters</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 flex gap-2">
              <Input
                placeholder="Search by name or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-xl text-muted-foreground">No teachers found</p>
            <Button onClick={fetchTeachers}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers;
