/**
 * Created by Vilim Stubičan on 12.3.2015..
 */

app.controller("componentsController", function($scope, $http){
    $scope.editing = false;

    /**
     * Component model for the form.
     * @type {{id: number, name: {value: string, error: string}, template: {}, dimensions: {width: string, height: string, error: string}, description: {value: string, error: string}, hasError: boolean}}
     */
    $scope.component = {
        id : 0,
        name : {
            value : "",
            error : ""
        },
        template : {},
        dimensions : {
            width : "",
            height : "",
            error : ""
        },
        description : {
            value : "",
            error : ""
        },
        hasError : false
    };

    /**
     * Retrieve templates from db.
     */
    $http({
        url: "/admin/components/templates",
        method: "JSON",
        headers: {
            'Content-Type': "x www form urlencoded"
        }
    }).success(function(data){
       if(data.success) {
           $scope.templates = data.data.templates;
           console.log($scope.templates);
       } else {
           console.log("something went wrong, fix this");
       }
    });


    /**
     * Watch for changes in component template. If such happens, fill form model with extra fields.
     */
    $scope.$watch("selected.template",function(newValue, oldValue){
        if(angular.isUndefined(newValue)) return;
        $scope.component.template = angular.copy(newValue.defaultOptions);
    });

    /**
     * Check if there is option for the current form model.
     * @param optionName
     * @returns {boolean}
     */
    $scope.hasOption = function(optionName) {
        if(optionName == "" || angular.isUndefined(optionName)) return false;
        for(k in $scope.component.template) {
            if(k == optionName) return true;
        }
        return false;
    };

    /**
     * Retrieve components from db.
     */
    $scope.getComponents = function(){
        $http({
            url: "/admin/components/get",
            method: "JSON",
            headers: {
                'Content-Type': "x www form urlencoded"
            }
        }).success(function(data){
            if(data.success) {
                $scope.components = data.data.components;
            } else {
                console.log("something went wrong, fix this");
            }
        })
    };
    $scope.getComponents();


    /**
     * Save form model to the database. If there are some errors, display them and disregard saving.
     */
    $scope.save = function(){
        $http({
            url: "/admin/components/save",
            method: "JSON",
            data: {
                data : $scope.component
            },
            headers: {
                'Content-Type': "x www form urlencoded"
            }
        }).success(function(data){
            if(data.success) {
                if(!data.data.params.hasError) {
                    $scope.components = data.data.components;
                }
                $scope.component = data.data.params;
            } else {
                console.log("something went wrong, fix this");
            }
        })
    };

    /**
     * Update form model. Same functionality as save.
     */
    $scope.update = function(){
        $http({
            url: "/admin/components/update",
            method: "JSON",
            data: {
                data : $scope.component
            },
            headers: {
                'Content-Type': "x www form urlencoded"
            }
        }).success(function(data){
            if(data.success) {
                if(!data.data.params.hasError) {
                    $scope.components = data.data.components;
                    $scope.editing = false;
                }
                $scope.component = data.data.params;
            } else {
                console.log("something went wrong, fix this");
            }
        })
    };

    /**
     * Prompt for deletion. If true, delete object.
     * @param elem
     */
    $scope.delete = function(elem) {
        if(confirm("Are you sure?")) {
            $http({
                url: "/admin/components/delete",
                method: "JSON",
                data: {
                    data : elem.component
                },
                headers: {
                    'Content-Type': "x www form urlencoded"
                }
            }).success(function(data){
                if(data.success) {
                    $scope.components = data.data.components;
                } else {
                    console.log("something went wrong, fix this");
                }
            })
        }
    };

    /**
     * Change form into a editing one. Populate form model with data.
     * @param elem
     */
    $scope.edit = function(elem){
        elem = elem.component;
        $scope.editing = true;
        $scope.fillFromElement(elem);
        $scope.emptyComponentErrors();

        $scope.component.hasError = false;
    };

    /**
     * Cancel editing. Empty form model.
     */
    $scope.cancel = function(){
        $scope.editing = false;
        $scope.emptyComponent();
        $scope.emptyComponentErrors();
    };



    // Components functionality

    // Menu bars

    /**
     * Add new menu item to the form model.
     */
    $scope.menuItemAdd = function(){
        var arrayLength = $scope.component.template.menuItems.items.length;
        var index = 0;
        if(arrayLength > 0) {
            index = parseInt($scope.component.template.menuItems.items[arrayLength-1].id) + 1;
        }
      $scope.component.template.menuItems.items.push(
        {"id" : index, "value":"New menu item", url : "http://path.to/no/where", "error":""}
      );
        console.log($scope.component.template.menuItems);
    };

    /**
     * Remove menu item from the form model.
     * @param elem
     */
    $scope.menuItemRemove = function(elem) {
        var newArray = [];
        for(k in $scope.component.template.menuItems.items) {
            if($scope.component.template.menuItems.items[k].id == elem.menuItem.id) {
                continue;
            }
            newArray.push($scope.component.template.menuItems.items[k]);
        }
        $scope.component.template.menuItems.items = newArray;
    }

    // helper functions
    /**
     * Helper function. Used in editing. Fills form model with provided element.
     * @param elem
     */
    $scope.fillFromElement = function(elem) {
        $scope.component.id = elem.id;
        $scope.component.name.value = elem.name;
        $scope.component.template = elem.template;
        $scope.component.dimensions.width = elem.width;
        $scope.component.dimensions.height = elem.height;
        $scope.component.description.value = elem.description;
    };

    /**
     * Empties form model.
     */
    $scope.emptyComponent = function(){
        $scope.component.id = "";
        $scope.component.name.value = "";
        $scope.component.template = "";
        $scope.component.dimensions.width = "";
        $scope.component.dimensions.height = "";
        $scope.component.description.value = "";
    };

    /**
     * Empties form model errors.
     */
    $scope.emptyComponentErrors = function() {
        $scope.component.name.error = "";
        $scope.component.dimensions.error = "";
        $scope.component.description.error = "";

        $scope.component.hasError = false;
    };

});