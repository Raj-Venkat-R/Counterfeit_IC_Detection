// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ICRegistry {
    enum Authenticity { REAL, FAKE }

    struct ICRecord {
        string id;                    // e.g., IC-169583...
        string name;                  // e.g., Intel Core i7-13700K
        string manufacturer;          // e.g., Intel Corp
        uint256[] frequencySignature; // simplified numeric signature
        Authenticity authenticity;    // REAL or FAKE
        uint256 confidence;           // 0-100
        address uploadedBy;           // wallet address
        uint256 uploadedAt;           // block timestamp
        bytes32 blockchainHash;       // mock/real tx hash reference
    }

    mapping(string => ICRecord) public records;   // id => record
    string[] public recordIds;                    // index of ids

    event ICSubmitted(
        string indexed id,
        string name,
        string manufacturer,
        Authenticity authenticity,
        uint256 confidence,
        address indexed uploadedBy
    );

    function submitICVerification(
        string memory id,
        string memory name,
        string memory manufacturer,
        uint256[] memory frequencySignature,
        Authenticity authenticity,
        uint256 confidence
    ) external returns (bytes32) {
        require(bytes(id).length > 0, "id required");
        require(bytes(name).length > 0, "name required");
        require(confidence <= 100, "confidence 0-100");

        bytes32 hashRef = keccak256(
            abi.encodePacked(id, name, manufacturer, msg.sender, block.timestamp)
        );

        ICRecord memory rec = ICRecord({
            id: id,
            name: name,
            manufacturer: manufacturer,
            frequencySignature: frequencySignature,
            authenticity: authenticity,
            confidence: confidence,
            uploadedBy: msg.sender,
            uploadedAt: block.timestamp,
            blockchainHash: hashRef
        });

        // If new, add id to index
        if (bytes(records[id].id).length == 0) {
            recordIds.push(id);
        }
        records[id] = rec;

        emit ICSubmitted(id, name, manufacturer, authenticity, confidence, msg.sender);
        return hashRef;
    }

    function getRecord(string memory id) external view returns (ICRecord memory) {
        require(bytes(records[id].id).length != 0, "record not found");
        return records[id];
    }

    function getAllIds() external view returns (string[] memory) {
        return recordIds;
    }
}
