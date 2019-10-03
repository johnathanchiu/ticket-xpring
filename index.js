const { Wallet, XRPAmount, XpringClient } = require("xpring-js");
var express = require('express');
var http = require('http');
var routes = require('routes');
var firebase = require("firebase/app");

// An address on TestNet that has a balance.
const xrpClient = XpringClient.xpringClientWithEndpoint("grpc.xpring.tech:80");

// const myPublicKey = "rD6HVurFxabawPD93VXqegp6frahPPqf2W";
// const mySecretKey = "snMHcW5Wie76i9bWHoWBnoCWGgMi7";

var admin = require("firebase-admin");
var serviceAccount = require("./ticketguru.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ticketguru-xpring.firebaseio.com"
});


var app = express();
var server = http.createServer(app);

var globalPublicKey;
var globalSecretKey;

function initializeKeys(secretKey) {
    globalSecretKey = secretKey;
}

var db = admin.database();
var offersRef = db.ref("offers");
var ticketsRef = db.ref("tickets");
var usersRef = db.ref("users");


app.use(express.static(__dirname + '/public'));

// localhost:8080/buyTicket?walletID=snMHcW5Wie76i9bWHoWBnoCWGgMi7&ticketID=ticket_2
app.get('/buyTicket', function(req, res){
    const walletID = req.query.walletID;
    const ticketID = req.query.ticketID;
    const success = buyTicket(walletID, ticketID);
    res.send({"test":true});
});

// localhost:8080/login?privateKey=r123123123
app.get('/login', function(req, res){
    initializeKeys(req.query.privateKey);
    login(globalSecretKey);
});

// localhost:8080/getUserTickets?ownerID=asdasdasd
app.get('/getUserTickets', function(req, res) {

});

// localhost:8080/updatePrice?offerID=asdf1234&price=30
app.get('updatePrice', function(req, res) {
    offersRef.child(req.query.offerID).update({
        "price": req.query.price
    });
});

app.get('toggleAvailability', function(req,res) {

});

app.get('getOffers', function(req,res){

});

app.listen(8080);


async function login(privateKey) {
    var usersCollectionRef = db.ref("users");
    var returnVal = null;
    await usersCollectionRef.once('value').then(function(snapshot){
        var users = snapshot.val();

        if (users[privateKey]){
            returnVal = users[privateKey];
        }
    });
    return returnVal;
}

function buyTicket(walletID, ticketID) {
    console.log("BUY TICKET");
    ticketsRef.once("value", function(snapshot) {
        var ticketData = snapshot.val();
        var ticket = ticketData[ticketID];

        offersRef.once("value", function (snapshot) {
            var offersData = snapshot.val();
            var offer = offersData[ticketID];

            buyTicketRipple(walletID, ticket, offer, ticketID).catch(() => {
                return false;
            });
        });
    }), function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        return false;
    };
    return true;
}

async function buyTicketRipple(walletID, ticket, offer, ticketID) {
    const wallet = Wallet.generateWalletFromSeed(walletID);
    const amount = new XRPAmount();


    // get ticket price from firebase
    amount.setDrops("" + (offer['price'] * 1000000));
    const result = await xrpClient.send(wallet, amount, ticket['owner']);
    const transaction_id = result['array'][3];

    getBalanceID(ticket['owner']).then( function(result) {
        console.log(result["array"]);
    });

    offer['buyer'] = wallet.getAddress();
    offer['transaction_id'] = transaction_id;
    offersRef.child(ticketID).update(offer);
    console.log("MADE IT TO THE END");
}


async function getBalanceID(address) {
    var balance = await xrpClient.getBalance(address);
    return balance;
}

