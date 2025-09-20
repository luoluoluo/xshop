// 时间工具函数
export const getDateRange = (type: "day" | "week" | "month") => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (type) {
    case "day":
      return {
        startDate: today.toISOString(),
        endDate: new Date(
          today.getTime() + 24 * 60 * 60 * 1000 - 1,
        ).toISOString(),
        previousStartDate: new Date(
          today.getTime() - 24 * 60 * 60 * 1000,
        ).toISOString(),
        previousEndDate: new Date(today.getTime() - 1).toISOString(),
      };

    case "week":
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfWeek);
      endOfLastWeek.setDate(startOfWeek.getDate() - 1);
      endOfLastWeek.setHours(23, 59, 59, 999);

      return {
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        previousStartDate: startOfLastWeek.toISOString(),
        previousEndDate: endOfLastWeek.toISOString(),
      };

    case "month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      endOfLastMonth.setHours(23, 59, 59, 999);

      return {
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        previousStartDate: startOfLastMonth.toISOString(),
        previousEndDate: endOfLastMonth.toISOString(),
      };

    default:
      throw new Error("Invalid date range type");
  }
};

export const formatDateRange = (type: "day" | "week" | "month") => {
  const now = new Date();

  switch (type) {
    case "day":
      return {
        current: "今日",
        previous: "昨日",
      };

    case "week":
      return {
        current: "本周",
        previous: "上周",
      };

    case "month":
      return {
        current: "本月",
        previous: "上月",
      };

    default:
      return {
        current: "",
        previous: "",
      };
  }
};
