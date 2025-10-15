import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import TeacherCard from '../components/TeacherCard';

const Home = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            const { data } = await API.get('/teachers');
            setTeachers(data);
        };
        fetchTeachers();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Find Your Tutor</h1>
            {/* Add Filter UI here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map(teacher => (
                    <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
            </div>
        </div>
    );
};
export default Home;