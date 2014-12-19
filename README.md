api-echo
========

A very simple test web service api written in nodejs, used for running spec runners against. It is based at: http://api-echo.azurewebsites.net

## Api

### Get

- Ip - http://api-echo.azurewebsites.net/ip - Returns a JSON object containing a property 'ip' with a value of the callers IP Address
- Headers - http://api-echo.azurewebsites.net/headers - Returns a JSON object containing the name/value pairs of the headers sent to the service

- 404 - http://api-echo.azurewebsites.net/notFound - Returns with a status code of 404 as notFound does not exist.

### Post
- Echo - http://api-echo.azurewebsites.net/echo - Returns back the data as it was sent to the server, if content-type is 'application/x-www-form-urlencoded' it is returned as 'text/plain'