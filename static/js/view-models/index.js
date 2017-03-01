function Task(data) {
  this.id = data.id;
  this.title = ko.observable(data.title);
  this.description = ko.observable(data.description);
  this.status = ko.observable(data.status);
  this.priority = ko.observable(data.priority);
  this.creator = data.creator;
  this.assignees = ko.observable(data.assignees);
  this.taskType = ko.observable(data.task_type);
  this.project = ko.observable(data.project);
  this.refTask = ko.observable(data.ref_task);
}

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
  var csrftoken = Cookies.get('csrftoken');
  var self = this;
  self.tasksUrl = '/api/tasks/';
  self.usersUrl = '/api/users/';
  self.projectsUrl = 'api/projects/';
  self.tasks = ko.observableArray([]);
  self.users = ko.observableArray([]);
  self.selectedUsers = ko.observableArray([]);
  self.taskTitle = ko.observable();
  self.taskDescription = ko.observable();
  self.selectedStatus = ko.observable();
  self.selectedPriority = ko.observable();
  self.selectedType = ko.observable();
  self.selectedStory = ko.observable(null);
  self.projects = ko.observableArray();
  self.selectedProject = ko.observable();

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

  self._normalizeTask = function () {
    return {
      "title": self.taskTitle(),
      "description": self.taskDescription(),
      "status": self.selectedStatus().value,
      "priority": self.selectedPriority().value,
      "assignees": self.selectedUsers(),
      "task_type": self.selectedType().value,
      "project": self.selectedProject().id,
      "ref_task": self.selectedStory()
    };
  };

  self.createTask = function () {
    var task = self._normalizeTask();
    $.post(self.tasksUrl, task).then(function (data) {
      self.tasks.push(new Task(data));
    });
  };

  self.deleteTask = function (task) {
    return $.ajax({
      url: self.tasksUrl + task.id,
      type: 'DELETE'
    });
  };

  // modify data to be in JSON
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

  self.todoArray = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.status() === 'todo';
    });
  });

  self.inProgressArray = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.status() === 'in-progress';
    });
  });

  self.doneArray = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.status() === 'done';
    });
  });

  self.storyTasks = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.taskType() === 'story';
    });
  });

  self.changeStatus = function (task) {
    task.status() === 'todo' ? task.status('in-progress') : task.status('done');
  };

  self.init();

  // self.disableInputs = function () {
  //   var inputs = $(':input') // object of inputs
  //   inputs.prop('disabled', true) // disables all in in inputs
  // svg filter(blur, grayscale)
  // toggle class when button clicked for user select
  // set prop for each browser(ex. -moz-user-select: none)
  // }
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
    var color = {'low': 'green',
                 'medium': 'yellow',
                 'high': 'red'}[priority];

    $(element).css('border-color', color);
  }
};


ko.applyBindings(new TaskViewModel());
