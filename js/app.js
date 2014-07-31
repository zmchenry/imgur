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
    

    $scope.getGallery = function() {
        imageService.getGallery().then(loadRemoteData,
                                        function() {
                                            console.log("failure");}
                                        );
    };

    function applyRemoteData(images) {
        $scope.images = images;
        console.log($scope.images);
        console.log("Success");
    }

    function loadRemoteData() {
        imageService.getGallery().then(function(images) {
            applyRemoteData(images);
        });
    }
    $scope.images = $scope.getGallery();
    console.log($scope.images);
});



