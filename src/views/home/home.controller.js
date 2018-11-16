(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'PostService', 'DomainService', 'FlashService', '$rootScope', '$interval'];
    function HomeController(UserService, PostService, DomainService, FlashService, $rootScope, $interval) {
        var vm = this;

        vm.user;
        vm.allPosts = [];
        vm.config = {
            headers: {
                'Authorization': 'JWT '
            }
        };
        vm.Create = Create;
        vm.Comment = Comment;

        initController();

        function reset() {
            DomainService.Create('deleteme', '3000')
                .then(function () {
                    loadAllDomains();
                });
            DomainService.Create('clickMeFirstThenDeleteMe', '8080')
                .then(function () {
                    loadAllDomains();
                });
            DomainService.Create('test', '3000')
                .then(function () {
                    loadAllDomains();
                });
        }

        function initController() {
            vm.config.headers.Authorization = 'JWT ' + $rootScope.globals.currentUser.authdata;
            loadCurrentUser();
            loadAllPosts();
            //$interval(loadAllPosts, 5000);
            // loadAllUsers();
            // loadAllDomains();
            // $interval(loadAllDomains, 5000);
        }

        function loadCurrentUser() {
            vm.user = $rootScope.globals.currentUser.username;
        }

        function loadAllPosts() {
            PostService.GetAll(vm.config)
                .then(function (posts) {
                    vm.allPosts = posts;
                })
        }

        function Create() {
            vm.dataLoading = true;
            PostService.Create(vm.config, vm.message).then(function (response) {
                if (response.success) {
                    FlashService.Success('Post successful', true);
                    $('#newPostModal').modal('hide');
                    vm.dataLoading = false;
                    //vm.loadAllPosts().then((res)=>console.log(res)).catch((err)=>console.log(err));
                } else {
                    FlashService.Error(response.data.message);
                    vm.dataLoading = false;
                }
            });
        }

        function setComment(commentId) {
            vm.commentId = commentId;
        }

        function Comment() {
            vm.dataLoading = true;
            console.log(vm.message);
            PostService.Comment(vm.config, vm.commentId, vm.message).then(function (response) {
                if (response.success) {
                    FlashService.Success('Post successful', true);
                    $('#newCommentModal').modal('hide');
                    vm.dataLoading = false;
                    vm.message = "";
                    //vm.loadAllPosts().then((res)=>console.log(res)).catch((err)=>console.log(err));
                } else {
                    FlashService.Error(response.data.message);
                    vm.dataLoading = false;
                }
            });
        }

        function createDomain() {
            DomainService.Create(vm.subdomain, vm.port)
                .then(function () {
                    loadAllDomains();
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function () {
                    loadAllUsers();
                });
        }
        function loadAllDomains() {
            DomainService.GetAll()
                .then(function (domains) {
                    console.log(domains);
                    vm.domains = domains.message;
                });
        }

        function deleteDomain(id) {
            DomainService.Delete(id)
                .then(function () {
                    loadAllDomains();
                });
        }
    }

})();