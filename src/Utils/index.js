const UpdateItem = (id, object, data) => {
  return object.map(item => {
    if (item.id === id) {
      return { ...item, ...data };
    }
    return item;
  });
};

const GetItem = (id, object) => {
  return object.filter(item => {
    return (item.id === id);
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

const Util = {
  UpdateItem,
  GetItem,
  FilterItem,
  FilterTasks
};

export default Util;
