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

    event AirdropClaimed(address indexed account, uint time, uint40 amount);

    address immutable OWNER;
    IERC20 immutable TOKENADDRESS;
    bytes32 merkleRoot;
    uint immutable ENDDATE;

    mapping(address => bool) claimedAddresses;
    uint40 balance;

    constructor(address _tokenAddress, bytes32 _merkleRoot, uint _duration) {
        IERC20 tokenAddress = IERC20(_tokenAddress);

        OWNER = msg.sender;
        TOKENADDRESS = tokenAddress;
        merkleRoot = _merkleRoot;
        ENDDATE = block.timestamp + _duration;
        balance = 1_000_000;
    }

    function claimAirdrop(address _account, uint40 _amount, bytes32[] memory _merkleProof) external {
        if(claimedAddresses[_account] == true) {
            revert UserClaimed();
        }

        if(block.timestamp >= ENDDATE) {
            revert AirdropEnded();
        }

        if(balance == 0 ) {
            revert AirdropExhausted();
        }

        verifyProof(_merkleProof, _amount, _account);

        claimedAddresses[_account] = true;

        balance = balance - _amount;

        TOKENADDRESS.transfer(_account, _amount);

        emit AirdropClaimed(_account, block.timestamp, _amount);
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
