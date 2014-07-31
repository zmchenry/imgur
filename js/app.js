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
    var numberOfRows = 10;
    var imgsPerRow = 5;
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
                image.link = "http://i.imgur.com/" + image.cover + "m.jpg";
            } else {
                image.link = image.link.replace(image.id, image.id + "m");
            }
        });
    }

    function applyRemoteData(images) {
        $scope.images = images;
        checkForAlbums();
        rowify(numberOfRows, imgsPerRow);
        console.log($scope.images);
        console.log("Success");
    }

    function rowify(rows, iPerRow) {
        var images = [];
        var cnt = 0;
        for(var i = 0; i < rows; i++) {
            var image_row = [];
            for(var j = 0; j < iPerRow; j++) {
                image_row.push($scope.images.data[cnt++]);
            }
            images.push(image_row);
        }
        $scope.images = images;
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


