// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "./LilypadEventsUpgradeable.sol";
import "./LilypadCallerInterface.sol";

contract Lilypad is LilypadCallerInterface {
    LilypadEventsUpgradeable bridge;

    event JobCompleted(
        uint256 indexed jobId,
        address from,
        LilypadResultType resultType,
        string result
    );

    event JobCanceled(
        uint256 indexed jobId,
        address from,
        string result
    );

    constructor(address bridgeContract) {
        bridge = LilypadEventsUpgradeable(bridgeContract);
    }

    function runJob(string memory _spec) external payable returns(uint256) {
        uint256 lilypadFee = bridge.getLilypadFee();

        uint256 jobId = bridge.runLilypadJob{value: lilypadFee}(address(this), _spec, uint8(LilypadResultType.CID));
        return jobId;
    }

    function getLilypadFee() private view returns (uint256) {
        return bridge.getLilypadFee();
    }

    // Callbacks
    function lilypadFulfilled(
        address _from,
        uint _jobId,
        LilypadResultType _resultType,
        string calldata _result
    ) external override {
        emit JobCompleted(_jobId, _from, _resultType, _result);
    }

    function lilypadCancelled(
        address _from,
        uint256 _jobId,
        string calldata _errorMsg
    ) external override {
        emit JobCanceled(_jobId, _from, _errorMsg);
    }
}