export const mapObject = (object, mapper) => {
  return Object.entries(object)
  .map(([key, value]) => {
    return [key, value];
  })
    .map(([key, value]) => mapper(key, value))
    .filter(el => el !== undefined)
    .reduce((res, [key, value]) => {
      res[key] = value;
      return res;
    }, {});
}