import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Edit, User, Mail, Phone, MapPin, BookOpen, Clock, Star, Users } from 'lucide-react';

const TeacherProfileManage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    subjects: '',
    qualifications: '',
    experience: '',

    availability: '',
    bio: '',
    languages: '',
    teachingMode: [],
  });

  // Check if current user can edit this profile
  const canEdit = user && user._id === id;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/auth/profile');
      const profile = response.data.data;

      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
        subjects: profile.teacherProfile?.subjects?.join(', ') || '',
        qualifications: profile.teacherProfile?.qualifications?.join(', ') || '',
        experience: profile.teacherProfile?.experience || '',

        availability: profile.teacherProfile?.availability?.join('\n') || '',
        bio: profile.teacherProfile?.bio || '',
        languages: profile.teacherProfile?.languages?.join(', ') || '',
        teachingMode: profile.teacherProfile?.teachingMode || [],
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeachingModeChange = (mode) => {
    const modes = [...formData.teachingMode];
    const index = modes.indexOf(mode);
    if (index > -1) {
      modes.splice(index, 1);
    } else {
      modes.push(mode);
    }
    setFormData({ ...formData, teachingMode: modes });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.name || !formData.name.trim()) {
        setError('Name is required');
        return;
      }
      
      console.log('Starting form submission with data:', formData);
      const formDataToSend = new FormData();

      // Basic info
      if (formData.name && formData.name.trim()) {
        formDataToSend.append('name', formData.name);
      }
      formDataToSend.append('phone', formData.phone);

      // Location
      if (formData.city || formData.state || formData.country) {
        const location = {
          city: formData.city,
          state: formData.state,
          country: formData.country,
        };
        formDataToSend.append('location', JSON.stringify(location));
      }

      // Teacher profile fields
      console.log('Processing subjects:', formData.subjects);
      if (formData.subjects && formData.subjects.trim()) {
        const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
        console.log('Subjects array:', subjectsArray);
        if (subjectsArray.length > 0) {
          const subjectsJSON = JSON.stringify(subjectsArray);
          console.log('Subjects JSON:', subjectsJSON);
          formDataToSend.append('subjects', subjectsJSON);
        }
      } else {
        console.log('No subjects to process');
      }

      if (formData.qualifications && formData.qualifications.trim()) {
        const qualsArray = formData.qualifications.split(',').map(q => q.trim()).filter(q => q);
        if (qualsArray.length > 0) {
          formDataToSend.append('qualifications', JSON.stringify(qualsArray));
        }
      }

      if (formData.experience && formData.experience !== '')
        formDataToSend.append('experience', formData.experience);


      if (formData.availability && formData.availability.trim()) {
        const availArray = formData.availability.split('\n').map(a => a.trim()).filter(a => a);
        if (availArray.length > 0) {
          formDataToSend.append('availability', JSON.stringify(availArray));
        }
      }

      formDataToSend.append('bio', formData.bio);

      if (formData.languages && formData.languages.trim()) {
        const langsArray = formData.languages.split(',').map(l => l.trim()).filter(l => l);
        if (langsArray.length > 0) {
          formDataToSend.append('languages', JSON.stringify(langsArray));
        }
      }

      if (formData.teachingMode.length > 0) {
        formDataToSend.append('teachingMode', JSON.stringify(formData.teachingMode));
      }

      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      console.log('Sending FormData to server...');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await API.put('/teachers/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Server response:', response.data);

      const updatedUser = { ...user, ...response.data.data };
      updateUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setProfilePicture(null);
      setImagePreview(null);
      
      // Refresh the page to show updated image
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-center">
            <img
              src={imagePreview || (imageError ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" : user.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt={user.name}
              className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
              onError={() => setImageError(true)}
            />
            <h1 className="mt-4 text-3xl font-bold text-white">{user.name}</h1>
            <p className="mt-2 text-blue-100">{user.email}</p>
            <span className="inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-gray-900">
              Tutor
            </span>
            
            {canEdit && (
              <div className="mt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setImagePreview(null);
                      setProfilePicture(null);
                      fetchProfile(); // Reset form data
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Teaching Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="1000"
                  placeholder="Tell students about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* Read-only View */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{user.name || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{user.location?.city || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {user.teacherProfile && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Subjects</p>
                        <p className="font-medium">{user.teacherProfile.subjects?.join(', ') || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">{user.teacherProfile.experience || 0} years</p>
                      </div>
                    </div>
                    

                    
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-medium">{user.teacherProfile.averageRating?.toFixed(1) || '0.0'} ⭐</p>
                      </div>
                    </div>
                  </div>
                  
                  {user.teacherProfile.bio && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-2">Bio</p>
                      <p className="text-gray-800">{user.teacherProfile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileManage;