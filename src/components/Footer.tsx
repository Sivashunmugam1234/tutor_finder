import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">TutorFinder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TutorFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
