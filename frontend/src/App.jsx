import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/home.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import MyReviews from './pages/reviews/MyReviews.jsx';
import StudentReviews from './pages/student/StudentReviews.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthRedirect from './components/AuthRedirect.jsx';
import TeacherDetails from './pages/teacher/TeacherDetails.jsx';
import TeacherList from './pages/teacher/TeacherList.jsx';
import TeacherProfile from './pages/teacher/TeacherProfileEdit.jsx';
import TeacherProfileView from './pages/teacher/TeacherProfileView.jsx';
import TeacherProfileManage from './pages/teacher/TeacherProfileManage.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import Profile from './pages/Profile.jsx';
import AboutUs from './pages/aboutus.jsx';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  const location = useLocation();
  const showFooter = location.pathname === '/';

  return (
    <>
      <Navbar className="absolute" />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Teacher Routes */}
          <Route path="/teachers" element={<ProtectedRoute><TeacherList /></ProtectedRoute>} />
          <Route path="/teacher/:id" element={<ProtectedRoute><TeacherProfileView /></ProtectedRoute>} />
          <Route path="/teacher/:id/reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
          <Route path="/teacher/:id/details" element={<ProtectedRoute><TeacherDetails /></ProtectedRoute>} />
          <Route path="/teacher/:id/edit" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />
          <Route path="/teacher/:id/manage" element={<ProtectedRoute><TeacherProfileManage /></ProtectedRoute>} />
          
          {/* Protected Teacher Dashboard */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected User Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Student Reviews */}
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <StudentReviews />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
