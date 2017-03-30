function TaskViewModel() {
  var self = this;
  self._toggleMenu = ko.observable(false);
  self._toggleManager = ko.observable(false);

  self.username = ko.observable();
  self.password = ko.observable();
  self.email = ko.observable();

  self.usersUrl = '/api/users/';
  self.loginUrl = '/api/login';
  self.logoutUrl = '/api/logout';
  self.projectsUrl = 'api/projects/';
  self.currentUserUrl = 'api/current-user/';

  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      var csrftoken = Cookies.get('csrftoken');
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });

  self.init = function () {
    self.populate();
  };

  self.populate = function () {
    self.populateUsers();
    self.populateProjects().then(function () {
      if (self.projects().length) {
        self.currentProject(self.projects()[0]);
        self.populateTasks();
        self.populateSprints().then(function () {
          if (self.sprints().length) {
            self.currentSprint(self.sprints()[0]);
          }
        });
      }
    });
  };

  self.populateProjects = function () {
    return $.getJSON(self.projectsUrl).then(function (data) {
      self._populateProjects(data);
    });
  };

  self._populateProjects = function (data) {
    projects = data.map(function (projectData) {
      return new Project(projectData);
    });
    self.projects(projects);
  };

  self.populateTasks = function () {
    $.getJSON(self.tasksUrl()).then(function (data) {
      self._populateTasks(data);
    });
  };

  self._populateTasks = function (data) {
    tasks = data.map(function (taskData) {
      return new Task(taskData);
    });
    self.tasks(tasks);
  };

  self.populateUsers = function () {
    return $.getJSON(self.usersUrl).then(function (data) {
      self._populateUsers(data);
    });
  };

  self._populateUsers = function (data) {
    users = data.map(function (userData) {
      return new User(userData);
    });
    self.users(users);
  };

  self.populateSprints = function () {
    return $.getJSON(self.sprintsUrl()).then(function (data) {
      self._populateSprints(data);
    });
  };

  self._populateSprints = function (data) {
    sprints = data.map(function (sprintData) {
      return new Sprint(sprintData);
    });
    self.sprints(sprints);
  };

  self.isEditable = ko.computed(function () {

  });

  self.createProject = function () {
    var projectJSON = self.project().normalize();
    $.post(self.projectsUrl, projectJSON).then(function (data) {
      self.projects.push(new Project(data));
    });
  };

  self.updateProject = function () {
    var project = self.project().normalize();
    return $.ajax({
      url: self.projectsUrl + project.id + '/',
      type: 'PUT',
      data: project
    });
  };

  self.submitProject = function () {
    if (self.project().id === '') {
      self.createProject();
    } else {
      self.updateProject();
    }
  };

  self.deleteProject = function (project) {
    return $.ajax({
      url: self.projectsUrl + project.id,
      type: 'DELETE'
    });
  };

  self.removeProject = function (project) {
    self.deleteProject(project).then(function () {
        self.projects.remove(project);
    });
  };

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

  self.addTaskToSprint = function (task) {
    self.task(task);
    self.task().sprint(self.currentSprint());
    self.updateTask();
    self.updateSprint();
  };

  self.removeTaskFromSprint = function (task) {
    self.task(task);
    self.task().sprint(null);
    self.updateTask();
    self.updateSprint();
  };

  self.toggleMenu = function () {
    self._toggleMenu(!self._toggleMenu());
  };

  self.toggleManager = function () {
    self._toggleManager(!self._toggleManager());
  };

  self.selectProject = function (project) {
    self.currentProject(project);
    self.populateTasks();
    self.populateSprints().then(function () {
      if (self.sprints().length) {
        self.currentSprint(self.sprints()[0]);
      }
    });
  };

  self.selectSprint = function (sprint) {
    self.currentSprint(sprint);
  };

  self.pickProject = function (project) {
    self.project(project);
  };

  self.pickSprint = function (sprint) {
    self.sprint(sprint);
  };

  self.pickTask = function (task) {
    self.task(task);
  };
}

$(function () {
  ko.applyBindings(new TaskViewModel());
});
