// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.8.24;

/*@@@@@@@       @@@@@@@@@
 @@@@@@@@@       @@@@@@@@@
  @@@@@@@@@       @@@@@@@@@
   @@@@@@@@@       @@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@
     @@@@@  HYPERLANE  @@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@
   @@@@@@@@@       @@@@@@@@@
  @@@@@@@@@       @@@@@@@@@
 @@@@@@@@@       @@@@@@@@@
@@@@@@@@@       @@@@@@@@*/

/// @notice Typed wrappers around tstore/tload opcodes for compatibility with
///         compiler versions that lack the `transient` keyword (< 0.8.28).
///         Tron TVM supports the opcodes but tron-solc lacks the keyword.
library TransientStorage {
    // BEGIN PARIS OVERRIDE
    /// @dev Humanode (Paris) build. The target EVM has no transient storage,
    ///      so values live in regular storage at the same slots, each with a
    ///      tag of the transaction that wrote it: the block number, tx.origin
    ///      and this contract's generation counter. A read whose tag is not
    ///      the current one returns zero, as transient storage does for a
    ///      value written in another transaction. `clearAll` bumps the
    ///      generation, which invalidates every value at once.
    ///
    ///      This is exact for values that are reset before the writing call
    ///      returns (reentrancy guards, callback flags). A same-transaction
    ///      quote that nobody clears stays visible to later transactions of
    ///      the same origin in the same block; QuotedCalls clears the quotes
    ///      it submits before returning.
    bytes32 private constant GENERATION_SLOT =
        keccak256("humanode.TransientStorage.generation");
    bytes32 private constant TAG_SALT =
        keccak256("humanode.TransientStorage.tag");

    function _tagSlot(bytes32 slot) private pure returns (bytes32) {
        return keccak256(abi.encode(slot, TAG_SALT));
    }

    function _generation() private view returns (uint256 generation) {
        bytes32 generationSlot = GENERATION_SLOT;
        assembly {
            generation := sload(generationSlot)
        }
    }

    function _currentTag() private view returns (bytes32) {
        // solhint-disable-next-line avoid-tx-origin
        return keccak256(abi.encode(block.number, tx.origin, _generation()));
    }

    function _write(bytes32 slot, uint256 val) private {
        bytes32 tagSlot = _tagSlot(slot);
        bytes32 tag = _currentTag();
        assembly {
            sstore(slot, val)
            sstore(tagSlot, tag)
        }
    }

    function _read(bytes32 slot) private view returns (uint256 val) {
        bytes32 tagSlot = _tagSlot(slot);
        bytes32 tag;
        assembly {
            tag := sload(tagSlot)
        }
        if (tag != _currentTag()) return 0;
        assembly {
            val := sload(slot)
        }
    }

    /// @notice Invalidates every transient value of the calling contract.
    function clearAll() internal {
        bytes32 generationSlot = GENERATION_SLOT;
        assembly {
            sstore(generationSlot, add(sload(generationSlot), 1))
        }
    }

    // END PARIS OVERRIDE
    // ============ Store ============

    function store(bytes32 slot, uint256 val) internal {
        // BEGIN PARIS OVERRIDE
        _write(slot, val);
        // END PARIS OVERRIDE
    }

    function store(bytes32 slot, address val) internal {
        // BEGIN PARIS OVERRIDE
        _write(slot, uint256(uint160(val)));
        // END PARIS OVERRIDE
    }

    function store(bytes32 slot, bytes32 val) internal {
        // BEGIN PARIS OVERRIDE
        _write(slot, uint256(val));
        // END PARIS OVERRIDE
    }

    // ============ Flag ============

    function set(bytes32 slot) internal {
        // BEGIN PARIS OVERRIDE
        _write(slot, 1);
        // END PARIS OVERRIDE
    }

    function clear(bytes32 slot) internal {
        // BEGIN PARIS OVERRIDE
        _write(slot, 0);
        // END PARIS OVERRIDE
    }

    // ============ Load ============

    function loadUint256(bytes32 slot) internal view returns (uint256 val) {
        // BEGIN PARIS OVERRIDE
        val = _read(slot);
        // END PARIS OVERRIDE
    }

    function loadBool(bytes32 slot) internal view returns (bool) {
        return loadUint256(slot) != 0;
    }

    function loadAddress(bytes32 slot) internal view returns (address) {
        return address(uint160(loadUint256(slot)));
    }

    function loadBytes32(bytes32 slot) internal view returns (bytes32) {
        return bytes32(loadUint256(slot));
    }

    function loadUint128(bytes32 slot) internal view returns (uint128) {
        return uint128(loadUint256(slot));
    }

    function loadUint32(bytes32 slot) internal view returns (uint32) {
        return uint32(loadUint256(slot));
    }
}
