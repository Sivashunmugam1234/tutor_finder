import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import TeacherCard from '../components/TeacherCard';
import '../css/home.css';

const Home = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/teachers').then(res => setTeachers(res.data));
  }, []);

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const [categories, setCategories] = useState([
    { name: 'Web Development', color: 'from-purple-500 to-indigo-400' },
    { name: 'Digital Marketing', color: 'from-cyan-400 to-blue-400' },
    { name: 'Graphic Design', color: 'from-pink-400 to-rose-500' },
    { name: 'Data Science', color: 'from-green-400 to-emerald-500' }
  ]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedClassType, setSelectedClassType] = useState('all');

  const colorOptions = [
    'from-purple-500 to-indigo-400',
    'from-cyan-400 to-blue-400',
    'from-pink-400 to-rose-500',
    'from-green-400 to-emerald-500',
    'from-orange-400 to-red-500',
    'from-yellow-400 to-orange-500',
    'from-teal-400 to-cyan-500',
    'from-indigo-500 to-purple-600'
  ];

  const liveClasses = [
    {
      id: 1,
      name: 'Personal Trainer - by Arti Y Advait',
      image: 'example',
      reviews: 6,
      date: 'Sun, 19 Oct at 03:00pm IST',
      type: 'live',
      days: '00',
      hours: '01',
      mins: '28',
      secs: '08'
    },
    {
      id: 2,
      name: 'Vocal Music classes - Hindustani Singing by Aniket Barua',
      image: 'example',
      reviews: 18,
      date: 'Sun, 19 Oct at 04:00pm IST',
      type: 'live',
      days: '00',
      hours: '02',
      mins: '28',
      secs: '08'
    },
    {
      id: 3,
      name: 'Yoga Classes - by Radha Rani',
      image: 'example',
      reviews: 46,
      date: 'Sun, 19 Oct at 04:00pm IST',
      type: 'offline',
      location: 'Chennai, Tamil Nadu',
      days: '00',
      hours: '02',
      mins: '28',
      secs: '08'
    },
    {
      id: 4,
      name: 'Guitar Masterclass - by Rohan Mehta',
      image: 'example',
      reviews: 32,
      date: 'Mon, 20 Oct at 06:00pm IST',
      type: 'offline',
      location: 'Mumbai, Maharashtra',
      days: '01',
      hours: '03',
      mins: '15',
      secs: '45'
    }
  ];

  const filteredClasses = liveClasses.filter(classItem => {
    if (selectedClassType === 'all') return true;
    return classItem.type === selectedClassType;
  });

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      setCategories([...categories, { name: newCategoryName, color: randomColor }]);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const featuredProfiles = [
    {
      id: 1,
      name: 'Jayashree V.',
      subject: 'Korean Language classes',
      image: 'example',
      reviews: 23
    },
    {
      id: 2,
      name: 'Shikha N.',
      subject: 'Vocal Music classes',
      image: 'example',
      reviews: 13
    },
    {
      id: 3,
      name: 'Abrar Ahmad',
      subject: 'Class 12 Tuition',
      image: 'example',
      reviews: 40
    },
    {
      id: 4,
      name: 'Mohini Sinha',
      subject: 'Painting Classes',
      image: 'example',
      reviews: 30
    },
    {
      id: 5,
      name: 'Vinay Raj Katakam',
      subject: 'Class 11 Tuition',
      image: 'example',
      reviews: 91
    },
    {
      id: 6,
      name: 'Raktim Dey',
      subject: 'Vocal Music classes',
      image: 'example',
      reviews: 108
    }
  ];

  const studentReviews = [
    {
      id: 1,
      teacherName: 'Gopal',
      teacherImage: 'example',
      reviewedBy: 'Tanwarpal',
      subject: 'German Language',
      reviewText: 'I highly recommend this German teacher! Their lessons are engaging and well-structured, making complex grammar concepts easy to understand. They create a supportive learning environment where students feel comfortable practicing their speaking skills. They\'re patient, k'
    },
    {
      id: 2,
      teacherName: 'Dr. Tahira',
      teacherImage: 'example',
      reviewedBy: 'Sumit',
      subject: 'Class 9 Tuition',
      reviewText: 'Good learning experience, good teaching experience forms her, I like the way she teaches, easy to interact.'
    },
    {
      id: 3,
      teacherName: 'Janak Dodia',
      teacherImage: 'example',
      reviewedBy: 'Ildiko',
      subject: 'Yoga',
      reviewText: 'I highly recommend him as a yoga instructor. He is always well-prepared, kind, and highly professional. What I appreciate most is that he truly listens and adapts the sessions to what matters to me personally. Every class feels thoughtful and supportive. He consistent!'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Join Live Online or Offline Classes with the best Tutors
        </h1>

        {/* Search Box */}
        <div className="search-container">
          <input
            type="text"
            placeholder="What do you want to learn?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="demo-button">
            Book a Demo Class →
          </button>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">0 </span>
            <span className="stat-label">Verified Tutors</span>
          </div>
          <div className="stat-item stat-divider">
            <span className="stat-number">3 </span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat-item stat-divider">
            <span className="stat-number">4 </span>
            <span className="stat-label">Reviews</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="home-container">
        <div className="category-header">
          <h2 className="section-title">Popular Categories</h2>
          <button
            onClick={() => setShowAddCategory(true)}
            className="add-category-btn"
          >
            <span className="plus-icon">+</span>
            Add Category
          </button>
        </div>

        {showAddCategory && (
          <div className="add-category-form">
            <input
              type="text"
              placeholder="Enter category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              className="category-input"
            />
            <button onClick={handleAddCategory} className="btn-add">
              Add
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryName('');
              }}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="category-grid">
          {categories.map((cat, i) => (
            <div key={i} className={`category-card bg-gradient-to-br ${cat.color}`}>
              <button
                onClick={() => handleRemoveCategory(i)}
                className="remove-category-btn"
              >
                ×
              </button>
              <h3 className="category-title">{cat.name}</h3>
              <div className="category-divider"></div>
            </div>
          ))}
        </div>

        <div className="teacher-grid">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher._id} teacher={teacher} />
          ))}
        </div>
      </div>

      {/* Classes Section */}
      <div className="classes-section">
        <div className="classes-header">
          <h2 className="section-title">Available Classes</h2>
          
          <div className="class-filter-buttons">
            <button
              onClick={() => setSelectedClassType('all')}
              className={`filter-btn ${selectedClassType === 'all' ? 'active' : ''}`}
            >
              All Classes
            </button>
            <button
              onClick={() => setSelectedClassType('live')}
              className={`filter-btn ${selectedClassType === 'live' ? 'active live' : ''}`}
            >
              Live Online
            </button>
            <button
              onClick={() => setSelectedClassType('offline')}
              className={`filter-btn ${selectedClassType === 'offline' ? 'active offline' : ''}`}
            >
              Offline
            </button>
          </div>
        </div>

        <div className="live-classes-grid">
          {filteredClasses.map((classItem) => (
            <div key={classItem.id} className="live-class-card">
              <div className="live-class-image-container">
                <img src={classItem.image} alt={classItem.name} className="live-class-image" />
                <div className={`class-badge ${classItem.type}`}>
                  {classItem.type === 'live' ? ' LIVE' : ' OFFLINE'}
                </div>
              </div>

              <div className="live-class-content">
                <h3 className="live-class-title">{classItem.name}</h3>

                <div className="live-class-rating">
                  <span className="stars">★★★★★</span>
                  <span className="reviews">({classItem.reviews} reviews)</span>
                </div>

                <div className="live-class-date">
                 
                  <span>{classItem.date}</span>
                </div>

                {classItem.type === 'offline' && (
                  <div className="live-class-location">
                    
                    <span>{classItem.location}</span>
                  </div>
                )}

                <div className="class-starts-label">Class starts in</div>

                <div className="timer-container">
                  <div className="timer-item">
                    <div className="timer-number">{classItem.days}</div>
                    <div className="timer-label">Days</div>
                  </div>
                  <div className="timer-item">
                    <div className="timer-number">{classItem.hours}</div>
                    <div className="timer-label">Hour</div>
                  </div>
                  <div className="timer-item">
                    <div className="timer-number">{classItem.mins}</div>
                    <div className="timer-label">Min</div>
                  </div>
                  <div className="timer-item">
                    <div className="timer-number">{classItem.secs}</div>
                    <div className="timer-label">Sec</div>
                  </div>
                </div>

                <button className="register-button">📝 Register Now</button>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <a href="#" className="view-all-link">View all →</a>
        </div>
      </div>

      {/* Featured Profiles Section */}
      <div className="featured-profiles-section">
        <h2 className="section-title">Featured Profiles</h2>

        <div className="featured-profiles-grid">
          {featuredProfiles.map((profile) => (
            <div key={profile.id} className="featured-profile-card">
              <img src={profile.image} alt={profile.name} className="profile-image" />
              <h3 className="profile-name">{profile.name}</h3>
              <p className="profile-subject">{profile.subject}</p>
              <div className="profile-rating">
                <span className="stars">★★★★★</span>
                <span className="reviews">{profile.reviews} reviews</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Reviews Section */}
      <div className="student-reviews-section">
        <h2 className="section-title">Recent Reviews from Students</h2>

        <div className="reviews-grid">
          {studentReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <img src={review.teacherImage} alt={review.teacherName} className="review-teacher-image" />
                <div>
                  <h3 className="review-teacher-name">{review.teacherName}</h3>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>

              <p className="review-meta">
                Reviewed by {review.reviewedBy} for {review.subject}
              </p>

              <p className="review-text">"{review.reviewText}"</p>

              <a href="#" className="review-more-link">...more</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;