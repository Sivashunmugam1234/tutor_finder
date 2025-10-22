import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Star, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-primary bg-clip-text text-transparent">
              Find Your Perfect Tutor
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with expert teachers across all subjects. Learn at your own pace with personalized tutoring sessions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/teachers">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Browse Teachers
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TutorFinder?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Verified Teachers</h3>
              <p className="text-muted-foreground">
                All our tutors are carefully vetted professionals with proven teaching experience.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                <Star className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Real Reviews</h3>
              <p className="text-muted-foreground">
                Read honest feedback from students to find the perfect match for your learning style.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                Our platform ensures high-quality education with subject matter experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have found their ideal tutors on our platform.
          </p>
          <Link to="/register">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
