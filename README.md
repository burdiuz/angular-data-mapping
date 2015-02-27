# angular-data-mapping
Simple Data Mapping framework for [AngularJS](https://angularjs.org/). Convert raw JSON data into collections of registered Entity classes. That makes better picture of what data you manipulate and injection of additional tools, like apply() and copy() Entity methods. Having classes of objects helps in development allowing [JSDoc](http://usejsdoc.org/) with context help in modern [IDEs](http://www.jetbrains.com/webstorm/).
To sum up, with this Data Mapping implementation you have:
 * Context help for received JSON data
 * Less typos for object fields
 * Injectable utility methods
 * Initialized fields with default values
 * Self explained logs of data objects

# Installation
You can clone repository or use bower:
> bower install angular-data-mapping

# Adding to AngularJS project
Add `aw.datamapping` as dependency for module
```javascript
var module = angular.module("application", ["aw.datamapping"]);
```
use `entityServiceProvider` to configure Data Mapping -- add Entity classes, change defaults. 
```javascript
function SimpleEntity(){
	this.stringParam = "";
	this.boolParam = false;
	this.numberParam = NaN;
}
module.config([
  "entityServiceProvider",
  function(entityServiceProvider){
    entityServiceProvider.register("simple", SimpleEntity);
  }
]);
```
And `entityService` enjectable for your services.
```javascript
module.service("service", [
  "entityService",
  function (entityService){
    this.getData = function(data){
      // instead of data argument can be data received from server
      return entityService.create("simple", data);
    }
  }
]);
```
Use your new service and receive some data:
```javascript
module.controller("Application", [
  "service",
  function ApplicationController(service){
    // lets receive empty object from service
    console.log(service.getData({}));
    // lets receive ordinary object from service
    console.log(service.getData({
	    stringParam: "Any String here",
	    boolParam: true,
	    numberParam: 3.14
    }));
  }
]);
```
After executing controller code, that's what you will have in your console:
```
SimpleEntity {stringParam: "", boolParam: false, numberParam: NaN, property: function, apply: function…}
SimpleEntity {stringParam: "Any String here", boolParam: true, numberParam: 3.14, property: function, apply: function…}
```
Also you can do type check
```javascript
/**
 * @type {SimpleEntity}
 */
var data = service.getData({});
//somewhere else
if(data instanceof SimpleEntity){
  ...
```

# API


> Written with [StackEdit](https://stackedit.io/).