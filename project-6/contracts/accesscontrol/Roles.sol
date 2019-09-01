pragma solidity ^0.5.8;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    modifier noEmptyAddress(address account) {
        require(account != address(0), "account cannot be an empty address");
        _;
    }

    /**
   * @dev give an account access to this role
   */
    function add(Role storage role, address account)
        internal
        noEmptyAddress(account)
    {
        require(!has(role, account), "account already assigned to this role");

        role.bearer[account] = true;
    }

    /**
   * @dev remove an account's access to this role
   */
    function remove(Role storage role, address account)
        internal
        noEmptyAddress(account)
    {
        require(
            has(role, account),
            "account has not been assigned to this role"
        );

        role.bearer[account] = false;
    }

    /**
   * @dev check if an account has this role
   * @return bool
   */
    function has(Role storage role, address account)
        internal
        view
        noEmptyAddress(account)
        returns (bool)
    {
        return role.bearer[account];
    }
}
