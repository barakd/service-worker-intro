const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const usersStorage = [];
const public_push_key = process.env.PUBLIC_PUSH_KEY;
const private_push_key = process.env.PRIVATE_PUSH_KEY;
const fcm_key = process.env.FCM_KEY;
const app = express();
webpush.setGCMAPIKey(fcm_key);
webpush.setVapidDetails(
  'mailto:push@chezzyhotel.best',
  public_push_key,
  private_push_key
);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })
  
app.post('/subscribe', function (req, res) {
    console.log("subscribing user", req.body);
    if (usersStorage.find(u => u.endpoint === req.body.endpoint)) {
        res.send(JSON.stringify({ data: { success: true, details: 'user already registered' } }));
        return;
    }
    usersStorage.push(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true } }));
});

app.post('/room-service', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true } })); 
});

app.post('/push', function (req, res) {
    usersStorage.forEach(subsricption => {
        console.log('sending push!');
        webpush.sendNotification(subsricption, JSON.stringify(req.body));
    });
    res.send(JSON.stringify({ data: { success: true } }));    
});