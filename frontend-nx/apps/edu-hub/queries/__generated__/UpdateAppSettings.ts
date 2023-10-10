/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAppSettings
// ====================================================

export interface UpdateAppSettings_update_AppSettings_by_pk {
  __typename: "AppSettings";
  /**
   * Background color for the dismissiable banner displayed on the homepage
   */
  bannerBackgroundColor: string | null;
  /**
   * Font color for the text in the dismissiable banner displayed on the homepage
   */
  bannerFontColor: string | null;
  /**
   * German version for the text of a dismissiable banner on the homepage
   */
  bannerTextDe: string | null;
  /**
   * English version for the text of a dismissiable banner on the homepage
   */
  bannerTextEn: string | null;
  id: number;
}

export interface UpdateAppSettings {
  /**
   * update single row of the table: "AppSettings"
   */
  update_AppSettings_by_pk: UpdateAppSettings_update_AppSettings_by_pk | null;
}

export interface UpdateAppSettingsVariables {
  bannerBackgroundColor?: string | null;
  bannerFontColor?: string | null;
  bannerTextDe?: string | null;
  bannerTextEn?: string | null;
  id: number;
}
