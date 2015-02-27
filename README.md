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
use `"entityServiceProvider"` to configure Data Mapping -- add Entity classes, change defaults. 
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
And `"entityService"` enjectable for your services.
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
Service provider `"entityServiceProvider"` to register data entities:
* **register** (name:String, constructor:Function, namespace:String="") - register class 
 * name - Name to assign for entity class
 * constructor - Entity class 
 * namespace - Optional namespace value to register entity into specified namespace. If not defined, default namespace will be used.
* **setDefaultType** (constructor:Function)
 * constructor - Entity class that will be used as default for unknown type or object. By default, Entity.
* **setDefaultNamespace** (name:String) 
 * name - set default namespace for registering and requesting entities. By default, "".

Service `"entityService"` is designed to be used in other services as utility:
* create (name:String, data:Object=null, entityTypeMap:Object=null, namespace:String=""):Entity
* createNew (name:String, namespace:String=""):Entity
* factory (name:String, entityTypeMap:Object, namespace:String="") :Function
* verify (data:Entity):Boolean|undefined
Both of `"entityServiceProvider"` and `"entityService"` have shared API methods:
* extend (constructor:Function):Function
* isEntity (instance:Object):Boolean
* isEntityClass (constructor:Function):Boolean
* get (name:String, namespace:String="")
* getNamespace (name:String)

> Written with [StackEdit](https://stackedit.io/).