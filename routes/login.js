var express = require('express');
var router = express.Router();

var azure = require('azure-storage');
var tableSvc = azure.createTableService('ucd', 'pEYbS1dPPSwG49rQEHYI6OLyB5yX2wFqItys4DUTlCs909ujr8ID9Sg/aed/IcLeLNEbYwAhZ7fNJ1IVycvp0w==');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    console.log(req.body.username);
    console.log(req.body.password);

    tableSvc.createTableIfNotExists('users', function(error, result, response){
      if(!error){
        var entGen = azure.TableUtilities.entityGenerator;

        tableSvc.retrieveEntity('users', 'username', req.body.username, function (error, result, response) {
          if(!error){
            console.log(result);
            if (result.password._ === req.body.password)
            {
              res.cookie('signin_u', req.body.username);
              res.cookie('signin_p', req.body.password);
              res.cookie('signin_i', result.name._);
              res.render('details', { username: req.body.username });
            }
            res.render('error', {message: 'Username or password error'});
          }
          else
          {
            res.set({'X-XSS-Protection': '0'});
            res.render('error', {message: "Sorry we can't find " + req.body.username + " in our system"});
          }
        });
      }
      else {
        res.set({'X-XSS-Protection': '0'});
        res.render('error', {message: "Sorry we can't find " + req.body.username + " in our system"});
      }
    });
})

module.exports = router;
