import { useTranslation } from "react-i18next";
import { BASE_PATH } from "../../config/constant";

export const Title = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <img className="h-8 w-auto" src={`${BASE_PATH}/logo.png`} />
      <div>{t("title")}</div>
    </div>
  );
};
