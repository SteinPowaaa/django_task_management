function Task(data) {
  this.id = data.id || "";
  this.title = ko.observable(data.title || "");
  this.description = ko.observable(data.description || "");
  this.status = ko.observable(data.status || "");
  this.priority = ko.observable(data.priority || "");
  this.creator = data.creator || "";
  this.assignees = ko.observableArray(data.assignees || []);
  this.taskType = ko.observable(data.task_type || "");
  this.project = ko.observable(data.project || "");
  this.refTask = ko.observable(data.ref_task || null);
}

Task.prototype.normalize = function () {
  return {
    "id": this.id,
    "title": this.title(),
    "description": this.description(),
    "status": this.status(),
    "priority": this.priority(),
    "creator": this.creator,
    "assignees": this.assignees(),
    "task_type": this.taskType(),
    "project": this.project(),
    "ref_task": this.refTask() ? this.refTask().normalize() : null
  };
};

function Project(data) {
  this.id = data.id || "";
  this.title = ko.observable(data.title || "");
  this.description = ko.observable(data.description || "");
}

function Sprint(data) {
  this.id = data.id || "";
  this.title = ko.observable(data.title || "");
  this.description = ko.observable(data.description || "");
}

Project.prototype.normalize = function () {
  return {
    "id": this.id,
    "title": this.title(),
    "description": this.description()
  };
};

function User(data) {
  this.id = data.id;
  this.name = data.username;
}

function Status(value, name) {
  this.value = value;
  this.name = name;
}

function Priority(value, name) {
  this.value = value;
  this.name = name;
}

function TaskType(value, name) {
  this.value = value;
  this.name = name;
}

// {% with 0000 as dumbId %}

// var Urls = function () {
//   var self = this;
//   self.tasksListUrl = "{% url 'tasks-list' dumbId %}";

//   self.getTasksListUrl = function (projectId) {
//     return self.tasksListUrl.replace('{{dumbId}}', projectId);
//   };

//   return self;
// };

// Urls.getTasksListUrl(3);

