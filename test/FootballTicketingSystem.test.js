const FootballTicketingSystem = artifacts.require("FootballTicketingSystem");

contract("FootballTicketingSystem", accounts => {
  const owner = accounts[0];
  const user = accounts[1];
  const newOwner = accounts[2];

  let instance;

  beforeEach(async () => {
    instance = await FootballTicketingSystem.new({ from: owner });
  });

  it("should create a new match", async () => {
    await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", 1, 100, { from: owner });
    const match = await instance.matches(1);
    assert.equal(match.teamA, "Team A");
    assert.equal(match.teamB, "Team B");
    assert.equal(match.venue, "Stadium");
    assert.equal(match.ticketPrice.toNumber(), 1);
    assert.equal(match.totalTickets.toNumber(), 100);
  });

  it("should allow user to purchase a ticket", async () => {
    await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", web3.utils.toWei("1", "ether"), 100, { from: owner });
    await instance.purchaseTicketAndCreate(1, 1, { from: user, value: web3.utils.toWei("1", "ether") });
    const ticket = await instance.tickets(1);
    assert.equal(ticket.owner, user);
    assert.equal(ticket.matchId.toNumber(), 1);
    assert.equal(ticket.seatNumber.toNumber(), 1);
  });

  it("should allow ticket transfer", async () => {
    await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", web3.utils.toWei("1", "ether"), 100, { from: owner });
    await instance.purchaseTicketAndCreate(1, 1, { from: user, value: web3.utils.toWei("1", "ether") });
    await instance.transferTicket(1, newOwner, { from: user });
    const ticket = await instance.tickets(1);
    assert.equal(ticket.owner, newOwner);
  });

  it("should not allow non-owner to create a match", async () => {
    try {
      await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", 1, 100, { from: user });
      assert.fail("Only the owner should be able to create a match");
    } catch (error) {
      assert(error.message.includes("Only owner can perform this action"), "Expected only owner restriction error");
    }
  });

  it("should not allow non-owner to update a match", async () => {
    await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", 1, 100, { from: owner });
    try {
      await instance.updateMatch(1, "Team A", "Team C", 1700000000, "New Stadium", 2, 150, true, { from: user });
      assert.fail("Only the owner should be able to update a match");
    } catch (error) {
      assert(error.message.includes("Only owner can perform this action"), "Expected only owner restriction error");
    }
  });

  it("should not allow ticket purchase exceeding total tickets", async () => {
    await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", web3.utils.toWei("1", "ether"), 1, { from: owner });
    await instance.purchaseTicketAndCreate(1, 1, { from: user, value: web3.utils.toWei("1", "ether") });
    try {
      await instance.purchaseTicketAndCreate(1, 2, { from: user, value: web3.utils.toWei("1", "ether") });
      assert.fail("Should not allow purchasing more tickets than available");
    } catch (error) {
      assert(error.message.includes("Not enough tickets available"), "Expected not enough tickets error");
    }
  });

  it("should not allow invalid ticket transfers", async () => {
    await instance.createMatch("Team A", "Team B", 1700000000, "Stadium", web3.utils.toWei("1", "ether"), 100, { from: owner });
    await instance.purchaseTicketAndCreate(1, 1, { from: user, value: web3.utils.toWei("1", "ether") });
    try {
      await instance.transferTicket(1, newOwner, { from: newOwner });
      assert.fail("Only the owner should be able to transfer the ticket");
    } catch (error) {
      assert(error.message.includes("You are not the owner"), "Expected only owner restriction error");
    }
  });

  it("should not allow updates to non-existent matches", async () => {
    try {
      await instance.updateMatch(999, "Team A", "Team B", 1700000000, "Stadium", 1, 100, true, { from: owner });
      assert.fail("Should not allow updating a non-existent match");
    } catch (error) {
      assert(error.message.includes("Match does not exist"), "Expected match does not exist error");
    }
  });
});
