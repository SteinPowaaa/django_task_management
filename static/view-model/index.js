function Task({title, description, status,
               priority, creator, assignees}={}) {
  // this.title = ko.observable(data.title) => if param is data(json)
  this.title = ko.observable(title);
  this.description = ko.observable(description);
  this.status = ko.observable(status);
  this.priority = ko.observable(priority);
  this.creator = creator;
  this.assigness = ko.observable(assignees);
}

function TaskViewModel() {
  this.tasks = ko.observableArray([]);

  this._populateTasks = function (data) {

  };

  $.ajax({
    url: 'http://127.0.0.1:8000/api/tasks/',
    type: 'GET',
    cache: false,
    success: function(data){
      this._populateTasks(data);
    }
  });
}
