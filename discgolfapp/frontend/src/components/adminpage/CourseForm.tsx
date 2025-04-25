/**
 * CourseForm Component
 * Allows users to create or edit a golf course.
 * Shows appropriate fields and handles save/cancel logic.
 * 
 * @author Andreas Nilsen
 */

/**
 * Copilot has been used to generate the code for the functions and comments,
 * but all content has been reviewed and edited to ensure accuracy and alignment
 * with the project's requirements.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Course from '@/types/course'; 

/**
 * Props for the CourseForm component
 * @author Andreas Nilsen
 */
interface CourseFormProps {
  course?: Course | null;
  onCancel?: () => void;
  onSave?: (course: Course) => void;
}

/**
 * CourseForm functional component
 * @param {CourseFormProps} props - Contains optional course object, and handlers for save/cancel
 * @returns JSX.Element
 * @author Andreas Nilsen
 */
const CourseForm: React.FC<CourseFormProps> = ({ course = null, onCancel, onSave }) => {
  const { t } = useTranslation();

  // State management for all course fields
  const [name, setName] = useState(course?.name || '');
  const [location, setLocation] = useState(course?.location || '');
  const [town, setTown] = useState(course?.town || '');
  const [postCode, setPostCode] = useState(course?.postCode || '');
  const [url, setUrl] = useState(course?.url || '');
  const [latitude, setLatitude] = useState<number | ''>(course?.latitude || '');
  const [longitude, setLongitude] = useState<number | ''>(course?.longitude || '');
  const [difficulty, setDifficulty] = useState(course?.difficulty || 'Medium');
  const [familyFriendly, setFamilyFriendly] = useState(course?.familyFriendly || false);
  const [holes, setHoles] = useState<number | ''>(course?.holes || '');
  const [courseOwner, setCourseOwner] = useState(course?.courseOwner || '');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  /**
   * useEffect hook to check user authorization
   * Sets `isAuthorized` if user has the right access
   * @author Andreas Nilsen
   */
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/has-access`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data.hasAccess) {
            setIsAuthorized(true);
            if (userRole === 'clubowner' && !course?.courseOwner) {
              setCourseOwner(userId || '');
            }
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
          throw new Error(t('courseform_error_authorization_failed') + response.status);
        }
      } catch (error) {
        toast.error(t('courseform_toast_error_authorization_failed' + error));
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [userRole, userId, course]);

  /**
   * Handles saving the course
   * Validates input fields and sends POST/PUT request to backend
   * Calls `onSave` on success
   * @author Andreas Nilsen
   */
  const handleSaveCourse = async () => {
    if (!name || !location || !town || !postCode || !difficulty || familyFriendly === undefined) {
      toast.error(t('courseform_toast_error_missing_fields'));
      return;
    }

    const newCourse = {
      id: course?.id,
      name,
      location,
      town,
      postCode,
      difficulty,
      familyFriendly,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      url: url || undefined,
      holes: holes || undefined,
      courseOwner 
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course${course?.id ? `/${course.id}` : ''}`,
        {
          method: course?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newCourse),
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to save course.');
      }

      const saved = await response.json();
      toast.success(t('courseform_toast_success_course_created'));
      onSave?.(saved.data || saved);
    } catch (error) {
      toast.error(t('courseform_toast_error_creation_failed' + error));
    }
  };

  // If user is not authorized, display error message
  if (!isAuthorized) {
    return <div className="p-4 text-red-600">You do not have access to manage courses.</div>;
  }

  // Main form JSX
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">{course ? t('courseform_edit_course') : t('courseform_create_new_course')}</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* All form fields below, no logic comments needed since controlled by hooks above */}
        <input
          type="text"
          placeholder={t('courseform_name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder={t('courseform_location')}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder={t('courseform_town')}
          value={town}
          onChange={(e) => setTown(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder={t('courseform_postcode')}
          value={postCode}
          onChange={(e) => setPostCode(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder={t('courseform_url')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder={t('courseform_latitude')}
          value={latitude}
          onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder={t('courseform_longitude')}
          value={longitude}
          onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))}
          className="p-2 border rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Easy">{t('courseform_easy')}</option>
          <option value="Medium">{t('courseform_medium')}</option>
          <option value="Hard">{t('courseform_hard')}</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={familyFriendly}
            onChange={(e) => setFamilyFriendly(e.target.checked)}
          />
          <label>{t('courseform_family_friendly')}</label>
        </div>
        <input
          type="number"
          placeholder={t('courseform_courseholes')}
          value={holes}
          onChange={(e) => setHoles(e.target.value === '' ? '' : Number(e.target.value))}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder={t('courseform_owner')}
          value={courseOwner}
          onChange={(e) => setCourseOwner(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSaveCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t('courseform_save_course')}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            {t('courseform_cancel')}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseForm;
