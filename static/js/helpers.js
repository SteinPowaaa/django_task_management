//knockout-protected.js
//https://gist.github.com/ben336/5537138#file-knockout-protected-js

//wrapper to an observable that requires accept/cancel
ko.protectedObservable = function(initialValue) {
  //private variables
  var _actualValue = ko.observable(initialValue),
      _tempValue = initialValue;

  //computed observable that we will return
  var result = ko.computed({
    //always return the actual value
    read: function() {
      return _actualValue();
    },
    //stored in a temporary spot until commit
    write: function(newValue) {
      _tempValue = newValue;
    }
  });

  result.temp = _tempValue;

  //if different, commit temp value
  result.commit = function() {
    if (_tempValue !== _actualValue()) {
      _actualValue(_tempValue);
    }
  };

  //force subscribers to take original
  result.reset = function() {
    _actualValue.valueHasMutated();
    _tempValue = _actualValue();   //reset temp value
  };

  return result;
};

ko.protectedObservableArray = function(initialArray) {
  var _tempValue = ko.observableArray(initialArray.slice(0)),
      result = ko.observableArray(initialArray);

  //expose temp value for binding
  result.temp = _tempValue;

  //commit temp value
  result.commit = function() {
    result(_tempValue.slice(0));
  };

  //reset temp value
  result.reset = function() {
    _tempValue(result.slice(0));
  };

  return result;
};

ko.observableArray.fn.find = function(prop, data) {
  var valueToMatch = data[prop];
  return ko.utils.arrayFirst(this(), function(item) {
    return item[prop] === valueToMatch;
  });
};
