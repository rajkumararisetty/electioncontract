const Election = artifacts.require('./Election');

contract("Election", function(accounts) {
  let electionInstance;
  let candidateId;
  it("Initializes with two candidates", () => {
    return Election.deployed().then(function(instance) {
      return instance.candidateCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("It initializes the candidates with the correct values", () => {
    return Election.deployed().then((instance) => {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then((candidate) => {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Rajkumar", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then((candidate) => {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Venkatesh", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

  it("Allow a voter to cast a vote", () => {
    return Election.deployed().then((instance) => {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, {from: accounts[1]});
    }).then((receipt) => {
      return electionInstance.voters(accounts[1]);
    }).then((voted) => {
      assert(voted, "The voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then((candidate) => {
      const voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    });
  });

  it("Throws an exception for invalid candidates", () => {
    return Election.deployed().then((instance) => {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch((error) => {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert")
      return electionInstance.candidates(1);
    }).then((candidate1) => {
      const voteCount = candidate1[2];
      // Because we have already voted once in previous test case
      assert.equal(voteCount, 1, "Candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(candidate2 => {
      const voteCount = candidate2[2];
      assert.equal(voteCount, 0, "Candidate 2 didn't receive any votes");
    });
  });


  it("Throw an exception for double voting", () => {
    return Election.deployed().then((instalce) => {
      electionInstance = instalce;
      candidateId = 2;
      electionInstance.vote(candidateId, {from: accounts[2]});
      return electionInstance.candidates(candidateId);
    }).then(candidate => {
      const voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      //Try to vote again
      return electionInstance.vote(candidateId, { from:accounts[2] })
    }).then(assert.fail).catch(error => {
      assert(error.message.indexOf('revert') >= 0, "Error message must contain revert")
      return electionInstance.candidates(1)
    }).then(candidate1 => {
      const voteCount = candidate1[2];
      assert.equal(voteCount, 1, "Candidate 1 didn't receive any votes");
      return electionInstance.candidates(2)
    }).then(candidate2 => {
      const voteCount = candidate2[2];
      assert.equal(voteCount, 1, "Candidate 2 didn't receive any votes");
    });
  });
});