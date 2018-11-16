﻿(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/users').then(handleSuccess).catch(handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/users/' + id).then(handleSuccess).catch(handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/users/' + username).then(handleSuccess).catch(handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('/register', user).then(handleSuccess).catch(handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/users/' + user.id, user).then(handleSuccess).catch(handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/users/' + id).then(handleSuccess).catch(handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
