const { Wallet, XRPAmount, XpringClient } = require("xpring-js");
var firebase = require("firebase/app");

// An address on TestNet that has a balance.
const xrpClient = XpringClient.xpringClientWithEndpoint("grpc.xpring.tech:80");

const myPublicKey = "rD6HVurFxabawPD93VXqegp6frahPPqf2W";
const mySecretKey = "snMHcW5Wie76i9bWHoWBnoCWGgMi7";

var admin = require("firebase-admin");
var serviceAccount = require("./ticketguru.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ticketguru-xpring.firebaseio.com"
});

var globalPublicKey;
var globalSecretKey;

function initializeKeys(publicKey, secretKey) {
    globalPublicKey = publicKey;
    globalSecretKey = secretKey;
}

var db = admin.database();
var offersRef = db.ref("offers");
var ticketsRef = db.ref("tickets");
var usersRef = db.ref("users");


async function main() {

    buyTicket(mySecretKey, "ticket_1");

    //const xrpClient = XpringClient.xpringClientWithEndpoint(grpcURL);
    // const balance = await xrpClient.getBalance(recipientAddress);
    // console.log("My balance is: " + balance);

    // const amount = new XRPAmount();
    // amount.setDrops("1");
    //
    // const xrpClient = XpringClient.xpringClientWithEndpoint(grpcURL);
    //
    // console.log("Retrieving balance for " + testNetAddress);
    // const balance = await xrpClient.getBalance(testNetAddress);
    //
    // console.log("Sending " + amount.getDrops() + " drop of XRP to " + recipientAddress + " from " + wallet.getAddress())
    // const result = await xrpClient.send(wallet, amount, recipientAddress)
    //
    // console.log("Sent with result: " + result.getEngineResultMessage())
}


function buyTicket(walletID, ticketID) {

    ticketsRef.once("value", function(snapshot) {
        var ticketData = snapshot.val();
        var ticket = ticketData[ticketID];

        offersRef.once("value", function (snapshot) {
            var offersData = snapshot.val();
            var offer = offersData[ticketID];

            buyTicketRipple(walletID, ticket, offer, ticketID).catch(() => {
                console.log("ticket unable to purchase");
            });
        });
    }), function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    };
}

async function buyTicketRipple(walletID, ticket, offer, ticketID) {
    // The expected address of the gRPC server.
    const wallet = Wallet.generateWalletFromSeed(walletID);

    // get ticket data from firebase with specific ticketID

    const amount = new XRPAmount();

    // get ticket price from firebase
    amount.setDrops("" + (offer['price'] * 1000000));
    const result = await xrpClient.send(wallet, amount, ticket['owner']);

    const transaction_id = result['array'][3];

    getBalanceID(xrpClient, ticket['owner']).then( function(result) {
        console.log(result["array"]);
    });

    //figure out format of result
    // then update offer in firebase


    offer['buyer'] = walletID;
    offer['transaction_id'] = transaction_id;
    offersRef.child(ticketID).update(offer);


}


async function getBalanceID(xpringClient, address) {
    var balance = await xpringClient.getBalance(address);
    return balance;
}




main();
