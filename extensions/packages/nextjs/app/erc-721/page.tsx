"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useAccount } from "@starknet-react/core";
import { AddressInput } from "~~/components/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

const ERC721Page: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // State for form inputs
  const [mintToAddress, setMintToAddress] = useState<string>("");

  // Mock data - in a real app these would come from contract calls
  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useScaffoldReadContract({
      contractName: "Erc721Example",
      functionName: "total_supply",
    });

  const { data: userBalance, isLoading: isUserBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc721Example",
      functionName: "balance_of",
      args: [connectedAddress],
    });

  const { sendAsync: mintItem } = useScaffoldWriteContract({
    contractName: "Erc721Example",
    functionName: "mint_item",
    args: [connectedAddress],
  });

  const { sendAsync: mintItemToAddress } = useScaffoldWriteContract({
    contractName: "Erc721Example",
    functionName: "mint_item",
    args: [mintToAddress],
  });

  return (
    <div className="flex items-center flex-col justify-between flex-grow pt-10 px-5">
      <div className="flex flex-col justify-center flex-grow max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">ERC-721 NFT</h1>

          <div className="space-y-4 text-lg">
            <p>
              This extension introduces an ERC-721 token contract and
              demonstrates how to use it, including getting the total supply and
              holder balance, listing all NFTs from the collection and NFTs from
              the connected address, and how to transfer NFTs.
            </p>

            <p>
              The ERC-721 Token Standard introduces a standard for Non-Fungible
              Tokens (
              <a
                href="https://eips.ethereum.org/EIPS/eip-721"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                EIP-721
              </a>
              ), in other words, each token is unique.
            </p>

            <p>
              The ERC-721 token contract is implemented using the ERC-721 token
              implementation from OpenZeppelin.
            </p>

            <p>
              The ERC-721 token implementation uses the ERC-721 Enumerable
              extension from OpenZeppelin to list all tokens from the collection
              and all the tokens owned by an address. You can remove this if you
              plan to use an indexer, like a Subgraph or Ponder.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-8"></div>

        {/* Interact Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Interact with the NFT</h2>

          <p className="text-lg mb-6">
            Below you can mint an NFT for yourself or to another address.
          </p>

          <div className="space-y-4 text-lg">
            <p>
              You can see your balance and your NFTs, and below that, you can
              see the total supply and all the NFTs minted.
            </p>

            <p>
              Check the code under packages/nextjs/app/erc721 to learn more
              about how to interact with the ERC721 contract.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-8"></div>

        {/* Actions Section */}
        <div
          className={`space-y-6 mb-8 p-6 ${
            isDarkMode ? "bg-black" : "bg-gray-100"
          } border-2 border-pink-500 rounded-2xl`}
        >
          {/* Mint to Your Address */}
          <div className="text-center">
            <button
              className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold rounded-full"
              onClick={() => mintItem()}
              disabled={!connectedAddress}
            >
              Mint token to your address
            </button>
          </div>

          {/* Mint to Another Address */}
          <div
            className={`rounded-xl p-6 ${
              isDarkMode ? "bg-black" : "bg-gray-100"
            }`}
          >
            <h3 className="text-2xl font-bold mb-6">
              Mint token to another address
            </h3>
            <div className="space-y-6">
              {/* To Address */}
              <div>
                <label className="block text-lg font-medium mb-2">To:</label>
                <AddressInput
                  value={mintToAddress}
                  onChange={setMintToAddress}
                  placeholder="Address"
                />
              </div>

              {/* Mint Button */}
              <div>
                <button
                  className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold rounded-full"
                  onClick={() => mintItemToAddress()}
                  disabled={!connectedAddress || !mintToAddress}
                >
                  Mint
                </button>
              </div>
            </div>
          </div>

          {/* Balance and Supply Information */}
          <div className="space-y-4 mb-8">
            <div className="text-2xl font-semibold">
              <span className="font-bold">Your Balance:</span>{" "}
              {isUserBalanceLoading ? "Loading..." : userBalance?.toString()}{" "}
              tokens
            </div>

            <div className="text-2xl font-semibold">
              <span className="font-bold">Total Supply:</span>{" "}
              {isTotalSupplyLoading ? "Loading..." : totalSupply?.toString()}{" "}
              tokens
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERC721Page;
