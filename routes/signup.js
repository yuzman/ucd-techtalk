var express = require('express');
var router = express.Router();

var azure = require('azure-storage');
var tableSvc = azure.createTableService('ucd', 'pEYbS1dPPSwG49rQEHYI6OLyB5yX2wFqItys4DUTlCs909ujr8ID9Sg/aed/IcLeLNEbYwAhZ7fNJ1IVycvp0w==');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    if (req.body.password !== req.body.passwordAgain)
    {
      res.render('error', {message: "Your passwords didn't match!"})
    }

    tableSvc.createTableIfNotExists('users', function(error, result, response){
      if(!error){
        console.log(result);
        var entGen = azure.TableUtilities.entityGenerator;
        var task = {
          PartitionKey: entGen.String('username'),
          RowKey: entGen.String(req.body.email),
          name: entGen.String(req.body.username),
          password: entGen.String(req.body.password)
        };

        tableSvc.insertEntity('users', task, function (error, result, response) {
          if(!error){
            console.log(result);
            res.set({'X-XSS-Protection': '0'});
            res.render('error', {message: "You're signed up!"});
          }
          else
          {
            res.render('signin_error', {username: req.body.username});
          }
        });
      }
    });
    console.log(req.body.username);
    console.log(req.body.password);

    
    //res.render('signin_error', {username: req.body.username});
})

module.exports = router;
