import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { User, BookOpen, Star, Calendar, DollarSign, Users } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalReviews: 0,
    averageRating: 0,
    totalEarnings: 0
  });

  console.log('TeacherDashboard rendered, user:', user);

  useEffect(() => {
    if (user?.teacherProfile) {
      setStats({
        totalStudents: user.teacherProfile.totalStudents || 0,
        totalReviews: user.teacherProfile.totalReviews || 0,
        averageRating: user.teacherProfile.averageRating || 0,
        totalEarnings: 0
      });
    }
  }, [user]);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center">
        <Icon className="h-8 w-8" style={{ color }} />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your teaching profile and track your progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            color="#3B82F6"
          />
          <StatCard
            icon={Star}
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            color="#F59E0B"
          />
          <StatCard
            icon={BookOpen}
            title="Total Reviews"
            value={stats.totalReviews}
            color="#10B981"
          />
          <StatCard
            icon={DollarSign}
            title="Estimated Earnings"
            value={`$${stats.totalEarnings}`}
            color="#8B5CF6"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/profile"
                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <User className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-700 font-medium">Edit Profile</span>
              </Link>
              <Link
                to={`/teacher/${user?._id}/reviews`}
                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Star className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-700 font-medium">View Reviews</span>
              </Link>
              <Link
                to="/teachers"
                className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <BookOpen className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-purple-700 font-medium">Browse Other Teachers</span>
              </Link>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="font-medium">{user?.teacherProfile?.subjects?.join(', ') || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">{user?.teacherProfile?.experience || 0} years</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Teaching Mode</p>
                <p className="font-medium">{user?.teacherProfile?.teachingMode?.join(', ') || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;