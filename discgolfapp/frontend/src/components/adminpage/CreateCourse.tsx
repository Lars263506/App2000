import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import CourseForm from './CourseForm';
import Course from '../../types/course';

interface User {
  id: string;
  name: string;
}

const CreateCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Ingen tilgangstoken funnet');
        }

        // Sjekk autorisasjon
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (authResponse.status === 200) {
          const authData = await authResponse.json();
          setIsAuthorized(authData.hasAccess);
        } else {
          setIsAuthorized(false);
          throw new Error('Autorisasjon feilet: Status ' + authResponse.status);
        }

        // Hent baner
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const coursesUrl = userRole === 'admin' ? `${baseUrl}/course` : `${baseUrl}/course/owner`;

        const coursesResponse = await fetch(coursesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!coursesResponse.ok) {
          throw new Error(`Kunne ikke hente baner: Status ${coursesResponse.status}`);
        }

        const coursesData = await coursesResponse.json();
        console.log('Fetched courses:', coursesData); // Logg rådata

        // Map baner og sikre id
        const mappedCourses = (coursesData.data || coursesData).map((course: { _id?: string; id?: string; name: string; location: string; town: string; postCode: string; [key: string]: unknown }) => ({
          ...course,
          id: course._id || course.id,
        }));

        setCourses(mappedCourses);
      } catch (error) {
        toast.error(t('createcourse_toast_error_fetch_courses' + error));
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userRole, userId]);

  useEffect(() => {
    const fetchClubOwners = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/clubowners`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch club owners: ${response.status}`);
        }

        const data: { data: User[] } = await response.json();
        setUsers(data.data);
        console.log(users);
      } catch (error) {
        toast.error(t('createcourse_toast_error_fetch_clubowners' + error));
      }
    };

    if (userRole === 'admin') {
      fetchClubOwners();
    }
  }, [userRole]);

  const handleCreateNew = () => {
    setSelectedCourse(null);
    setIsCreating(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
    setIsCreating(false);
  };

  const handleSave = (savedCourse: Course) => {
    setCourses((prev) =>
      savedCourse.id
        ? prev.map((c) => (c.id === savedCourse.id ? { ...savedCourse } : c))
        : [...prev, { ...savedCourse, id: savedCourse.id || `${Date.now()}` }]
    );
    setSelectedCourse(null);
    setIsCreating(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Er du sikker på at du vil slette denne banen?')) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Kunne ikke slette banen: Status ${response.status}`);
      }

      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success(t('createcourse_toast_success_deleted_course'));
    } catch (error) {
      toast.error(t('createcourse_toast_error_delete_course' + error));
    }
  };

  if (isLoading) {
    return <div className="p-4">{t('loading_courses')}</div>;
  }

  if (!isAuthorized) {
    return <div className="p-4 text-red-600">{t('no_access')}</div>;
  }

  if (isCreating || selectedCourse) {
    return (
      <CourseForm
        course={selectedCourse}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md min-h-[100vh]">
      <h2 className="text-xl font-bold mb-4">{t('createcourse_manage_courses')}</h2>
      <button
        onClick={handleCreateNew}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {t('createcourse_create_new_course')}
      </button>
      {courses.length === 0 ? (
        <p>{t('no_courses_available')}</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((course) => (
            <li
              key={course.id}
              className="flex justify-between items-center p-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              <span
                onClick={() => handleEditCourse(course)}
                className="flex-1"
              >
                {course.name} ({course.town})
              </span>
              <button
                onClick={() => handleDeleteCourse(course.id!)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                {t('createcourse_delete')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateCourse;
