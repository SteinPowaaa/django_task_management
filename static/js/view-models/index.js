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
  self.tasks_url = '/api/tasks/';
  self.users_url = '/api/users/';
  self.tasks = ko.observableArray([]);

  self.init = function () {
    $.getJSON(self.tasks_url).then(function (data) {
      self._populateTasks(data);
    })
  }

  self._populateTasks = function (data) {
    self.tasks = data.map(function (taskData) {
      return new Task(taskData)
    });
    self.tasks(tasks);
    data.forEach(function (json) {
      self.tasks.push(new Task(json));
    })
  }

  self.createTask = function (task) {
    $.post(self.tasks_url, {}).then(function (data) {
      self.tasks.push(new Task(data));
    });
  }

  self.deleteTask = function (task) {
    return $.ajax({
      url: self.tasks_url + task.id,
      type: 'DELETE'
    })
  }

  // modify data to be in JSON
  self.removeTask = function (task) {
    self.deleteTask(task).then(function () {
      self.tasks.remove(task)
    })
  }

  self.updateTask = function (task) {
    $.ajax({
      url: self.tasks_url + task.id,
      type: 'PUT',
      data: task
    })
  }

  self.populateAssignees = function() {
    var dropdown = $('.assignees')
    $.getJSON(self.users_url).then(function (data) {
      for (var user in data) {
        dropdown.append($("<option />")
                        .val(data[user].id).text(data[user].username));
      }
    })
  }

  self.todoArray = ko.computed(function () {
    return self.tasks().filter(function (todo) {
      return todo.status() === 'todo'
    })
  })

 self.init();
}

ko.applyBindings(new TaskViewModel());
