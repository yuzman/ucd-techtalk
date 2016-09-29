var express = require('express');
var router = express.Router();

var azure = require('azure-storage');
var tableSvc = azure.createTableService('ucd', 'pEYbS1dPPSwG49rQEHYI6OLyB5yX2wFqItys4DUTlCs909ujr8ID9Sg/aed/IcLeLNEbYwAhZ7fNJ1IVycvp0w==');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);

  if (!(req.cookies.signin_p && req.cookies.signin_u && req.cookies.signin_i))
  {
    res.render('index', {});
    return;
  }

  tableSvc.createTableIfNotExists('users', function(error, result, response){
      if(!error){
        var entGen = azure.TableUtilities.entityGenerator;

        tableSvc.retrieveEntity('users', 'username', req.cookies.signin_u, function (error, result, response) {
          if(!error){

            if (result.password._ === req.cookies.signin_p)
            {
              res.set({'X-XSS-Protection': '0'});
              res.render('index', { username: req.cookies.signin_u });
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
});

module.exports = router;
