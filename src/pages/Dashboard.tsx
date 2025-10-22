import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axiosClient from '@/api/axiosClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Star, BookOpen, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (user?.role === 'teacher') {
      fetchTeacherProfile();
    } else if (user?.role === 'student') {
      fetchStudentStats();
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
    try {
      const response = await axiosClient.get('/teachers/profile');
      const data = response.data;
      setName(data.name || '');
      setBio(data.bio || '');
      setPhone(data.phone || '');
      setSubject(data.subject || '');
      setCity(data.city || '');
      setHourlyRate(data.hourlyRate?.toString() || '');
      setStats({ totalReviews: data.totalReviews || 0, averageRating: data.averageRating || 0 });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const response = await axiosClient.get('/students/my-reviews');
      setStats({ totalReviews: response.data.length, averageRating: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      
      if (user?.role === 'teacher') {
        formData.append('bio', bio);
        formData.append('phone', phone);
        formData.append('subject', subject);
        formData.append('city', city);
        formData.append('hourlyRate', hourlyRate);
        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }

        const response = await axiosClient.put('/teachers/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        updateUser(response.data);
      } else {
        const response = await axiosClient.put('/auth/profile', { name });
        updateUser(response.data);
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user?.role}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'teacher' ? 'Average Rating' : 'Reviews Written'}
              </CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role === 'teacher'
                  ? stats.averageRating.toFixed(1)
                  : stats.totalReviews}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {user?.role === 'student' && (
              <>
                <Link to="/teachers">
                  <Button variant="outline">Browse Teachers</Button>
                </Link>
                <Link to="/student-reviews">
                  <Button variant="outline">My Reviews</Button>
                </Link>
              </>
            )}
            {user?.role === 'teacher' && (
              <Link to={`/teachers/${user.id}`}>
                <Button variant="outline">View My Profile</Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {user?.role === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
