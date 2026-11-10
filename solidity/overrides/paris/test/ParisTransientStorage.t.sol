// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.8.24;

// Tests of the Paris variant's transient storage emulation. They run only from
// test-paris.sh, where the overrides are in place.

import {Test} from "forge-std/Test.sol";

import {TransientStorage} from "../../contracts/libs/TransientStorage.sol";
import {AbstractOffchainQuoter} from "../../contracts/libs/AbstractOffchainQuoter.sol";
import {SignedQuote} from "../../contracts/interfaces/IOffchainQuoter.sol";
import {IGPOffchainQuotingTest} from "../igps/IGPOffchainQuoting.t.sol";
import {QuotedCallsTest} from "../token/QuotedCalls.t.sol";

contract TransientHarness {
    using TransientStorage for bytes32;

    bytes32 private constant SLOT = keccak256("harness.slot");

    function store(uint256 value) external {
        SLOT.store(value);
    }

    function load() external view returns (uint256) {
        return SLOT.loadUint256();
    }

    function set() external {
        SLOT.set();
    }

    function isSet() external view returns (bool) {
        return SLOT.loadBool();
    }

    function clearSlot() external {
        SLOT.clear();
    }

    function clearAll() external {
        TransientStorage.clearAll();
    }

    /// @dev A value reset within the writing call, like a reentrancy guard.
    function setAndClear() external returns (bool seenWhileSet) {
        SLOT.set();
        seenWhileSet = SLOT.loadBool();
        SLOT.clear();
    }
}

contract ParisTransientStorageTest is Test {
    address constant OTHER_ORIGIN = address(0xBEEF);

    TransientHarness harness;

    function setUp() public {
        harness = new TransientHarness();
    }

    function test_sameTransaction_readsValue() public {
        harness.store(42);
        assertEq(harness.load(), 42);
    }

    function test_nextBlock_readsZero() public {
        harness.store(42);
        vm.roll(block.number + 1);
        assertEq(harness.load(), 0);
    }

    function test_otherOrigin_readsZero() public {
        harness.store(42);
        vm.prank(address(this), OTHER_ORIGIN);
        assertEq(harness.load(), 0);
        // The origin that wrote it still reads it.
        assertEq(harness.load(), 42);
    }

    function test_staleValue_overwritten() public {
        harness.store(42);
        vm.roll(block.number + 1);
        harness.store(7);
        assertEq(harness.load(), 7);
    }

    function test_clearAll_invalidatesAndAllowsNewWrites() public {
        harness.store(42);
        harness.clearAll();
        assertEq(harness.load(), 0);
        harness.store(7);
        assertEq(harness.load(), 7);
    }

    function test_flag_setAndClear() public {
        harness.set();
        assertTrue(harness.isSet());
        harness.clearSlot();
        assertFalse(harness.isSet());
    }

    function test_valueResetWithinCall_leavesNothing() public {
        assertTrue(harness.setAndClear());
        assertFalse(harness.isSet());
        vm.roll(block.number + 1);
        assertFalse(harness.isSet());
    }
}

contract ParisIGPTransientQuoteTest is IGPOffchainQuotingTest {
    address constant OTHER = address(0xBEEF);

    function _submitTransientQuote() internal {
        _submitTransient(address(0), DEST, address(this), EXCHANGE_RATE, GAS_PRICE);
    }

    function test_paris_transientQuote_appliesInItsTransactionOnly() public {
        uint256 oracleFee = igp.quoteGasPayment(DEST, GAS_LIMIT);
        _submitTransientQuote();
        uint256 quotedFee = igp.quoteGasPayment(DEST, GAS_LIMIT);
        assertTrue(quotedFee != oracleFee);

        vm.roll(block.number + 1);
        assertEq(igp.quoteGasPayment(DEST, GAS_LIMIT), oracleFee);
    }

    function test_paris_transientQuote_invisibleToOtherOrigin() public {
        uint256 oracleFee = igp.quoteGasPayment(DEST, GAS_LIMIT);
        _submitTransientQuote();
        vm.prank(address(this), OTHER);
        assertEq(igp.quoteGasPayment(DEST, GAS_LIMIT), oracleFee);
    }

    function test_paris_clearTransientQuote_bySubmitter() public {
        uint256 oracleFee = igp.quoteGasPayment(DEST, GAS_LIMIT);
        _submitTransientQuote();
        igp.clearTransientQuote();
        assertEq(igp.quoteGasPayment(DEST, GAS_LIMIT), oracleFee);
    }

    function test_paris_clearTransientQuote_revertsForOthers() public {
        _submitTransientQuote();
        uint256 quotedFee = igp.quoteGasPayment(DEST, GAS_LIMIT);
        vm.prank(OTHER);
        vm.expectRevert(AbstractOffchainQuoter.NotTransientSubmitter.selector);
        igp.clearTransientQuote();
        // The quote is still in force.
        assertEq(igp.quoteGasPayment(DEST, GAS_LIMIT), quotedFee);
    }

    function test_paris_clearTransientQuote_noopWithoutQuote() public {
        vm.prank(OTHER);
        igp.clearTransientQuote();
    }

    function test_paris_clearTransientQuote_staleRecordIsNoRecord() public {
        _submitTransientQuote();
        vm.roll(block.number + 1);
        vm.prank(OTHER);
        igp.clearTransientQuote();
    }
}

contract ParisQuotedCallsTest is QuotedCallsTest {
    function _localTokenQuote() internal returns (uint256) {
        vm.prank(address(localToken));
        return igp.quoteGasPayment(DESTINATION, GAS_LIMIT);
    }

    function _igpTransientQuoteFor(address caller) internal view returns (bytes memory) {
        return _buildIgpQuote(true, caller, address(0), address(localToken));
    }

    function test_paris_directSubmit_isObservedUntilCleared() public {
        uint256 oracleFee = _localTokenQuote();
        (, SignedQuote memory sq, bytes memory signature, ) = abi.decode(
            _igpTransientQuoteFor(ALICE),
            (address, SignedQuote, bytes, bytes32)
        );
        vm.prank(address(quotedCalls));
        igp.submitQuote(sq, signature);
        // quoteGasPayment(domain, gasLimit) excludes the destination gas
        // overhead, so compare against the quote's own rate and gas price.
        assertEq(
            _localTokenQuote(),
            (GAS_LIMIT * OFFCHAIN_GAS_PRICE * OFFCHAIN_EXCHANGE_RATE) / 1e10
        );
        assertTrue(_localTokenQuote() != oracleFee);

        vm.prank(address(quotedCalls));
        igp.clearTransientQuote();
        assertEq(_localTokenQuote(), oracleFee);
    }

    function test_paris_execute_leavesNoTransientQuote() public {
        uint256 oracleFee = _localTokenQuote();
        bytes memory commands = new bytes(1);
        bytes[] memory inputs = new bytes[](1);
        (commands[0], inputs[0]) = _cmdSubmitQuote(_igpTransientQuoteFor(ALICE));

        vm.prank(ALICE);
        quotedCalls.execute(commands, inputs);

        assertEq(_localTokenQuote(), oracleFee);
    }

    function test_paris_quoteExecute_leavesNoTransientQuote() public {
        uint256 oracleFee = _localTokenQuote();
        bytes memory commands = new bytes(1);
        bytes[] memory inputs = new bytes[](1);
        (commands[0], inputs[0]) = _cmdSubmitQuote(_igpTransientQuoteFor(ALICE));

        vm.prank(ALICE);
        quotedCalls.quoteExecute(commands, inputs);

        assertEq(_localTokenQuote(), oracleFee);
    }
}
