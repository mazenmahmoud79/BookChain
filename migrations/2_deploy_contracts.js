var Ticketing = artifacts.require("FootballTicketingSystem");
   
module.exports = function (deployer) {
    deployer.deploy(Ticketing);
};
