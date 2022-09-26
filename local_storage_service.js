class LocalStorageService {
    "use strict"
    constructor(data, key) {
       this.origModel = data;
       this.key = key;
       
       //if data is NOT in local storage, init and sort using sortCol and sortDir from the model
       if(!this.retrieve()){   
          this.model = this.cloneObject(data);   //get copy of data
          this.sort(this.sortCol, this.sortDir, true);   //apply default sort
         
       }
    }
    //Getters
    get sortCol(){
       return this.model.app.sortCol;
    }
    set sortCol(col){
       this.model.app.sortCol=col;
    }
    get sortDir(){
       return this.model.app.sortDir;
    }
    set sortDir(dir){
       this.model.app.sortDir=dir;
    }
    get size() {
       //should return the number of items in model.data
       return this.model.data.length
    }
    get list() {
      //return the model.data array
      return this.model.data
    }
    
    //CRUD FUNCTIONS
    create(obj) {
      //append new object to data store
      let currentArray = this.list;
      currentArray.push(obj);
   
      // persist in local storage by calling store()
      this.store();

    }
    read(getId) {
      //returns the item in the array with id=getId, null if it is not found
      //Don't like that parameter name
      let currentArray = this.list;
      let item = currentArray.find(element => element.id == getId);
      if(item == undefined){
         return null;
      }
      else{
         return item;
      }
    }

    update(obj) {
      //find index of object in array
      let currentArray = this.list;
      let index = this.getItemIndex(obj.id);
      //update object with new contents
      currentArray[index] = obj; //not updating just replacing obj in list
      // persist in local storage by calling store()
      this.store();
    }
 
    delete(removeId) {
         //find index of object in 
         var index = this.getItemIndex(removeId);
         var currentArray = this.list;
        //remove object with specified id from model.data (splice?)
        //splice changes og array splice(start, dltCount)
        currentArray.splice(index,1);
        // persist in local storage by calling store()
        this.store();
    }
 
    //LocalStorage Functions
    reset() {
      //should clear local storage 
      this.clear()
      //should restore model from origModel 
      //clone because we never want to change orgiModel, so that we can always convert back to it
      this.model = this.cloneObject(this.origModel);
      //store
      this.store();
      //(use utility function 'cloneObject' at bottom of file)
    }

    clear() {
       //should clear local storage
       localStorage.clear()
    }

    store() {
      //store whole model not just obj 
      //should store your model in localStorage
      //local storage stored in key value pairs
      //store obj as stringified json
      //localStorage.setItem(key, value);
      localStorage.setItem(this.key,JSON.stringify(this.model));
    }

    retrieve() {
        //should retrieve your model from localStorage using this.key
        let currentModel = localStorage.getItem("teamData")
        //If data retrieved from LocalStorage, updates this.model
        if(currentModel != null){
            this.model = JSON.parse(currentModel) //parsed currentModel
            return true;
        }
        else{
         return false;  //returning false for now
        }
        //parse' the LocalStorage string value back into an object
        //return true if model retrieved from localStorage, false if key wasn't found in localStorage 
        
    }
 
    //Sorting and Filtering Functions
    sort(col, direction, perm = false) {
        //returns a copy of the model.data (util func 'cloneArray'), sorted using the 'col' and 'direction' specifications (see index.html for example)
        // storageSvc.sort('name','asc')
        // if 'perm' param is set to true, you should update the internal model.data 
        //with the sorted list, and call 'store' to store in local storage
        //also, store the sort col and direction in the 'app' portion of the model
      
        //sort array but not model data
        //clone model data and sort copy

        //sort compare objects compare two objs keys
        //a.sortCol < b.sortCol{} return 0,1,-1
        //turnary operator return direction == "asc" ? -1 : 1;

        //copy of the current model
        var currentModel = this.cloneObject(this.model)
        //alters og array

        //parse model so can access specific objs
        //var objects = JSON.parse(currentModel);    
        //console.log("OBJECTS: " + currentModel.data[0][col]);
       let currentArray = currentModel.data;
      
        //currentArray.sort((a, b) => {a.col > b.col});
        //use obj[property] to pull out properties dynamically
        if(direction == "asc"){
         currentArray.sort((a,b) => a[col] > b[col] ? 1: -1);
        }
        else if(direction == "desc"){
         currentArray.sort((a,b) => a[col] > b[col] ? -1: 1);
        }
        else{
         console.log("Error: sort direction is incorrect")
        }
        
        //console.log(currentArray);




        //if perment is true store clone
        if(perm){
         this.sortCol = col;
         this.sortDir = direction;
         this.model = currentModel; 
         this.store();
        }

        return currentArray;



      }
    
    filter(filterObj) {
        //returns a copy of the filtered array
        //filterObj contains an object with all the key/value pairs you 
        //will filter model.data with.
        //See MDN array 'filter' function documentation
        //Example call: storageSvc.filter({coachLicenseLevel:1,coachLast:"Jenson"});
      var currentArray = this.list;
      //var keys = Object.keys(filterObj);
      //var vaules = Object.values(filterObj);

      //Object.entries similar to for...in loop
      //every test whether all elements in array pass tests
      var results = currentArray.filter(obj => Object.entries(filterObj).every(([col, value]) => obj[col] == value));
      return results;
      
    }
 
    //Utility functions-IMPLEMENT THESE FIRST
    getItemIndex(id){
      //return index of team with given id
      //see MDN array 'find' documentation  
      //created separate function for this since multiple methods need to get the index of an item
      return this.list.findIndex(element => element.id == id);
      //used in delete, update, read
   }
    cloneObject(obj){
       //util function for returning a copy of an object
       return JSON.parse(JSON.stringify(obj));  //giving you this one as of class on Feb 4
    }
    
 }
