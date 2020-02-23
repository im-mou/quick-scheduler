import React from 'react';
import {notification, Icon} from 'antd';

const UpdateItem = (id, object, data) => {
  return object.map(item => {
    if (item.id === id) {
      return {...item, ...data};
    }
    return item;
  });
};

const GetItem = (id, object) => {
  return object.filter((item, index) => {
    return (item.id === id);
  })[0];
};

const GetItemWithIndex = (id, object) => {
  return object.map((item, i) => {
    return {...item, index: i};
  }).filter(item => {
    return item.id === id;
  })[0];
};

const FilterItem = (id, object) => {
  return object.filter(item => {
    return item.id !== id;
  });
};

const FilterTasks = (tasks, status) => {
  return tasks.filter(item => {
    return item.status === status;
  });
};

const FindItem = (taskId, object) => {
  let currItem = Util.GetItemWithIndex(taskId, object.active);
  currItem = currItem
      ? currItem
      : Util.GetItemWithIndex(taskId, object.pending);
  currItem = currItem
      ? currItem
      : Util.GetItemWithIndex(taskId, object.finished);

  return currItem;
};

const Notificacion = (message, icon) => {
  notification.open({
    message: message,
    icon: <Icon type={icon} style={{color: '#108ee9'}}/>,
  });
};

const Util = {
  UpdateItem,
  GetItem,
  GetItemWithIndex,
  FilterItem,
  FilterTasks,
  FindItem,
  Notificacion,
};

export default Util;
