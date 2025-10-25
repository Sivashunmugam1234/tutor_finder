import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/home.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import MyReviews from './pages/reviews/MyReviews.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeacherDetails from './pages/teacher/TeacherDetails.jsx';
import TeacherList from './pages/teacher/TeacherList.jsx';
import TeacherProfile from './pages/teacher/TeacherProfileEdit.jsx';
import Profile from './pages/Profile.jsx';
import AboutUs from './pages/aboutus.jsx';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar className="absolute" />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Teacher Routes */}
            <Route path="/teachers" element={<TeacherList />} />
            <Route path="/teacher/:id" element={<TeacherProfile />} />
            <Route path="/teacher/:id/reviews" element={<MyReviews />} />
            <Route path="/teacher/:id/details" element={<TeacherDetails />} />

            {/* Protected User Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
