import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ContentRow } from '../common/ContentRow';

import { CourseEnrollmentStatus_enum } from '../../__generated__/globalTypes';
import { useAuthedQuery } from '../../hooks/authedQuery';
import { CourseWithEnrollment_Course_by_pk } from '../../queries/__generated__/CourseWithEnrollment';
import { LOAD_ACHIEVEMENT_CERTIFICATE } from '../../queries/loadAchievementCertificate';
import { LOAD_PARTICIPATION_CERTIFICATE } from '../../queries/loadParticipationCertificate';
import { Button } from '../common/Button';

import {
  loadAchievementCertificate,
  loadAchievementCertificateVariables,
} from 'apps/edu-hub/queries/__generated__/loadAchievementCertificate';
import {
  loadParticipationCertificate,
  loadParticipationCertificateVariables,
} from 'apps/edu-hub/queries/__generated__/loadParticipationCertificate';

import {
  getEndTimeString,
  getStartTimeString,
  getWeekdayString,
} from '../../helpers/dateHelpers';
// import { Course_Course_by_pk } from '../../queries/__generated__/Course';

import { Attendances } from './Attendances';
import CourseAchievementOption from './course-achievement-option/CourseAchievementOption';

interface IProps {
  // course: Course_Course_by_pk | CourseWithEnrollment_Course_by_pk;
  course: CourseWithEnrollment_Course_by_pk;
}

export const CourseParticipationBlock: FC<IProps> = ({ course }) => {
  const { t, lang } = useTranslation();
  const { t: tLanguage } = useTranslation('common');

  const startTime = getStartTimeString(course, lang);
  const endTime = getEndTimeString(course, lang);

  const courseEnrollment = course.CourseEnrollments[0];

  const {
    data: loadAchievementCertificateData,
    loading: loadAchievementCerfificateLoading,
  } = useAuthedQuery<
    loadAchievementCertificate,
    loadAchievementCertificateVariables
  >(LOAD_ACHIEVEMENT_CERTIFICATE, {
    variables: {
      path: courseEnrollment?.achievementCertificateURL,
    },
    skip: !courseEnrollment?.achievementCertificateURL,
  });

  const {
    data: loadParticipationCertificateData,
    loading: loadParticipationCerfificateLoading,
  } = useAuthedQuery<
    loadParticipationCertificate,
    loadParticipationCertificateVariables
  >(LOAD_PARTICIPATION_CERTIFICATE, {
    variables: {
      path: courseEnrollment?.attendanceCertificateURL,
    },
    skip: !courseEnrollment?.attendanceCertificateURL,
  });

  let content = null;

  if (
    courseEnrollment.status === CourseEnrollmentStatus_enum.CONFIRMED ||
    courseEnrollment.status === CourseEnrollmentStatus_enum.COMPLETED
  ) {
    content = (
      <>
        {loadAchievementCertificateData &&
          !loadAchievementCerfificateLoading && (
            <Button
              as="a"
              filled
              href={
                loadAchievementCertificateData.loadAchievementCertificate.link
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('achievementCertificateDownload')}
            </Button>
          )}

        {loadParticipationCertificateData &&
          !loadParticipationCerfificateLoading && (
            <Button
              as="a"
              filled
              href={
                loadParticipationCertificateData.loadParticipationCertificate
                  .link
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('attendanceCertificateDownload')}
            </Button>
          )}

        <ContentRow
          className="my-24 text-white"
          leftTop={
            <div className="flex flex-1">
              <Attendances course={course} />
            </div>
          }
          rightBottom={
            <div className="flex flex-1">
              {course.achievementCertificatePossible && (
                <CourseAchievementOption
                  courseId={course.id}
                  achievementRecordUploadDeadline={
                    course.Program.achievementRecordUploadDeadline
                  }
                  courseTitle={course.title}
                  t={t}
                />
              )}
            </div>
          }
        />
      </>
    );
  } else {
    content = null;
  }

  return (
    <>
      <div className="mx-auto">{content}</div>{' '}
    </>
  );
};
