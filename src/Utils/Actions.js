import { TASK_STATES } from "./Constants";
// function tick(){
//   this.setState({
//     diff: new Date(+new Date() - this.state.startTS),
//     interval: requestAnimationFrame(this.tick)
//   });
// }

// function play(taskId, state, cb) {
//   if (TASK_STATES.ACTIVE) {
//     // prevent multi clicks on start
//     return;
//   }
//   let newTasks = updateItem(taskId, state.tasks, {
//     timer: +new Date(),
//     status: TASK_STATES.ACTIVE,
//     isPaused: false,
//     interval: requestAnimationFrame(tick(taskId, state.tasks)),
//   });

//   return {
//     ...state,
//     tasks: newTasks
//   };
// }
// function pause(taskId, state) {
//   let newTasks = updateItem(taskId, state.tasks, {
//     isPaused: true,
//     status: TASK_STATES.PENDNING
//   });

//   return {
//     ...state,
//     tasks: newTasks
//   };
// }
// function done(taskId, state) {
//   let newTasks = updateItem(taskId, state.tasks, {
//     isPaused: false,
//     status: TASK_STATES.FINISHED
//   });

//   return {
//     ...state,
//     tasks: newTasks
//   };
// }
// function restart(taskId, state) {
//   let newTasks = updateItem(taskId, state.tasks, {
//     isPaused: false,
//     suspended: 0,
//     status: TASK_STATES.ACTIVE
//   });

//   return {
//     ...state,
//     tasks: newTasks
//   };
// }
// function remove(taskId, state) {
//   return {
//     ...state,
//     tasks: state.tasks.filter(item => {
//       return item.id !== taskId;
//     })
//   };
// }



export const Actions = {
  // play,
  // pause,
  // done,
  // restart,
  // remove,
};