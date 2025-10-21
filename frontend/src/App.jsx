
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
// import TeacherProfile from './pages/TeacherProfile';
// import TeacherDashboard from './pages/TeacherDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/teacher/:id" element={<TeacherProfile />} /> */}
            {/* <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> */}
            {/* Add Student Dashboard route here */}
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;