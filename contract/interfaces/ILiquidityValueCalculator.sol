// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.6.6;

interface ILiquidityValueCalculator {
    function computeLiquidityShareValue(uint liquidity, address tokenA, address tokenB) external returns (
        uint tokenAAmount, uint tokenBAmount
    );
}