function TaskViewModel() {
  var self = this;
  self.sprint = ko.observable(new Sprint({ "id": 1 }));
  self.sprints = ko.observableArray([]);
  self.currentSprint = ko.observable(new Sprint({"id": 1}));

  self.project = ko.observable(new Project({ "id": 1 }));
  self.projects = ko.observableArray([]);
  self.currentProject = ko.observable(new Project({"id": 1}));

  self.task = ko.observable(new Task({}));
  self.tasks = ko.observableArray([]);

  self.currentUser = ko.observable();
  self.users = ko.observableArray([]);

  self.toggleProject = ko.observable(false);
  self.toggleSprint = ko.observable(false);
  self.toggleMenu = ko.observable(false);

  self.username = ko.observable();
  self.password = ko.observable();
  self.email = ko.observable();

  self.usersUrl = '/api/users/';
  self.loginUrl = '/api/login';
  self.logoutUrl = '/api/logout';
  self.projectsUrl = 'api/projects/';
  self.currentUserUrl = 'api/current-user/';

  // function csrfSafeMethod(method) {
  //   // these HTTP methods do not require CSRF protection
  //   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  // }
  // $.ajaxSetup({
  //   beforeSend: function(xhr, settings) {
  //     var csrftoken = Cookies.get('csrftoken');
  //     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
  //       xhr.setRequestHeader("X-CSRFToken", csrftoken);
  //     }
  //   }
  // });

  self.taskTypes = ko.observableArray([
    new TaskType('story', 'Story'),
    new TaskType('bug', 'Bug'),
    new TaskType('improvement', 'Improvement'),
    new TaskType('sub-task', 'Sub Task')
  ]);

  self.statuses = ko.observableArray([
    new Status('todo', 'Todo'),
    new Status('in-progress', 'In Progress'),
    new Status('completed', 'Completed')
  ]);

  self.priorities = ko.observableArray([
    new Priority('low', 'Low'),
    new Priority('medium', 'Medium'),
    new Priority('high', 'High')
  ]);

  self.init = function () {
    self.populate();
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

  self._populateUsers = function (data) {
    users = data.map(function (userData) {
      return new User(userData);
    });
    self.users(users);
  };

  self.populateAssignees = function () {
    $.getJSON(self.usersUrl).then(function (data) {
      self._populateUsers(data);
    });
  };

  self._populateProjects = function (data) {
    projects = data.map(function (projectData) {
      return new Project(projectData);
    });
    self.projects(projects);
  };

  self.populateProjects = function () {
    $.getJSON(self.projectsUrl).then(function (data) {
      self._populateProjects(data);
    });
  };

  // self.populateSprints = function () {
  //   $.getJSON(self.sprintsUrl).then(function (data) {
  //     self._populateSprints(data);
  //   });
  // };

  // self._populateSprints = function (data) {
  //   sprints = data.map(function (sprintData) {
  //     return new Sprint(sprintData);
  //   });
  //   self.sprints(sprints);
  // };

  self.populate = function () {
    self.populateProjects();
    self.populateAssignees();
    self.populateTasks();
    // self.populateSprints();
  };

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
    $.post(self.sprintsUrl, sprintJSON).then(function (data) {
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

  self.clearData = function () {
    self.username(null);
    self.email(null);
    self.password(null);
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

    self.clearData();
  };

  self.tasksUrl = ko.computed(function () {
    return '/api/projects/' + self.currentProject().id  +'/tasks/';
  });

  self.sprintsUrl = ko.computed(function () {
    return '/api/projects/' + self.currentProject().id  +'/sprints/';
  });

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

  self.filterProject = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.project() === self.currentProject().id;
    });
  });

  self.filterTodo = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.status() === 'todo';
    });
  });

  self.filterInProgress = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.status() === 'in-progress';
    });
  });

  self.filterCompleted = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.status() === 'completed';
    });
  });

  self.filterStory = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.taskType() === 'story';
    });
  });

  self.changeStatusTodo = function (task) {
    task.status('todo');
    self.updateTask(task);
  };

  self.changeStatusInProgress = function (task) {
    task.status('in-progress');
    self.updateTask(task);
  };

  self.changeStatusCompleted = function (task) {
    task.status('completed');
    self.updateTask(task);
  };

  self.toggleProjectLayout = function () {
    self.toggleProject(!self.toggleProject());
  };

  self.toggleSprintLayout = function () {
    self.toggleSprint(!self.toggleSprint());
  };

  self.toggleSidebar = function () {
    self.toggleMenu(!self.toggleMenu());
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

ko.bindingHandlers.selectPicker = {
     init: function (element, valueAccessor, allBindingsAccessor) {
         if ($(element).is('select')) {
             if (ko.isObservable(valueAccessor())) {
                 if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                     // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                     ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                 } else {
                     // regular select and observable so call the default value binding
                     ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                 }
             }
             $(element).addClass('selectpicker').selectpicker();
         }
     },
     update: function (element, valueAccessor, allBindingsAccessor) {
         if ($(element).is('select')) {
             var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
             if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                 var options = selectPickerOptions.optionsArray,
                     optionsText = selectPickerOptions.optionsText,
                     optionsValue = selectPickerOptions.optionsValue,
                     optionsCaption = selectPickerOptions.optionsCaption,
                     isDisabled = selectPickerOptions.disabledCondition || false,
                     resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                 if (ko.utils.unwrapObservable(options).length > 0) {
                     // call the default Knockout options binding
                     ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                 }
                 if (isDisabled && resetOnDisabled) {
                     // the dropdown is disabled and we need to reset it to its first option
                     $(element).selectpicker('val', $(element).children('option:first').val());
                 }
                 $(element).prop('disabled', isDisabled);
             }
             if (ko.isObservable(valueAccessor())) {
                 if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                     // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                     ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                 } else {
                     // call the default Knockout value binding
                     ko.bindingHandlers.value.update(element, valueAccessor);
                 }
             }

             $(element).selectpicker('refresh');
         }
     }
};

ko.bindingHandlers.backgroundColorPicker = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    priority = valueAccessor()();
    var color = {'low': '#91c05b',
                 'medium': '#faaa7a',
                 'high': '#f76b6f'}[priority];

    $(element).css('background-color', color);
  }
};

ko.bindingHandlers.login = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function(e) {
      e.preventDefault();
      var data = {
        "username": viewModel.username(),
        "password": viewModel.password()
      };
      $.post(viewModel.loginUrl, data).then(function (data, _, xhr) {
        viewModel.clearData();

        $(".login-alert").html('<div class="alert alert-success">Successfully' +
                               ' logged-in</div>');
        setTimeout(function() {
          $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
          });
        }, 1000);

        viewModel.currentUser(data.username);

        $('.nav-form').hide();
        $('.logged-in').show();
        viewModel.init();
      });
    });
  }
};

ko.bindingHandlers.logout = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function () {
      $.post(viewModel.logoutUrl).then(function (data, status) {
        $('.logged-in').hide();
        $('.nav-form').show();
      });
    });
  }
};

ko.bindingHandlers.getCurrent = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(document).ready(function(){
      $.get(viewModel.currentUserUrl).then(function (data){
        viewModel.username(data.details.username);
        $('.nav-form').hide();
        $('.logged-in').show();
        viewModel.init();
      });
    });
  }
};

ko.bindingHandlers.openModal = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $('.create-project').click(function () {
      $('#projectModal').modal('show');
    });

    $('.create-task').click(function () {
      $('#taskModal').modal('show');
    });

    $('.create-user').click(function () {
      $('#userModal').modal('show');
    });
  }
};

ko.bindingHandlers.setTask = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    bindingContext.$root.task(viewModel);
  }
};

$(function () {
  ko.applyBindings(new TaskViewModel());
});
