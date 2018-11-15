import { MOCK_PROPERTY } from '../constants';

export const isArray = (obj: any): obj is any[] => Array.isArray(obj);

export const isString = (obj: any): obj is string => typeof obj === 'string';

export const isFunction = (obj: any): obj is Function => typeof obj === 'function';

export const isRegExp = (obj: any): obj is RegExp => obj instanceof RegExp;

export const isObject = (obj: any): obj is object => typeof obj === 'object';

export const isMap = (obj: any): obj is Map<any, any> =>
  typeof Map !== 'undefined' && obj instanceof Map;

export const isSet = (obj: any): obj is Set<any> =>
  typeof Set !== 'undefined' && obj instanceof Set;

export const isDomElement = (obj: any) =>
  obj && obj.classList && typeof obj.classList.contains === 'function';

export const isMockFunction = (f: any) =>
  typeof f === 'function' && f.mock && f.mock[MOCK_PROPERTY];
