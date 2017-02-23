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
  self.tasks_url = 'http://127.0.0.1:8000/api/tasks/';
  self.users_url = 'http://127.0.0.1:8000/api/users/';
  self.tasks = ko.observableArray([]);

  self._populateTasks = function (data) {
    data.forEach(function (json) {
      self.tasks.push(new Task(json));
    })
  }

  self.toJSON = function (task) {
    for (var property in task){
      if (task.hasOwnProperty(property)){
        task[property] = task[property]()
      }
    }
    return JSON.stringify(task)
  }

  self.createTask = function (task) {
    $.post(self.tasks_url, task).then(function (data) {
      self.tasks.push(new Task(data))
    })
  }

  self.deleteTaskDB = function (task) {
    $.ajax({
      url: self.tasks_url + task.id,
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

  self.init = (function () {
    $.getJSON(self.tasks_url).then(function (data) {
      self._populateTasks(data);
    })
  })

  self.todoArray = ko.computed(function () {
    return self.tasks().filter(function (todo) {
      return todo.status() === 'todo'
    })
  })
}

//ko.applyBindings(new TaskViewModel());
