const { Wallet, XRPAmount, XpringClient } = require("xpring-js");

function transferOwnership() {
    return;
}

async function getBalanceID(xpringClient, address) {
    var balance = await xpringClient.getBalance(address);
    return balance;
}


async function testSellTicket() {
    const xrpClient = XpringClient.xpringClientWithEndpoint("grpc.xpring.tech:80");
    let balancePromise = getBalanceID(xrpClient, "rD6HVurFxabawPD93VXqegp6frahPPqf2W");
    balancePromise.then(function(result) {
        console.log(result);
    })
}

testSellTicket();

// export { sellTicket, ensureSufficientBalance };
