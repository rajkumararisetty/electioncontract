pragma solidity ^0.4.22;

contract Election {

    // Model a Candidate
    struct candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping (address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping (uint => candidate) public candidates;
    // Store Candidate Count
    uint public candidateCount;

    constructor() public {
        addCandidate("Rajkumar");
        addCandidate("Venkatesh");
    }

    function addCandidate (string _name) private {
        candidateCount++;
        candidates[candidateCount] = candidate(candidateCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // Require a valid candidates
        require(_candidateId > 0 && _candidateId <= candidateCount);

        // Record that voter has has voted
        voters[msg.sender] = true;

        // Update candidate vote candidateCount
        candidates[_candidateId].voteCount++;
    }
}