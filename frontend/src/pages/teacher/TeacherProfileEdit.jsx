// File: src/pages/teachers/TeacherProfileEdit.jsx
import { useState, useEffect, useContext } from "react";
import  AuthContext  from "../../context/AuthContext";
import API from "../../api/axios"; // ✅ using API consistently
import { toast } from "react-toastify";

const TeacherProfileEdit = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    subjects: "",
    qualifications: "",
    experience: "",
    hourlyRate: "",
    availability: "",
    bio: "",
    languages: "",
    teachingMode: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile"); // ✅ using API
      const profile = response.data.data;

      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        city: profile.location?.city || "",
        state: profile.location?.state || "",
        country: profile.location?.country || "",
        subjects: profile.teacherProfile?.subjects?.join(", ") || "",
        qualifications:
          profile.teacherProfile?.qualifications?.join(", ") || "",
        experience: profile.teacherProfile?.experience || "",
        hourlyRate: profile.teacherProfile?.hourlyRate || "",
        availability:
          profile.teacherProfile?.availability?.join("\n") || "",
        bio: profile.teacherProfile?.bio || "",
        languages: profile.teacherProfile?.languages?.join(", ") || "",
        teachingMode: profile.teacherProfile?.teachingMode || [],
      });
    } catch (error) {
      toast.error("Failed to load profile");
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
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Basic info
      formDataToSend.append("name", formData.name);
      if (formData.phone) formDataToSend.append("phone", formData.phone);

      // Location
      const location = {
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };
      formDataToSend.append("location", JSON.stringify(location));

      // Teacher profile fields
      if (formData.subjects) {
        const subjectsArray = formData.subjects
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        formDataToSend.append("subjects", JSON.stringify(subjectsArray));
      }

      if (formData.qualifications) {
        const qualsArray = formData.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter((q) => q);
        formDataToSend.append("qualifications", JSON.stringify(qualsArray));
      }

      if (formData.experience)
        formDataToSend.append("experience", formData.experience);
      if (formData.hourlyRate)
        formDataToSend.append("hourlyRate", formData.hourlyRate);

      if (formData.availability) {
        const availArray = formData.availability
          .split("\n")
          .map((a) => a.trim())
          .filter((a) => a);
        formDataToSend.append("availability", JSON.stringify(availArray));
      }

      if (formData.bio) formDataToSend.append("bio", formData.bio);

      if (formData.languages) {
        const langsArray = formData.languages
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l);
        formDataToSend.append("languages", JSON.stringify(langsArray));
      }

      if (formData.teachingMode.length > 0) {
        formDataToSend.append(
          "teachingMode",
          JSON.stringify(formData.teachingMode)
        );
      }

      // Profile picture
      if (profilePicture) {
        formDataToSend.append("profilePicture", profilePicture);
      }

      const response = await API.put("/teachers/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser(response.data.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Edit Teacher Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={user?.profilePicture || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects (comma-separated)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications (comma-separated)
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g., PhD in Mathematics, M.Sc. in Physics"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., English, Spanish, French"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.teachingMode.includes("online")}
                    onChange={() => handleTeachingModeChange("online")}
                    className="mr-2"
                  />
                  Online
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.teachingMode.includes("offline")}
                    onChange={() => handleTeachingModeChange("offline")}
                    className="mr-2"
                  />
                  Offline
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability (one per line)
              </label>
              <textarea
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                rows="4"
                placeholder={`Monday 9am-5pm\nWednesday 9am-5pm\nFriday 2pm-8pm`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="6"
                maxLength="1000"
                placeholder="Tell students about yourself, your teaching style, and experience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileEdit;
