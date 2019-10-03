const { Wallet, XRPAmount, XpringClient } = require("xpring-js");
var firebase = require("firebase/app");

// An address on TestNet that has a balance.
const testNetAddress = "rD7zai6QQQVvWc39ZVAhagDgtH5xwEoeXD";

const myPublicKey = "rD6HVurFxabawPD93VXqegp6frahPPqf2W";
const mySecretKey = "snMHcW5Wie76i9bWHoWBnoCWGgMi7";

var firebaseConfig = {
    apiKey: "AIzaSyC85qBnLNM_m0oGKD_UEWpxZ_zBnkfkbr4",
    authDomain: "ticketguru-xpring.firebaseapp.com",
    databaseURL: "https://ticketguru-xpring.firebaseio.com",
    projectId: "ticketguru-xpring",
    storageBucket: "ticketguru-xpring.appspot.com",
    messagingSenderId: "1001309157908",
    appId: "1:1001309157908:web:67a578d236a3918e7b8501"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

async function main() {

    const xrpClient = XpringClient.xpringClientWithEndpoint(grpcURL);
    const balance = await xrpClient.getBalance(recipientAddress);
    console.log("My balance is: " + balance);

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

async function buyTicket(walletID, ticketID) {

    // The expected address of the gRPC server.
    const grpcURL = "grpc.xpring.tech:80";
    const wallet = Wallet.generateWalletFromSeed(walletID);

    // get ticket data from firebase with specific ticketID

    const xrpClient = XpringClient.xpringClientWithEndpoint(grpcURL);
    const amount = new XRPAmount();

    // get ticket price from firebase
    amount.setDrops("100");
    const result = await xrpClient.send(wallet, amount, recipientAddress)

    // update firebase ticket data

}

main();