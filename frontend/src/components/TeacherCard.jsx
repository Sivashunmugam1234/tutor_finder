import { Link } from 'react-router-dom';
// import RatingStars from './RatingStars'; // You'd create this component

const TeacherCard = ({ teacher }) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow">
            <img src={teacher.profilePicture} alt={teacher.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center">{teacher.name}</h3>
            <p className="text-center text-gray-600">{teacher.teacherProfile.subjects.join(', ')}</p>
            <div className="text-center my-2">
                {/* <RatingStars rating={teacher.teacherProfile.averageRating} /> */}
                <span>{teacher.teacherProfile.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-center font-bold text-lg">${teacher.teacherProfile.hourlyRate}/hr</p>
            <Link to={`/teacher/${teacher._id}`} className="block w-full text-center bg-blue-500 text-white py-2 rounded mt-4">
                View Profile
            </Link>
        </div>
    );
};
export default TeacherCard;