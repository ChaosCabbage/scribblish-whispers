export const ensure = <T>(item: T | undefined, message: string): T => {
  if (item === undefined) {
    throw new Error(message);
  }
  return item;
};
