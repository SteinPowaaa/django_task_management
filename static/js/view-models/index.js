function Task(data) {
  this.id = data.id
  this.title = ko.observable(data.title);
  this.description = ko.observable(data.description);
  this.status = ko.observable(data.status);
  this.priority = ko.observable(data.priority);
  this.creator = data.creator;
  this.assigness = ko.observable(data.assignees);
}

function TaskViewModel() {
  var self = this
  self.url = 'http://127.0.0.1:8000/api/tasks/';
  self.tasks = ko.observableArray([]);

  self._populateTasks = function (data) {
    data.forEach(function (json) {
      self.tasks.push(new Task(json));
    })
  }

  // modify data do be in JSON
  self.createTask = function (task) {
    $postJSON(self.url, task).then(function (data) {
      self.tasks.push(new Task(data))
    })
  }

  self.deleteTaskDB = function (task) {
    $.ajax({
      url: self.url + task.id,
      type: 'DELETE'
    })
  }

  // modify data to be in JSON
  self.removeTask = function (task) {
    self.tasks.remove(task)
    self.deleteTaskDB(task)
  }

  self.updateTaskDB = function (task) {
    $.ajax({
      url: self.url + task.id,
      type: 'PUT',
      data: task
    })
  }

  self.init = (function () {
    $.getJSON(self.url).then(function (data) {
      self._populateTasks(data);
    });
  });
}
