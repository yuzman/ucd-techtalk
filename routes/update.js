var express = require('express');
var router = express.Router();

var azure = require('azure-storage');
var tableSvc = azure.createTableService('ucd', 'pEYbS1dPPSwG49rQEHYI6OLyB5yX2wFqItys4DUTlCs909ujr8ID9Sg/aed/IcLeLNEbYwAhZ7fNJ1IVycvp0w==');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  if (!(req.cookies.signin_p && req.cookies.signin_u && req.cookies.signin_i))
  {
    res.render('error', {message: "You're not logged in"});
    return;
  }


});


router.post('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  if (!(req.cookies.signin_p && req.cookies.signin_u && req.cookies.signin_i))
  {
    res.render('error', {message: "You're not logged in"});
    return;
  }

  tableSvc.createTableIfNotExists('users', function(error, result, response){
      if(!error){
        var entGen = azure.TableUtilities.entityGenerator;

        tableSvc.retrieveEntity('users', 'username', req.cookies.signin_u, function (error, result, response) {
          if(!error){

            if (result.password._ === req.cookies.signin_p)
            {
              var entGen = azure.TableUtilities.entityGenerator;
              var task = {
                    PartitionKey: entGen.String('username'),
                    RowKey: entGen.String(req.cookies.signin_u)
              };
              var uChange = false;
              if (req.body.username && req.body.username.length > 0 && req.body.username !== req.cookies_signin_i)
              {
                task['name'] = entGen.String(req.body.username);
                uChange = true;
              }
              var pChange = false;
              if (req.body.newPassword && req.body.passwordAgain && req.body.newPassword === req.body.passwordAgain && req.body.newPassword !== req.cookies.signin_p)
              {
                task['password'] = entGen.String(req.body.newPassword);
                pChange = true;
              }
              console.log('TASK ');
              console.log(task);

              tableSvc.replaceEntity('users', task, function(error, result, response){
                if(!error) {
                  console.log('RESULT');
                  if (uChange)
                    res.cookie('signin_i', req.body.username);
                  if (pChange)
                    res.cookie('signin_p', req.body.newPassword);
                  res.render('error', {message: 'All done!'}); 
                }
              });
            }
          }
          else
          {
            res.set({'X-XSS-Protection': '0'});
            res.render('signin_error', {username: req.body.username});
          }
        });
      }
      else {
        res.set({'X-XSS-Protection': '0'});
        res.render('signin_error', {username: req.body.username});
      }
    });
})
module.exports = router;
