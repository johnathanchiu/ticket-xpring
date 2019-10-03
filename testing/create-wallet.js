const { Wallet, XRPAmount, XpringClient } = require("xpring-js");

function generateWallet(privateKey) {
    return Wallet.generateWalletFromSeed(privateKey);
}

function testGenerateWallet() {
    const wallet = generateWallet("snYP7oArxKepd3GPDcrjMsJYiJeJB");
    console.log("wallet generated address: " + wallet.getAddress());
}

// testGenerateWallet();
