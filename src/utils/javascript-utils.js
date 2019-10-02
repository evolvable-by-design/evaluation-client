import React from 'react';

export const mapObject = (object, mapper) => {
  return Object.entries(object)
    .map(([key, value]) => mapper(key, value))
    .filter(el => el !== undefined)
    .reduce(reduceObject, {});
}

export const reduceObject = (res, [key, value]) => {
  res[key] = value;
  return res;
};

export const onlyWhen = (values, toRender) => {
  if (
    values === undefined
    || (values instanceof Array && values.filter(e => e === undefined).length === 0)
  ) {
    return <React.Fragment></React.Fragment>
  } else {
    return toRender();
  }
}