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
    "title": this.title(),
    "description": this.description(),
    "status": this.status().value,
    "priority": this.priority().value,
    "assignees": this.assignees(),
    "task_type": this.taskType().value,
    "project": this.project().id,
    "ref_task": this.refTask() ? this.refTask().normalize() : null
  };
};

function Project(data) {
  this.id = data.id;
  this.title = ko.observable(data.title);
  this.description = ko.observable(data.description);
}

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

function TaskViewModel() {
  var self = this;
  self.tasksUrl = '/api/tasks/';
  self.usersUrl = '/api/users/';
  self.loginUrl = '/api/login';
  self.logoutUrl = '/api/logout';
  self.projectsUrl = 'api/projects/';

  self.tasks = ko.observableArray([]);
  self.users = ko.observableArray([]);

  self.task = new Task({});

  self.projects = ko.observableArray();
  self.currentProject = ko.observable(1);
  self.toggle = ko.observable(false);
  self.username = ko.observable();
  self.password = ko.observable();

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

  self.taskTypes = ko.observableArray([
    new TaskType('story', 'Story'),
    new TaskType('bug', 'Bug'),
    new TaskType('improvement', 'Improvement'),
    new TaskType('sub-task', 'Sub Task')
  ]);

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
    self.populate();
  });

  self.populateTasks = function () {
    $.getJSON(self.tasksUrl).then(function (data) {
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

  self.populate = function () {
    self.populateProjects();
    self.populateAssignees();
    self.populateTasks();
  };

  self.createTask = function () {
    var taskJSON = self.task.normalize();
    $.post(self.tasksUrl, taskJSON).then(function (data) {
      debugger
      self.tasks.push(new Task(data));
    });
  };

  self.deleteTask = function (task) {
    return $.ajax({
      url: self.tasksUrl + task.id,
      type: 'DELETE'
    });
  };

  self.removeTask = function (task) {
    self.deleteTask(task).then(function () {
        self.tasks.remove(task);
    });
  };

  self.updateTask = function (task) {
    $.ajax({
      url: self.tasksUrl + task.id,
      type: 'PUT',
      data: task
    });
  };

  self.filterProject = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.project() === self.currentProject();
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

  self.filterDone = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.status() === 'done';
    });
  });

  self.filterStory = ko.computed(function () {
    return self.filterProject().filter(function (task) {
      return task.taskType() === 'story';
    });
  });

  self.changeStatus = function (task) {
    task.status() === 'todo' ? task.status('in-progress') : task.status('done');
  };

  self.toggleLayout = function () {
    self.toggle(!self.toggle());
  };

  self.pickProject = function (project) {
    self.currentProject(project.id);
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

ko.bindingHandlers.borderColorPicker = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    priority = valueAccessor()();
    var color = {'low': '#6fd5d8',
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
        $(".login-alert").html('<div class="alert alert-success">Successfully' +
                               ' logged-in</div>');
        setTimeout(function() {
          $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
          });
        }, 1000);

        viewModel.username(data.username);

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

ko.applyBindings(new TaskViewModel());
