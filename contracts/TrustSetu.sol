// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TrustSetu
 * @dev Stores verification status for Bharat-Setu alumni.
 */
contract TrustSetu {
    mapping(address => bool) public verifiedAlumni;
    address public admin;

    event AlumnusVerified(address indexed alumnus, string certificateHash);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can verify degree");
        _;
    }

    /**
     * @dev Sets an alumnus status to verified.
     * @param _alumnus The address of the alumnus to verify.
     * @param _certificateHash A hash representing the verified degree certificate.
     */
    function verifyAlumnus(address _alumnus, string memory _certificateHash) public onlyAdmin {
        verifiedAlumni[_alumnus] = true;
        emit AlumnusVerified(_alumnus, _certificateHash);
    }

    /**
     * @dev Checks if an alumnus is verified.
     * @param _alumnus The address to check.
     */
    function isVerified(address _alumnus) public view returns (bool) {
        return verifiedAlumni[_alumnus];
    }
}
