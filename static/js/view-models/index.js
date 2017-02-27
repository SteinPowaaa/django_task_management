function Task(data) {
  this.id = data.id
  this.title = ko.observable(data.title);
  this.description = ko.observable(data.description);
  this.status = ko.observable(data.status);
  this.priority = ko.observable(data.priority);
  this.creator = data.creator;
  this.assigness = ko.observable(data.assignees);
  this.task_type = ko.observable(data.task_type);
  this.project = ko.observable(data.project);
  this.ref_task = ko.observable(data.ref_task);
}

function Project(data) {
  this.id = data.id
  this.title = ko.observable(data.title);
  this.description = ko.observable(data.description);
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

function TaskType(value, name) {
  this.value = value
  this.name = name
}

function TaskViewModel() {
  var csrftoken = Cookies.get('csrftoken')
  var self = this
  self.tasks_url = '/api/tasks/';
  self.users_url = '/api/users/';
  self.projects_url = 'api/projects/';
  self.tasks = ko.observableArray([]);
  self.users = ko.observableArray([]);
  self.selected_users = ko.observableArray([]);
  self.task_title = ko.observable();
  self.task_description = ko.observable();
  self.selected_status = ko.observable();
  self.selected_priority = ko.observable();
  self.selected_type = ko.observable();
  self.selected_story = ko.observable(null);
  self.projects = ko.observableArray();
  self.selected_project = ko.observable();

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

  self.taskTypes = ko.observableArray([
    new TaskType('story', 'Story'),
    new TaskType('bug', 'Bug'),
    new TaskType('improvement', 'Improvement'),
    new TaskType('sub-task', 'Sub Task')
  ])

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

  self._populateProjects = function (data) {
    projects = data.map(function (projectData) {
      return new Project(projectData);
    })
    self.projects(projects)
  }

  self.populateProjects = function () {
    $.getJSON(self.projects_url).then(function (data) {
      self._populateProjects(data);
    })
  }

  self.populate = function () {
    self.populateProjects()
    self.populateAssignees()
  }

  self._normalizeTask = function () {
    return {
      "title": self.task_title(),
      "description": self.task_description(),
      "status": self.selected_status().value,
      "priority": self.selected_priority().value,
      "assignees": self.selected_users(),
      "task_type": self.selected_type().value,
      "project": self.selected_project().id,
      "ref_task": self.selected_story()
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
    return self.tasks().filter(function (task) {
      return task.status() === 'todo'
    })
  })

  self.storyTasks = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.task_type() === 'story'
    })
  })

  self.init();

  // self.disableInputs = function () {
  //   var inputs = $(':input') // object of inputs
  //   inputs.prop('disabled', true) // disables all in in inputs
  // svg filter(blur, grayscale)
  // toggle class when button clicked for user select
  // set prop for each browser(ex. -moz-user-select: none)
  // }
}

ko.applyBindings(new TaskViewModel());
