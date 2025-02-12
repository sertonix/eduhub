import { gql } from '@apollo/client';

export const ACHIEVEMENT_OPTION_FRAGMENT = gql`
  fragment AchievementOptionFragment on AchievementOption {
    id
    title
    description
    recordType
    documentationTemplateUrl
    evaluationScriptUrl
    csvTemplateUrl
    showScoreAuthors
  }
`;
