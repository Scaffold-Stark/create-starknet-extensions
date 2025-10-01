"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useAccount } from "@starknet-react/core";
import { AddressInput, IntegerInput } from "~~/components/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

const ERC20Page: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // State for form inputs
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("0");

  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useScaffoldReadContract({
      contractName: "Erc20Example",
      functionName: "total_supply",
    });

  const { data: userBalance, isLoading: isUserBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc20Example",
      functionName: "balance_of",
      args: [connectedAddress],
    });

  const { sendAsync: mintToken } = useScaffoldWriteContract({
    contractName: "Erc20Example",
    functionName: "mint" as any,
    args: [connectedAddress, 100n],
  });

  const handleMintToken = async () => {
    await mintToken();
  };

  const { sendAsync: transferToken } = useScaffoldWriteContract({
    contractName: "Erc20Example",
    functionName: "transfer",
    args: [transferAddress, BigInt(transferAmount)],
  });

  const handleTransferToken = async () => {
    await transferToken();
  };

  return (
    <div className="flex items-center flex-col justify-between flex-grow pt-10 px-5">
      <div className="flex flex-col justify-center flex-grow max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">ERC-20 Token</h1>

          <div className="space-y-4 text-lg">
            <p>
              This extension introduces an ERC-20 token contract and
              demonstrates how to use interact with it, including getting a
              holder balance and transferring tokens.
            </p>

            <p>
              The ERC-20 Token Standard introduces a standard for Fungible
              Tokens (
              <a
                href="https://eips.ethereum.org/EIPS/eip-20"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                EIP-20
              </a>
              ), in other words, each Token is exactly the same (in type and
              value) as any other Token.
            </p>

            <p>
              The ERC-20 token contract is implemented using the ERC-20 token
              implementation from OpenZeppelin.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <div className="mx-4 text-gray-500 dark:text-gray-400">•••</div>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Interact Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-center mb-6">
            Interact with the token
          </h2>

          <p className="text-center text-lg mb-6">
            Below you can see the total token supply (total amount of minted
            tokens) and your token balance.
          </p>

          <div className="space-y-4 text-lg">
            <p>
              You can use the{" "}
              <span className="font-semibold">Mint 100 Tokens</span> button to
              get 100 new tokens (for free! Check the contract implementation)
            </p>

            <p>
              You can also transfer tokens to another address. Just fill in the
              address and the amount of tokens you want to send and click the
              send button. Test it by opening this page on an incognito window
              and sending tokens to the new generated burner wallet address.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <div className="mx-4 text-gray-500 dark:text-gray-400">•••</div>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Token Information and Actions */}
        <div className="rounded-2xl p-8 mb-8 border-2 border-pink-500 backdrop-blur-sm">
          {/* Token Supply and Balance */}
          <div className="space-y-4 mb-8">
            <div className="text-2xl font-semibold">
              <span className="font-bold">Total Supply:</span>{" "}
              {isTotalSupplyLoading ? "Loading..." : totalSupply?.toString()}{" "}
              tokens
            </div>

            <div className="text-2xl font-semibold">
              <span className="font-bold">Your Balance:</span>{" "}
              {isUserBalanceLoading ? "Loading..." : userBalance?.toString()}{" "}
              tokens
            </div>
          </div>

          {/* Mint Button */}
          <div className="mb-8">
            <button
              className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold rounded-full"
              onClick={handleMintToken}
              disabled={!connectedAddress}
            >
              Mint 100 Tokens
            </button>
          </div>

          {/* Transfer Section */}
          <div
            className={`rounded-xl p-6 border-2 border-pink-500 ${isDarkMode ? "bg-black" : "bg-white"
              }`}
          >
            <h3 className="text-2xl font-bold mb-6">Transfer Tokens</h3>

            <div className="space-y-6">
              {/* Send To Address */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Send To:
                </label>
                <AddressInput
                  value={transferAddress}
                  onChange={setTransferAddress}
                  placeholder="Address"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Amount: <span className="text-sm text-gray-500">Max</span>
                </label>
                <IntegerInput
                  value={transferAmount}
                  onChange={(value) => setTransferAmount(value.toString())}
                  placeholder="0"
                  disableMultiplyBy1e18={true}
                />
              </div>

              {/* Send Button */}
              <div>
                <button
                  className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold rounded-full"
                  onClick={handleTransferToken}
                  disabled={
                    !connectedAddress ||
                    !transferAddress ||
                    !transferAmount ||
                    transferAmount === "0"
                  }
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERC20Page;
