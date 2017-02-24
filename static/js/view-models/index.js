function Task(data) {
  this.id = data.id
  this.title = ko.observable(data.title);
  this.description = ko.observable(data.description);
  this.status = ko.observable(data.status);
  this.priority = ko.observable(data.priority);
  this.creator = data.creator;
  this.assigness = ko.observable(data.assignees);
}

function User(data) {
  this.id = data.id
  this.name = data.username
}

function Status(value, name) {
  this.value = value
  this.name = name
}

function Priority(value, name) {
  this.value = value
  this.name = name
}


function TaskViewModel() {
  var csrftoken = Cookies.get('csrftoken')
  var self = this
  self.tasks_url = '/api/tasks/';
  self.users_url = '/api/users/';
  self.tasks = ko.observableArray([]);
  self.users = ko.observableArray([]);
  self.selected_users = ko.observableArray([]);
  self.task_title = ko.observable();
  self.task_description = ko.observable();
  self.selected_status = ko.observable();
  self.selected_priority = ko.observable();

  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });

  self.statuses = ko.observableArray([
    new Status('todo', 'Todo'),
    new Status('in-progress', 'In Progress'),
    new Status('done', 'Done')
  ]);

  self.priorities = ko.observableArray([
    new Priority('low', 'Low'),
    new Priority('medium', 'Medium'),
    new Priority('high', 'High')
  ]);

  self.init = (function () {
    $.getJSON(self.tasks_url).then(function (data) {
      self._populateTasks(data);
    })
  })

  self._populateTasks = function (data) {
    tasks = data.map(function (taskData) {
      return new Task(taskData);
    });
    self.tasks(tasks);
  }

  self._populateUsers = function (data) {
    users = data.map(function (userData) {
      return new User(userData);
    });
    self.users(users);
  }

  self.populateAssignees = function () {
    $.getJSON(self.users_url).then(function (data) {
      self._populateUsers(data);
    })
  }

  self._normalizeTask = function () {
    return {
      "title": self.task_title(),
      "description": self.task_description(),
      "status": self.selected_status().value,
      "priority": self.selected_priority().value,
      "assignees": self.selected_users()
    }
  }

  self.createTask = function () {
    var task = self._normalizeTask()
    $.post(self.tasks_url, task).then(function (data) {
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

  self.todoArray = ko.computed(function () {
    return self.tasks().filter(function (todo) {
      return todo.status() === 'todo'
    })
  })

 self.init();
}

ko.applyBindings(new TaskViewModel());
