// Utility function to fix S3 SSL certificate issues
export const fixS3ImageUrl = (url) => {
  if (!url) return null;
  
  // Fix S3 SSL certificate issue by converting virtual-hosted-style to path-style URLs
  if (url.includes('gurukulam2.1.s3.ap-south-1.amazonaws.com')) {
    return url.replace(
      'https://gurukulam2.1.s3.ap-south-1.amazonaws.com/',
      'https://s3.ap-south-1.amazonaws.com/gurukulam2.1/'
    );
  }
  
  return url;
};

// Get profile picture with fallback
export const getProfilePicture = (user, defaultImage = "https://cdn-icons-png.flaticon.com/512/847/847969.png") => {
  const profileUrl = user?.profilePicture || user?.photoURL;
  return fixS3ImageUrl(profileUrl) || defaultImage;
};