// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "./LilypadEventsUpgradeable.sol";
import "./LilypadCallerInterface.sol";

/*
Notes:
Upgradeable contracts: https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable
    In Solidity, code that is inside a constructor or part of a global variable
    declaration is not part of a deployed contract’s runtime bytecode.
    OZ: Due to this requirement of the proxy-based upgradeability system,
    no constructors can be used in upgradeable contracts.
    To learn about the reasons behind this restriction, head to Proxies.
    Another difference between a constructor and a regular function is that Solidity takes care of
    automatically invoking the constructors of all ancestors of a contract. When writing an initializer,
    you need to take special care to manually call the initializers of all parent contracts. Note that
    the initializer modifier can only be called once even when using inheritance, so parent contracts
    should use the onlyInitializing modifier:
Proxy Upgrade Pattern: https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#the-constructor-caveat
*/

contract Lilypad is LilypadCallerInterface {
    receive() external payable {}
    LilypadEventsUpgradeable bridge;

    event JobCreated(
        uint256 indexed jobId,
        address from
    );

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

    /** Lilypad Job via Bacalhau network functions **/
    /** Run your own docker image spec on the network with the _specName = "CustomSpec", You need to pass in the Bacalhau specification for this **/
    function runJob(string memory _spec) external payable {
        uint256 lilypadFee = bridge.getLilypadFee();

        uint id = bridge.runLilypadJob{value: lilypadFee}(address(this), _spec, uint8(LilypadResultType.CID));
        require(id > 0,"Job id was not created!");
        emit JobCreated(id, msg.sender);
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