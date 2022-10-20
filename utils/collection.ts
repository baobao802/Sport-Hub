import _ from 'lodash';
import { FieldData } from 'types';

export const antdFormValuesTransformer = (obj: any): FieldData[] => {
  if (typeof obj !== 'object') {
    return obj;
  }

  const result: FieldData[] = [];
  _.forIn(obj, (value, key) => {
    result.push({ name: key, value });
  });

  return result;
};
