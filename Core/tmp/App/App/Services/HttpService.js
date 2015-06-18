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
            'get': function(entity, request, callback) {
                var url = 'App/TestData/person.json';
                var logRequest = {
                    'url': url,
                    'method': 'get',
                    'data': request
                };
                
                $http.get(url, request).
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
                error(function(data, status, headers, config) {
                    alert('error');
                });
            }
        };
    }
);