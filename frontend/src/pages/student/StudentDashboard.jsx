import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { User, BookOpen, Star, MessageSquare, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fixS3ImageUrl } from '../../utils/imageUtils';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reviewsResponse, requestsResponse] = await Promise.all([
        API.get('/students/my-reviews'),
        API.get('/requests/my-requests')
      ]);

      const reviews = reviewsResponse.data.data || [];
      const requests = requestsResponse.data.data || [];

      setStats({
        totalReviews: reviews.length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(req => req.status === 'pending').length,
        acceptedRequests: requests.filter(req => req.status === 'accepted').length
      });

      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={fixS3ImageUrl(user?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100">Ready to continue your learning journey?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <StatCard
            icon={MessageSquare}
            title="Total Requests"
            value={stats.totalRequests}
            bgColor="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            title="Pending Requests"
            value={stats.pendingRequests}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={CheckCircle}
            title="Accepted Requests"
            value={stats.acceptedRequests}
            bgColor="bg-green-500"
          />
          <StatCard
            icon={Star}
            title="Reviews Written"
            value={stats.totalReviews}
            bgColor="bg-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/teachers"
                  className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-700 font-semibold text-lg">Find Tutors</span>
                    <p className="text-blue-600 text-sm">Browse available tutors</p>
                  </div>
                </Link>
                
                <Link
                  to="/my-requests"
                  className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-green-700 font-semibold text-lg">My Requests</span>
                    <p className="text-green-600 text-sm">Track your tutor requests</p>
                  </div>
                </Link>
                
                <Link
                  to="/my-reviews"
                  className="group flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-700 font-semibold text-lg">My Reviews</span>
                    <p className="text-purple-600 text-sm">View your reviews</p>
                  </div>
                </Link>
                
                <Link
                  to="/profile"
                  className="group flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-orange-700 font-semibold text-lg">Edit Profile</span>
                    <p className="text-orange-600 text-sm">Update your information</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                Recent Requests
              </h2>
              <div className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div key={request._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{request.teacher?.name}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Subject: {request.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No requests yet</p>
                    <Link
                      to="/teachers"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                    >
                      Find a tutor to get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;