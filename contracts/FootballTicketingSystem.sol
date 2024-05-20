// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FootballTicketingSystem {
    // Struct for Match Details
    struct Match {
        uint matchId;
        string teamA;
        string teamB;
        uint date;
        string venue;
        uint ticketPrice;
        uint totalTickets;
        uint ticketsSold;
        bool isActive;
    }

    // Struct for Ticket Details
    struct Ticket {
        uint ticketId;
        uint matchId;
        uint seatNumber;
        address owner;
        bool isAvailable;
    }

    // State Variables
    
    address public owner;
    uint public matchCount;
    uint public ticketCount;
    mapping(uint => Match) public matches;
    mapping(uint => Ticket) public tickets;
    mapping(uint => uint[]) public matchTickets; // Match ID to Ticket IDs

    // Events
    event MatchCreated(uint matchId, string teamA, string teamB, uint date, string venue, uint ticketPrice, uint totalTickets);
    event MatchUpdated(uint matchId, string teamA, string teamB, uint date, string venue, uint ticketPrice, uint totalTickets, bool isActive);
    event TicketCreated(uint ticketId, uint matchId, uint seatNumber, address owner);
    event TicketPurchased(uint ticketId, address newOwner);
    event RefundProcessed(uint ticketId, address owner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier matchExists(uint _matchId) {
        require(_matchId > 0 && _matchId <= matchCount, "Match does not exist");
        _;
    }

    modifier ticketExists(uint _ticketId) {
        require(_ticketId > 0 && _ticketId <= ticketCount, "Ticket does not exist");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    function getTickets() public view returns (Ticket[] memory) {
        Ticket[] memory allTickets = new Ticket[](ticketCount);
        for (uint i = 1; i <= ticketCount; i++) {
            allTickets[i - 1] = tickets[i];
        }
        return allTickets;
    }

    // Function to create a new match
    function createMatch(string memory _teamA, string memory _teamB, uint _date, string memory _venue, uint _ticketPrice, uint _totalTickets) public onlyOwner {
        matchCount++;
        matches[matchCount] = Match(matchCount, _teamA, _teamB, _date, _venue, _ticketPrice, _totalTickets, 0, true);
        emit MatchCreated(matchCount, _teamA, _teamB, _date, _venue, _ticketPrice, _totalTickets);
    }


     function getMatches() public view returns (Match[] memory) {
        Match[] memory allMatches = new Match[](matchCount);
        for (uint i = 1; i <= matchCount; i++) {
            allMatches[i - 1] = matches[i];
        }
        return allMatches;
    }

    // Function to update a match
    function updateMatch(uint _matchId, string memory _teamA, string memory _teamB, uint _date, string memory _venue, uint _ticketPrice, uint _totalTickets, bool _isActive) public onlyOwner matchExists(_matchId) {
        Match storage matchInfo = matches[_matchId];
        matchInfo.teamA = _teamA;
        matchInfo.teamB = _teamB;
        matchInfo.date = _date;
        matchInfo.venue = _venue;
        matchInfo.ticketPrice = _ticketPrice;
        matchInfo.totalTickets = _totalTickets;
        matchInfo.isActive = _isActive;
        emit MatchUpdated(_matchId, _teamA, _teamB, _date, _venue, _ticketPrice, _totalTickets, _isActive);
    }

    

    function purchaseTicketAndCreate(uint _matchId, uint _seatNumber) public payable matchExists(_matchId) {
        Match storage matchInfo = matches[_matchId];
        require(matchInfo.isActive, "Match is not active");
        require(matchInfo.totalTickets > matchInfo.ticketsSold, "Not enough tickets available");
        require(msg.value >= matchInfo.ticketPrice, "Insufficient funds");

        ticketCount++;
        tickets[ticketCount] = Ticket(ticketCount, _matchId, _seatNumber, msg.sender, false);
        matchTickets[_matchId].push(ticketCount);
        emit TicketCreated(ticketCount, _matchId, _seatNumber, msg.sender);

        matchInfo.ticketsSold++;
        emit TicketPurchased(ticketCount, msg.sender);
    }


    // Function to transfer a ticket
    function transferTicket(uint _ticketId, address _newOwner) public ticketExists(_ticketId) {
        Ticket storage ticket = tickets[_ticketId];
        require(ticket.owner == msg.sender, "You are not the owner");

        ticket.owner = _newOwner;
        emit TicketPurchased(_ticketId, _newOwner);
    }

    // Function to process refunds
    // function processRefund(uint _ticketId) public onlyOwner ticketExists(_ticketId) {
    //     Ticket storage ticket = tickets[_ticketId];
    //     require(!ticket.isAvailable, "Ticket is already available");

    //     address ticketOwner = ticket.owner;
    //     ticket.owner = address(0);
    //     ticket.isAvailable = true;
    //     emit RefundProcessed(_ticketId, ticketOwner);

    //     // Process the refund
    //     payable(ticketOwner).transfer(matches[ticket.matchId].ticketPrice);
    // }

    // Function to withdraw contract balance
    function withdrawBalance() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}
