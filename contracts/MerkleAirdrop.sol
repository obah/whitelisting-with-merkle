// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MerkleAirdrop{
    error InvalidProof();
    error UserClaimed();
    error OnlyOwner();
    error AirdropEnded();
    error AirdropActive();
    error AirdropExhausted();

    event AirdropClaimed(address indexed account, uint time, uint256 amount);

    address immutable public OWNER;
    IERC20 immutable public TOKENADDRESS;
    bytes32 public merkleRoot;
    uint immutable ENDDATE;

    mapping(address => bool) claimedAddresses;
    uint256 balance;

    constructor(address _tokenAddress, bytes32 _merkleRoot, uint _duration) {
        IERC20 tokenAddress = IERC20(_tokenAddress);

        OWNER = msg.sender;
        TOKENADDRESS = tokenAddress;
        merkleRoot = _merkleRoot;
        ENDDATE = block.timestamp + _duration;
        balance = 1_000_000;
    }

    function claimAirdrop(bytes32[] memory _merkleProof) external {
        if(claimedAddresses[msg.sender] == true) {
            revert UserClaimed();
        }

        if(block.timestamp >= ENDDATE) {
            revert AirdropEnded();
        }

        if(balance == 0 ) {
            revert AirdropExhausted();
        }

        uint256 amount = 1_000e18;

        verifyProof(_merkleProof, amount, msg.sender);

        claimedAddresses[msg.sender] = true;

        balance = balance - amount;

        TOKENADDRESS.transfer(msg.sender, amount);

        emit AirdropClaimed(msg.sender, block.timestamp, amount);
    }

    function verifyProof(bytes32[] memory _proof, uint256 _amount, address _address) private view {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(_address, _amount))));

        if (!MerkleProof.verify(_proof, merkleRoot, leaf)){
            revert InvalidProof();
        }
    }

    function updateMerkleRoot(bytes32 _merkleRoot) public {
        if(msg.sender != OWNER) {
            revert OnlyOwner();
        }

        merkleRoot = _merkleRoot;
    }

    function withdraw(address _to) private {
         if(msg.sender != OWNER) {
            revert OnlyOwner();
        }

        if(block.timestamp < ENDDATE) {
            revert AirdropActive();
        }

        if(balance == 0 ) {
            revert AirdropExhausted();
        }

        TOKENADDRESS.transfer(_to, balance);
    }
}
