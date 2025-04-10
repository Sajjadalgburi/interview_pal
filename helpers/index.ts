import dayjs from "dayjs";

export const normalizeType = (type: string): string => {
  return /mix/gi.test(type.toLowerCase()) ? "Mixed" : type;
};

export const formatDate = (data: string | Date): string => {
  return dayjs(data).format("MMM D, YYYY");
};
