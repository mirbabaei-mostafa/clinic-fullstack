import React from "react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  return <div className="flex flex-col">{t("Login")}</div>;
};

export default Login;
