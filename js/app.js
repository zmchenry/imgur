var app = angular.module('imgur', []);
app.service("imageService", function($http, $q) {
    
    return ({
        getGallery: getGallery
    });

    function getGallery() {
        var request = $http({
            method:"get",
            url: "https://api.imgur.com/3/gallery/hot/viral/0"
        });
        return (request.then(handleSuccess, handleError));
    }

    function getAlbum(id) {
        var request = $http({
            method: "get",
            url: ("https://api.imgur.com/3/gallery/album/" + id)
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleSuccess(response) {
        return response.data;
    }

    function handleError(response) {
        if(!angular.isObject(response.data) || response.data.message) {
            return ( $q.reject("An unknown error occurred."));
        }

        return $q.reject( response.data.message);
    }
});


app.controller('GalleryCtrl', function($scope, imageService) {
    $scope.images = [];
    $scope.searching = false;
    $scope.signInDropdown = false;
    $scope.infoShow = false;
    $scope.getGallery = function() {
        imageService.getGallery().then(function(images){
                                            applyRemoteData(images);
                                        },
                                        function() {
                                            console.log("Failure getting gallery");}
                                        );
    };

    function checkForAlbums() {
        angular.forEach($scope.images.data, function(image) {
            if(image.is_album) {
                image.link = "http://i.imgur.com/" + image.cover + "b.jpg";
            } else {
                image.link = image.link.replace(image.id, image.id + "b");
            }
        });
    }

    function applyRemoteData(images) {
        $scope.images = images;
        checkForAlbums();
        console.log($scope.images);
        console.log("Success");
    }

    $scope.images = $scope.getGallery();
    console.log($scope.images);
});

app.directive("imageGrid", function() {
    return {
        restrict: "E",
        templateUrl: "partials/image-grid.html"
    };
});

app.directive("searchClosed", function() {
    return {
        restrict: "E",
        templateUrl: "partials/search-closed.html"
    };
});

app.directive("searchFocused", function() {
    return {
        restrict: "E",
        templateUrl: "partials/search-focused.html"
    };
});

app.directive("searchFooter", function() {
    return {
        restrict: "E",
        templateUrl: "partials/search-footer.html"
    };
});

app.directive("signinDropdown", function() {
    return {
        restrict: "E",
        templateUrl: "partials/signin-dropdown.html"
    };
});

app.directive("sentenceSort", function() {
    return {
        restrict: "E",
        templateUrl: "partials/sentence-sorting.html"
    };
});

