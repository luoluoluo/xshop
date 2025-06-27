import { useTranslation } from "react-i18next";

export const Title = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <img className="h-8 w-auto" src="/logo.png" />
      <div>{t("title")}</div>
    </div>
  );
};
