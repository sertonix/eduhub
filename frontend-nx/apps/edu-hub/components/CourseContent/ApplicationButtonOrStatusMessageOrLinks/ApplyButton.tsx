import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

import { Course_Course_by_pk } from '../../../queries/__generated__/Course';
import { Button } from '../../common/Button';

interface IProps {
  course: Course_Course_by_pk;
  onClickApply: () => void;
}

export const ApplyButton: FC<IProps> = ({ course, onClickApply }) => {
  const { t, lang } = useTranslation('course-page');
  const now = new Date();
  now.setHours(0, 0, 0, 0); // reset hours, minutes, seconds, and milliseconds

  console.log(new Date());
  console.log(course.applicationEnd);

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <Button
        filled
        inverted
        onClick={onClickApply}
        disabled={now > course.applicationEnd}
        className="bg-edu-course-current"
      >
        {t('applyNow')}
      </Button>
      <span className="text-xs mt-4 text-white">
        {t('application_deadline')}
        {course.applicationEnd?.toLocaleDateString(lang, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) ?? ''}
        </span>
    </div>
  );
};
