import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { Star, MapPin, Clock, DollarSign, BookOpen, Users } from 'lucide-react';

const TeacherProfileView = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchTeacher();
    setImageError(false);
  }, [id]);

  useEffect(() => {
    // Refresh data when component becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTeacher();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchTeacher = async () => {
    try {
      const response = await API.get(`/teachers/${id}`);
      setTeacher(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher not found</h2>
          <p className="text-gray-600">The teacher profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-center">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt={teacher.name}
                className="w-32 h-32 rounded-full absolute inset-0 border-4 border-white shadow-lg object-cover"
              />
              {teacher.profilePicture && teacher.profilePicture !== "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" && (
                <img
                  src={teacher.profilePicture}
                  alt={teacher.name}
                  className="w-32 h-32 rounded-full absolute inset-0 border-4 border-white shadow-lg object-cover opacity-0 transition-opacity duration-300"
                  onLoad={(e) => e.target.style.opacity = '1'}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">{teacher.name}</h1>
            <p className="mt-2 text-blue-100">{teacher.email}</p>
            <div className="flex items-center justify-center mt-4">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="text-white font-semibold">
                {teacher.teacherProfile?.averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-blue-200 ml-2">
                ({teacher.teacherProfile?.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {teacher.teacherProfile?.bio || 'No bio available.'}
              </p>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {teacher.teacherProfile?.subjects?.length > 0 ? (
                  teacher.teacherProfile.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects listed</p>
                )}
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h2>
              <div className="space-y-2">
                {teacher.teacherProfile?.qualifications?.length > 0 ? (
                  teacher.teacherProfile.qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-center">
                      <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-gray-700">{qualification}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No qualifications listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-4">


                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">{teacher.teacherProfile?.experience || 0} years</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Students Taught</p>
                    <p className="font-semibold">{teacher.teacherProfile?.totalStudents || 0}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">
                      {teacher.location?.city || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Mode */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Teaching Mode</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.teacherProfile?.teachingMode?.length > 0 ? (
                  teacher.teacherProfile.teachingMode.map((mode, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize"
                    >
                      {mode}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Not specified</p>
                )}
              </div>
            </div>

            {/* Languages */}
            {teacher.teacherProfile?.languages?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.teacherProfile.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileView;