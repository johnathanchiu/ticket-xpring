var admin = require("firebase-admin");

var serviceAccount = require("./ticketguru-xpring-firebase-adminsdk-f7s78-ac9e3535fa.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ticketguru-xpring.firebaseio.com"
});

var db = admin.database();




async function login(privateKey) {
    var usersCollectionRef  = db.ref("users");
    var returnVal = null;
    await usersCollectionRef.once('value').then(function(snapshot){
        var users = snapshot.val();
        // console.log(users);
        if (users[privateKey]){
            returnVal = users[privateKey];
        }

    });
    // if (privateKey in usersCollection) {
    //     return 
    // }
    return returnVal;
}

// login("1234567890").then(function(value){
//     console.log(value);
// });


async function getUserTickets(ownerID) {
    var dbRef = db.ref("tickets");
    var returnTickets = {};
    await dbRef.once('value').then(function(snapshot) {
        var allTickets = Object.keys(snapshot.val());
        for (var i = 0; i < allTickets.length; i++) {
            // console.log(snapshot.val()[allTickets[i]]["owner"]);
            if (snapshot.val()[allTickets[i]]["owner"] == ownerID) {
                returnTickets[allTickets[i]] = snapshot.val()[allTickets[i]];
            }
        }

    });
    return returnTickets
}

async function updatePrice(id, newPrice) {
    db.ref(offersURL + "/" + id).set({
        price: newPrice,
    });
}

async function toggleAvailible(id, price) {
    db.ref(offersURL + "/" + id).once('value', function(snapshot) {
        if (snapshot.exists()) {
            db.ref(offersURL + "/" + id).remove();
        } else {
            db.ref(offersURL + "/" + id).set({
                price: price,
            });
        }
    });
}

async function getOffers(eventName) {
    var dbRef = db.ref();
    var returnTickets = {};
    await dbRef.once('value').then(function(snapshot) {

        var allAvailableOffers = Object.keys(snapshot.val()['offers']);
        var allTickets = snapshot.val()['tickets'];

        for (var i = 0; i < allAvailableOffers.length; i++) {
            var offerTicket = allAvailableOffers[i];

            // console.log(allTickets[offerTicket]["name"])
            if (allTickets[offerTicket]["name"] == eventName) {

                returnTickets[offerTicket] = allTickets[offerTicket];
                returnTickets[offerTicket]['price'] = snapshot.val()['offers'][offerTicket]['price'];
            }
        }
        // console.log(returnTickets);

    });

    return returnTickets;
}

// getUserTickets("snMHcW5Wie76i9bWHoWBnoCWGgMi7").then(function(value){
//     console.log(value)
// });

// getOffers("Alchemy Tour").then(function(value) {
//     console.log(value);

// });