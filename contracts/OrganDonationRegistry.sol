// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OrganDonationRegistry is Ownable {
    struct Donor {
        string name;
        uint8 age;
        string bloodType;
        string[] organs;
        string medicalHistory;
        uint256 timestamp;
        bool isActive;
    }
    
    struct Recipient {
        string name;
        uint8 age;
        string bloodType;
        string organNeeded;
        uint8 urgencyLevel; // 1-10, 10 being most urgent
        string medicalHistory;
        uint256 timestamp;
        bool isActive;
    }
    
    struct Match {
        address donor;
        address recipient;
        string organ;
        uint256 timestamp;
        bool isCompleted;
    }
    
    mapping(address => Donor) public donors;
    mapping(address => Recipient) public recipients;
    mapping(address => bool) public isDonor;
    mapping(address => bool) public isRecipient;
    
    address[] public donorAddresses;
    address[] public recipientAddresses;
    
    Match[] public matches;
    
    event DonorRegistered(address indexed donor, string name, string[] organs);
    event DonorRevoked(address indexed donor);
    event RecipientRegistered(address indexed recipient, string name, string organNeeded);
    event RecipientRevoked(address indexed recipient);
    event MatchCreated(address indexed donor, address indexed recipient, string organ);
    event MatchCompleted(address indexed donor, address indexed recipient, string organ);
    
    constructor() Ownable(msg.sender) {}
    
    function registerDonor(
        string memory _name,
        uint8 _age,
        string memory _bloodType,
        string[] memory _organs,
        string memory _medicalHistory
    ) public {
        require(_age >= 18, "Donor must be at least 18 years old");
        require(_organs.length > 0, "Must donate at least one organ");
        
        Donor storage donor = donors[msg.sender];
        donor.name = _name;
        donor.age = _age;
        donor.bloodType = _bloodType;
        donor.organs = _organs;
        donor.medicalHistory = _medicalHistory;
        donor.timestamp = block.timestamp;
        donor.isActive = true;
        
        if (!isDonor[msg.sender]) {
            isDonor[msg.sender] = true;
            donorAddresses.push(msg.sender);
        }
        
        emit DonorRegistered(msg.sender, _name, _organs);
        
        // Check for potential matches
        findMatches(msg.sender);
    }
    
    function registerRecipient(
        string memory _name,
        uint8 _age,
        string memory _bloodType,
        string memory _organNeeded,
        uint8 _urgencyLevel,
        string memory _medicalHistory
    ) public {
        require(_urgencyLevel > 0 && _urgencyLevel <= 10, "Urgency level must be between 1 and 10");
        
        Recipient storage recipient = recipients[msg.sender];
        recipient.name = _name;
        recipient.age = _age;
        recipient.bloodType = _bloodType;
        recipient.organNeeded = _organNeeded;
        recipient.urgencyLevel = _urgencyLevel;
        recipient.medicalHistory = _medicalHistory;
        recipient.timestamp = block.timestamp;
        recipient.isActive = true;
        
        if (!isRecipient[msg.sender]) {
            isRecipient[msg.sender] = true;
            recipientAddresses.push(msg.sender);
        }
        
        emit RecipientRegistered(msg.sender, _name, _organNeeded);
        
        // Check for potential matches
        findMatchesForRecipient(msg.sender);
    }
    
    function revokeDonation() public {
        require(isDonor[msg.sender], "Not registered as a donor");
        donors[msg.sender].isActive = false;
        emit DonorRevoked(msg.sender);
    }
    
    function revokeRecipient() public {
        require(isRecipient[msg.sender], "Not registered as a recipient");
        recipients[msg.sender].isActive = false;
        emit RecipientRevoked(msg.sender);
    }
    
    function findMatches(address donorAddress) internal {
        Donor storage donor = donors[donorAddress];
        
        for (uint i = 0; i < recipientAddresses.length; i++) {
            address recipientAddress = recipientAddresses[i];
            Recipient storage recipient = recipients[recipientAddress];
            
            if (!recipient.isActive) continue;
            
            // Check if blood types are compatible
            if (areBloodTypesCompatible(donor.bloodType, recipient.bloodType)) {
                // Check if donor has the organ needed by recipient
                for (uint j = 0; j < donor.organs.length; j++) {
                    if (keccak256(bytes(donor.organs[j])) == keccak256(bytes(recipient.organNeeded))) {
                        // Create a match
                        matches.push(Match({
                            donor: donorAddress,
                            recipient: recipientAddress,
                            organ: recipient.organNeeded,
                            timestamp: block.timestamp,
                            isCompleted: false
                        }));
                        
                        emit MatchCreated(donorAddress, recipientAddress, recipient.organNeeded);
                        break;
                    }
                }
            }
        }
    }
    
    function findMatchesForRecipient(address recipientAddress) internal {
        Recipient storage recipient = recipients[recipientAddress];
        
        for (uint i = 0; i < donorAddresses.length; i++) {
            address donorAddress = donorAddresses[i];
            Donor storage donor = donors[donorAddress];
            
            if (!donor.isActive) continue;
            
            // Check if blood types are compatible
            if (areBloodTypesCompatible(donor.bloodType, recipient.bloodType)) {
                // Check if donor has the organ needed by recipient
                for (uint j = 0; j < donor.organs.length; j++) {
                    if (keccak256(bytes(donor.organs[j])) == keccak256(bytes(recipient.organNeeded))) {
                        // Create a match
                        matches.push(Match({
                            donor: donorAddress,
                            recipient: recipientAddress,
                            organ: recipient.organNeeded,
                            timestamp: block.timestamp,
                            isCompleted: false
                        }));
                        
                        emit MatchCreated(donorAddress, recipientAddress, recipient.organNeeded);
                        break;
                    }
                }
            }
        }
    }
    
    function completeMatch(uint256 matchIndex) public onlyOwner {
        require(matchIndex < matches.length, "Match does not exist");
        require(!matches[matchIndex].isCompleted, "Match already completed");
        
        matches[matchIndex].isCompleted = true;
        
        emit MatchCompleted(
            matches[matchIndex].donor,
            matches[matchIndex].recipient,
            matches[matchIndex].organ
        );
    }
    
    function getDonorInfo(address donorAddress) public view returns (
        string memory name,
        uint8 age,
        string memory bloodType,
        string[] memory organs,
        string memory medicalHistory,
        uint256 timestamp,
        bool isActive
    ) {
        require(isDonor[donorAddress], "Not registered as a donor");
        Donor storage donor = donors[donorAddress];
        
        return (
            donor.name,
            donor.age,
            donor.bloodType,
            donor.organs,
            donor.medicalHistory,
            donor.timestamp,
            donor.isActive
        );
    }
    
    function getRecipientInfo(address recipientAddress) public view returns (
        string memory name,
        uint8 age,
        string memory bloodType,
        string memory organNeeded,
        uint8 urgencyLevel,
        string memory medicalHistory,
        uint256 timestamp,
        bool isActive
    ) {
        require(isRecipient[recipientAddress], "Not registered as a recipient");
        Recipient storage recipient = recipients[recipientAddress];
        
        return (
            recipient.name,
            recipient.age,
            recipient.bloodType,
            recipient.organNeeded,
            recipient.urgencyLevel,
            recipient.medicalHistory,
            recipient.timestamp,
            recipient.isActive
        );
    }
    
    function getMatchesCount() public view returns (uint256) {
        return matches.length;
    }
    
    function getDonorsCount() public view returns (uint256) {
        return donorAddresses.length;
    }
    
    function getRecipientsCount() public view returns (uint256) {
        return recipientAddresses.length;
    }
    
    function areBloodTypesCompatible(string memory donorBloodType, string memory recipientBloodType) internal pure returns (bool) {
        // This is a simplified version of blood type compatibility
        // In a real-world scenario, this would be more complex
        
        // Universal donor: O- can donate to anyone
        if (keccak256(bytes(donorBloodType)) == keccak256(bytes("O-"))) {
            return true;
        }
        
        // Universal recipient: AB+ can receive from anyone
        if (keccak256(bytes(recipientBloodType)) == keccak256(bytes("AB+"))) {
            return true;
        }
        
        // Same blood type is always compatible
        if (keccak256(bytes(donorBloodType)) == keccak256(bytes(recipientBloodType))) {
            return true;
        }
        
        // Other compatibility rules would go here
        
        return false;
    }
}