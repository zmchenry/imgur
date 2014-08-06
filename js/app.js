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


app.controller('GalleryCtrl', function(imageService) {
    var context = this;
    this.images = [];
    this.searching = false;
    this.signInDropdown = false;
    this.infoShow = false;
    this.imageLimit = 0;
    this.pageNum = 0;
    
    this.getGallery = function() {
        imageService.getGallery(context.pageNum).then(function(images){
                                            applyRemoteData(images);
                                        },
                                        function() {
                                            context.imageLimit = context.images.length;
                                            context.pageNum = 10;
                                            console.log("Failure getting gallery");}
                                        );
    };

    this.loadMore = function() {
        if(context.pageNum < 10) {
            if(context.imageLimit + 60 >= context.images.data.length) {
                context.pageNum++;
                this.getGallery();
            }
            context.imageLimit += 60;
        }
    };

    function checkForAlbums() {
        angular.forEach(context.images.data, function(image) {
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
        if(typeof(context.images.data) === "undefined") {
            albumCheckStart = 0;
            context.images.data = images.data;
            
        } else {
            albumCheckStart = context.images.data.length;
            context.images.data = context.images.data.concat(images.data);
        }
        checkForAlbums(albumCheckStart);
        console.log("Success");
    }

    this.getGallery();
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

