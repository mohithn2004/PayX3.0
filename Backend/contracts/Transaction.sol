// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction {
    event TransactionExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );
    
    event TransactionFailed(
        address indexed from,
        address indexed to,
        uint256 amount,
        string reason
    );

    struct TransactionDetails {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }

    TransactionDetails[] public transactions;
    
    mapping(address => uint256) public balances;

    function sendTransaction(address payable _to) public payable {
        require(_to != address(0), "Invalid recipient address");
        require(msg.value > 0, "Amount must be greater than 0");
        require(_to != msg.sender, "Cannot send to yourself");

        (bool sent, ) = _to.call{value: msg.value}("");
        
        if (sent) {
            transactions.push(TransactionDetails({
                from: msg.sender,
                to: _to,
                amount: msg.value,
                timestamp: block.timestamp,
                completed: true
            }));

            balances[msg.sender] += msg.value;

            emit TransactionExecuted(
                msg.sender,
                _to,
                msg.value,
                block.timestamp
            );
        } else {
            emit TransactionFailed(
                msg.sender,
                _to,
                msg.value,
                "Transaction failed"
            );
            revert("Failed to send ETH");
        }
    }

    function getTransactions() public view returns (TransactionDetails[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
    }

    function isValidAddress(address _address) public pure returns (bool) {
        return _address != address(0);
    }
}