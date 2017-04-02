function TaskViewModel() {










  self.createSprint = function () {
    var sprintJSON = self.sprint().normalize();
    $.post(self.sprintsUrl(), sprintJSON).then(function (data) {
      self.sprints.push(new Sprint(data));
    });
  };

  self.updateSprint = function () {
    var sprint = self.sprint().normalize();
    return $.ajax({
      url: self.sprintsUrl + sprint.id + '/',
      type: 'PUT',
      data: sprint
    });
  };

  self.submitSprint = function () {
    if (self.sprint().id === '') {
      self.createSprint();
    } else {
      self.updateSprint();
    }
  };

  self.deleteSprint = function (sprint) {
    return $.ajax({
      url: self.sprintsUrl + sprint.id,
      type: 'DELETE'
    });
  };

  self.removeSprint = function (sprint) {
    self.deleteSprint(sprint).then(function () {
        self.projects.remove(sprint);
    });
  };

  self.createTask = function () {
    var taskJSON = self.task().normalize();
    $.post(self.tasksUrl(), taskJSON).then(function (data) {
      self.tasks.push(new Task(data));
    });
  };

  self.deleteTask = function (task) {
    return $.ajax({
      url: self.tasksUrl() + task.id,
      type: 'DELETE'
    });
  };

  self.removeTask = function (task) {
    self.deleteTask(task).then(function () {
        self.tasks.remove(task);
    });
  };

  self.updateTask = function () {
    var task = self.task().normalize();
    return $.ajax({
      url: self.tasksUrl() + task.id + '/',
      type: 'PUT',
      data: task
    });
  };

  self.submitTask = function () {
    if (self.task().id === '') {
      self.createTask();
    } else {
      self.updateTask();
    }
  };



  self.createUser = function () {
    var userJSON = {
      "username": self.username(),
      "email": self.email(),
      "password": self.password()
    };

    $.post(self.usersUrl, userJSON).then(function (data) {
      self.users.push(new User(data));
    });














    self.clearCredentials();
  };

  self.tasksUrl = ko.computed(function () {
    return '/api/projects/' + self.currentProject().id +'/tasks/';
  });

  self.sprintsUrl = ko.computed(function () {
    return '/api/projects/' + self.currentProject().id  +'/sprints/';
  });

  self.filterProject = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.project() === self.currentProject().id;
    });
  });

  self.filterSprint = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.sprint() === self.currentSprint().id;
    });
  });

  self.filterTodo = ko.computed(function () {
    return self.filterSprint().filter(function (task) {
      return task.status() === 'todo';
    });
  });

  self.filterInProgress = ko.computed(function () {
    return self.filterSprint().filter(function (task) {
      return task.status() === 'in-progress';
    });
  });

  self.filterCompleted = ko.computed(function () {
    return self.filterSprint().filter(function (task) {
      return task.status() === 'completed';
    });
  });

  self.filterStory = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.taskType() === 'story';
    });
  });

  self.changeStatusTodo = function (task) {
    self.task(task);
    self.task().status('todo');
    self.updateTask();
  };

  self.changeStatusInProgress = function (task) {
    self.task(task);
    self.task().status('in-progress');
    self.updateTask();
  };

  self.changeStatusCompleted = function (task) {
    self.task(task);
    self.task().status('completed');
    self.updateTask();
  };










$(function () {
  ko.applyBindings(new TaskViewModel());
});
