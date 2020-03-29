## Quick Schedule
Quick schedule is a web app that allows you to create tasks with a timer atached to them. It allows you to play, pause, edit or mark the tasks as complete.
Currently all data will be saved locally in your device using LocalStorage so be careful when clearing browser data.

This app uses React as view layer and [`flux`](https://facebook.github.io/flux/) architecture for the app data managment.

### Status
All tasks can have one of the following status at a time:
- Active
- Paused
- Pending
- Completed
- Deleted


### Work to be done
- Use React hooks instead of classes.
- Use [`FlyJson`](https://github.com/aalfiann/fly-json-odm) library to handle store data in all stores See [`TrashTaskStore.js`](Stores/TrashTaskStore.js).
- Enable/Disable task completion beep.
- Add multiple sounds for the task completion beep.
- Add draggble reordering of pending tasks.
- Refactor.

### Dark mode?
Hell yes!