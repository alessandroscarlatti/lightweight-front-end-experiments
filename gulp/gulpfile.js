const {series} = require("gulp");

function defaultTask(cb) {
 // what is cb???
	console.log("stuff is happening.");
	cb();
}

function sillyTask(cb) {
	console.log("running task");
  cb();
}

function taskA(cb) {
	console.log("doing task A");
	cb();
}
function taskB(cb) {
	console.log("doing task B");
	cb();
}
function taskC(cb) {
	console.log("doing task C");
	cb();
}

module.exports = {
	default: defaultTask,
	silly: sillyTask,
	taskA: taskA,
	taskB: taskB,
	taskC: taskC,
	tasksABC: series(taskA, taskB, taskC) 
};
