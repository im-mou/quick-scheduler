## Quick Schedule
Quick schedule is a web app that allows you to create tasks with a timer attached to them. It allows you to play, pause, edit or mark the tasks as completed.
Currently all data will be saved locally in your device using LocalStorage WebApi so be careful when clearing browser data.

This app uses React as view layer and [`flux`](https://facebook.github.io/flux/) architecture for data managment.

### Status
All tasks can have one of the following status at a time:
- Active
- Paused
- Pending
- Completed
- Deleted

### Dark mode?
Hell yes!

### What do now?
- Use React hooks instead of classes.
- Use [`FlyJson`](https://github.com/aalfiann/fly-json-odm) library to handle store data in all stores See [`TrashTaskStore.js`](src/Stores/TrashTaskStore.js).
- Add draggable reordering of pending tasks.
- Be able to tag tasks for grouping in the pending list.
- Enable/Disable task completion beep.
- Add multiple sounds for the task completion beep.
- Add date to tasks and nav element for filter by date.
- Over all Refactor, fix naming conventions.
- Create multiple sessions/boards.
- Create an iOS/android app using react-native.
