import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { GraduationCap, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TutorFinder
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/teachers" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
              Find Teachers
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
