let lastId = 0;
// 自增id
export const genId = function (): string {
  const id = new Date().getTime();
  if (id > lastId) {
    lastId = id;
    return String(id);
  } else {
    lastId += 1;
    return String(lastId);
  }
};
