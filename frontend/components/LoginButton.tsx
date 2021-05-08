import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./common/Button";

export const LoginButton: FC = () => {
  const { t } = useTranslation();

  return <Button>{t("loginButton.title")}</Button>;
  // return (
  //   <div className="flex border-2 border-edu-black rounded-full items-center sm:border-none">
  //     <span className="mx-6">{t("loginButton.title")}</span>
  //   </div>
  // );
};
