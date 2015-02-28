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
**EntityServiceProvider** - service provider `"entityServiceProvider"` to register data entities:
* **register** (name:String|QNameEntity, constructor:Function, namespace:String="") - register class 
 * name - Name to assign for entity class. Can be String or QNameEntity which holds name of entity and namespace.
 * constructor - Entity class 
 * namespace - Optional namespace value to register entity into specified namespace. If not defined, default namespace will be used.
* **setDefaultType** (constructor:Function)
 * constructor - Entity class that will be used as default for unknown type or object. By default, Entity.
* **setDefaultNamespace** (name:String) 
 * name - set default namespace for registering and requesting entities. By default, "".

**EntityService** - service `"entityService"` is designed to be used in other services as utility:
* **create** (name:String, data:Object=null, entityTypeMap:Object=null, namespace:String=""):Entity
* **createNew** (name:String, namespace:String=""):Entity
* **factory** (name:String, entityTypeMap:Object, namespace:String="") :Function
* **verify** (data:Entity):Boolean|undefined

Both of `"entityServiceProvider"` and `"entityService"` have shared API methods:
* **extend** (constructor:Function):Function - Extend any object by Entity, by extending its prototype chain.
* **isEntity** (instance:Object):Boolean - Check if object is instance of Entity class.
* **isEntityClass** (constructor:Function):Boolean - Check if class extends Entity.
* **get** (name:String|QNameEntity, namespace:String="") - Get class function for Entity registered by "name" in namespace "namespace".
	* name - Name of entity with which it was registered. Can be String or QNameEntity which holds name of entity and namespace.
	* namespace - Name of namespace.
* **getNamespace** (name:String) - Get entity collection saved in namespace "name".
	* name - Name of namespace.

Each **Entity** after registration being extended with these methods:
* **property** (name:String, value:*, readOnly:Boolean, valueType:String|Function) - Create property with typecheck for appying values. Will throw an error if type mismatch.
* **apply** (data:Object, entityTypeMap:Object) - Apply any object to entity and nested entities.
* **copy** ():Entity - Copy entity with all nested entities.
* **valueOf** (depth:Number=0, filterEmpty:Boolean=false):Object - Create raw object from entity, skipping methods.
	* depth - Depth of nested entites to make copies.
	* filterEmpty - if TRUE, will skip empty strings, `null` and `undefined` not adding them to raw objects.

All entites for one namespace are stored in **EntityNamespace** collections, you can access them using `entityService.getNamespace(name)`:
* **name**:String - Namespace identifier, its name
* **add** (name:String, definition:Function) - Add entity Class to namespace
* **get** (name:String|QNameEntity):Function - Get entity Class from namespace. Can be String or QNameEntity which holds name of entity and namespace.  

**QNameEntity** - Special Entity that can be accessed by name "QName" in default namespace, can be used as name for other entities, holds name of entity and namespace.
* **QNameEntity** (localName:String, uri:String="") - QNameEntity constructor, accepts name of entity and namespace as arguments.
* **localName**:String - Name of entity to register or request it.
* **uri**:String - Namespace where entity stored.

#Format of Data Map Object

Data Map Object is used to specify types of nested Entities while creating Entity. To specify children entities, just pass object with properties named exactly as properties where nested entities will be saved, as values use Entity classes.
```javascript
{
	simpleEntityParam: SimpleEntity,
	otherEntityParam: OtherEntity,
	content: DocumentEntity,
	list:UserEntity
}
```
According to this map main entity will expect its field `simpleEntityParam` to be of type `SimpleEntity`, `otherEntityParam` of `OtherEntity`, `content` of `DocumentEntity` and `list` of `UserEntity`. The same rule will be applied to arrays, for example, if field `list` may hold array of objects - class `UserEntity` will be applied to all of them.  
What of child entity should hold other entities? Then you need to replace its Class with nested Data Map Object specifying field `constructor` which will define Class for current object. For example, DocumentEntity must hold HeadEntity, BodyEntity and list of ParagraphEntity:
```javascript
{
	simpleEntityParam: SimpleEntity,
	otherEntityParam: OtherEntity,
	content: {
		constructor: DocumentEntity,
		head: HeadEntity,
		body: BodyEntity,
		paragraphs: ParagraphEntity
	},
	list:UserEntity
}
```

#Runtime type check
First time when entity of certain type is created, framework saves map of types for this entity. Later you can use it to check if all properties hold data of proper types.  Saving type maps is automatic, to check object you should use `entityService.verify()` method.


> Written with [StackEdit](https://stackedit.io/).