var logRows = [];
coreApp.service('logService', function()
    {
        var now = new Date();
        return {
            'log': function(success, status, name, model, request, response) {
                logRows.push({
                    'success': success,
                    'date': now,
                    'status': status,
                    'name': name,
                    'model': model,
                    'request': request,
                    'response': response
                });
            },
            logRows: logRows
        };
    }
);

coreApp.service('httpService', function($http, logService)
    {
        return {
            'get': function(entity, request, callback, errorCallback) {
                var url = 'http://core3017.azurewebsites.net/api/service/get/' + entity;
                //url = 'http://localhost:89/api/service/get/' + entity;
                var logRequest = {
                    'url': url,
                    'method': 'post',
                    'data': request
                };
                
                $http.post(url, request).
                success(function(data, status, headers, config) {
                    if (callback)
                        callback(data);
                    var logResponse = {
                        'status': status,
                        'headers': headers,
                        'config': config,
                        'data': data
                    };
                    
                    logService.log(true, status, url, data, logRequest, logResponse);
                }).
                error(function (data, status, headers, config) {
                    var logResponse = {
                        'status': status,
                        'headers': headers,
                        'config': config,
                        'data': data
                    };
                    if (errorCallback)
                        errorCallback(logResponse);
                    else
                        alert('Error ' + url + "\r\n" + "Status: " + status + ", " + data);
                });
            },
            'feed': function (entity, request, callback, errorCallback) {
                var url = 'http://core3017.azurewebsites.net/api/service/feed/' + entity;
                //url = 'http://localhost:89/api/service/feed/' + entity;
                var logRequest = {
                    'url': url,
                    'method': 'post',
                    'data': request
                };

                $http.post(url, request).
                success(function (data, status, headers, config) {
                    if (callback)
                        callback(data);
                    var logResponse = {
                        'status': status,
                        'headers': headers,
                        'config': config,
                        'data': data
                    };

                    logService.log(true, status, url, data, logRequest, logResponse);
                }).
                error(function (data, status, headers, config) {
                    var logResponse = {
                        'status': status,
                        'headers': headers,
                        'config': config,
                        'data': data
                    };
                    if (errorCallback)
                        errorCallback(logResponse);
                    else
                        alert('Error ' + url + "\r\n" + "Status: " + status + ", " + data);
                });
            },
            'set': function (entity, request, callback, errorCallback, withRollback) {
                var method = 'set';
                if (withRollback === true) {
                    method = 'setwithrollback';
                }

                var url = 'http://core3017.azurewebsites.net/api/service/' + method + '/' + entity;
                //url = 'http://localhost:89/api/service/' + method + '/' + entity;

                var logRequest = {
                    'url': url,
                    'method': 'post',
                    'data': request
                };
                
                $http.post(url, request).
                success(function(data, status, headers, config) {
                    if (callback)
                        callback(data);
                    var logResponse = {
                        'status': status,
                        'headers': headers,
                        'config': config,
                        'data': data
                    };
                    
                    logService.log(true, status, url, data, logRequest, logResponse);
                }).
                error(function (data, status, headers, config) {
                    var logResponse = {
                        'status': status,
                        'headers': headers,
                        'config': config,
                        'data': data
                    };

                    if (errorCallback)
                        errorCallback(logResponse);
                    else
                        alert('Error ' + url + "\r\n" + "Status: " + status + ", " + data);
                });
            }
        };
    }
);