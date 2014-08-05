/*global angular:true, console:true*/

var app = angular.module('imgur', []);
app.service("imageService", function($http, $q) {
    function getGallery(pageNum) {
        var request = $http({
            method:"get",
            url: "https://api.imgur.com/3/gallery/hot/viral/" + pageNum
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

    return ({
        getGallery: getGallery
    });
});


app.controller('GalleryCtrl', function($scope, imageService) {
    $scope.images = [];
    $scope.searching = false;
    $scope.signInDropdown = false;
    $scope.infoShow = false;
    $scope.imageLimit = 0;
    $scope.pageNum = 0;
    $scope.getGallery = function() {
        imageService.getGallery($scope.pageNum).then(function(images){
                                            applyRemoteData(images);
                                        },
                                        function() {
                                            $scope.imageLimit = $scope.images.length;
                                            $scope.pageNum = 10;
                                            console.log("Failure getting gallery");}
                                        );
    };

    $scope.loadMore = function() {
        if($scope.imageLimit + 60 >= $scope.images.data.length) {
            $scope.pageNum++;
            $scope.getGallery();
        }
        $scope.imageLimit += 60;
    };

    function checkForAlbums() {
        angular.forEach($scope.images.data, function(image) {
            if(image && typeof image.gallery_link === 'undefined' && !image.gallery_link) {
                if(image.is_album) {
                    image.gallery_link = "http://i.imgur.com/" + image.cover + "b.jpg";
                } else {
                    image.gallery_link = image.link.replace(image.id, image.id + "b");
                }
            }
        });
    }

    function applyRemoteData(images) {
        var albumCheckStart;
        if(typeof($scope.images.data) === "undefined") {
            albumCheckStart = 0;
            $scope.images.data = images.data;
            
        } else {
            albumCheckStart = $scope.images.data.length;
            $scope.images.data = $scope.images.data.concat(images.data);
        }
        checkForAlbums(albumCheckStart);
        console.log("Success");
    }

    $scope.getGallery();
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

app.directive("cards", function() {
    return {
        restrict: "E",
        templateUrl: "partials/cards.html"
    };
});

app.directive("scrollLoad", function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind("scroll", function() {
            if(raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 100) {
                scope.$apply(attr.scrollLoad);
            }
        });
    };
});

