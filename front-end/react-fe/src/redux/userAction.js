import { UPDATE, REMOVE } from './actionType';

export const update = (data) => ({ type: UPDATE, data: data });
export const remove = () => ({ type: REMOVE, data: {} });
