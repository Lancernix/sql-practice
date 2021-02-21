import { UPDATE, REMOVE } from './actionType';

let userInfo = localStorage.getItem('user-info')
  ? JSON.parse(localStorage.getItem('user-info'))
  : {};

const initState = {
  no: userInfo.no,
  name: userInfo.name,
  isSuper: userInfo.isSuper,
  finished: userInfo.finished,
};

const userReducer = (preState = initState, action) => {
  const { type, data } = action;
  switch (type) {
    case UPDATE:
      return { ...data };
    case REMOVE:
      return data;
    default:
      return preState;
  }
};

export default userReducer;
