"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useAccount } from "@starknet-react/core";
import { AddressInput, IntegerInput } from "~~/components/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

// Helper function to safely convert string to BigInt (handles decimals)
const safeBigInt = (value: string): bigint => {
  const integerPart = value.split(".")[0];
  return BigInt(integerPart || "0");
};

const ERC1155Page: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // State for form inputs
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("0");
  const [selectedTokenId, setSelectedTokenId] = useState<string>("0");

  // Game item IDs (hardcoded from contract constants)
  const goldId = 0n;
  const silverId = 1n;
  const thorsHammerId = 2n;
  const swordId = 3n;
  const shieldId = 4n;

  // Get balances for each game item (using hardcoded IDs from contract)
  const { data: goldBalance, isLoading: isGoldBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc1155Example",
      functionName: "balance_of",
      args: [connectedAddress, goldId],
      enabled: !!connectedAddress,
    });

  const { data: silverBalance, isLoading: isSilverBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc1155Example",
      functionName: "balance_of",
      args: [connectedAddress, silverId],
      enabled: !!connectedAddress,
    });

  const { data: thorsHammerBalance, isLoading: isThorsHammerBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc1155Example",
      functionName: "balance_of",
      args: [connectedAddress, thorsHammerId],
      enabled: !!connectedAddress,
    });

  const { data: swordBalance, isLoading: isSwordBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc1155Example",
      functionName: "balance_of",
      args: [connectedAddress, swordId],
      enabled: !!connectedAddress,
    });

  const { data: shieldBalance, isLoading: isShieldBalanceLoading } =
    useScaffoldReadContract({
      contractName: "Erc1155Example",
      functionName: "balance_of",
      args: [connectedAddress, shieldId],
      enabled: !!connectedAddress,
    });

  // Mint functions for each game item (using hardcoded IDs)
  const { sendAsync: mintGold } = useScaffoldWriteContract({
    contractName: "Erc1155Example",
    functionName: "mint_item",
    args: [connectedAddress, goldId, 100n, []],
  });

  const { sendAsync: mintSilver } = useScaffoldWriteContract({
    contractName: "Erc1155Example",
    functionName: "mint_item",
    args: [connectedAddress, silverId, 100n, []],
  });

  const { sendAsync: mintThorsHammer } = useScaffoldWriteContract({
    contractName: "Erc1155Example",
    functionName: "mint_item",
    args: [connectedAddress, thorsHammerId, 1n, []],
  });

  const { sendAsync: mintSword } = useScaffoldWriteContract({
    contractName: "Erc1155Example",
    functionName: "mint_item",
    args: [connectedAddress, swordId, 100n, []],
  });

  const { sendAsync: mintShield } = useScaffoldWriteContract({
    contractName: "Erc1155Example",
    functionName: "mint_item",
    args: [connectedAddress, shieldId, 100n, []],
  });

  // Transfer function
  const { sendAsync: transferToken } = useScaffoldWriteContract({
    contractName: "Erc1155Example",
    functionName: "safe_transfer_from",
    args: [
      connectedAddress,
      transferAddress,
      safeBigInt(selectedTokenId),
      safeBigInt(transferAmount),
      [],
    ],
  });

  const handleMintGold = async () => {
    if (mintGold) await mintGold();
  };

  const handleMintSilver = async () => {
    if (mintSilver) await mintSilver();
  };

  const handleMintThorsHammer = async () => {
    if (mintThorsHammer) await mintThorsHammer();
  };

  const handleMintSword = async () => {
    if (mintSword) await mintSword();
  };

  const handleMintShield = async () => {
    if (mintShield) await mintShield();
  };

  const handleTransferToken = async () => {
    if (transferToken) await transferToken();
  };

  return (
    <div className="flex items-center flex-col justify-between flex-grow pt-10 px-5">
      <div className="flex flex-col justify-center flex-grow max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">🎮 Game Items (ERC-1155)</h1>

          <div className="space-y-4 text-lg">
            <p>
              This extension demonstrates an ERC-1155 multi-token contract with
              game items including Gold, Silver, Thor&apos;s Hammer, Sword, and
              Shield. Each item has different properties and can be minted and
              transferred.
            </p>

            <p>
              The ERC-1155 Token Standard (
              <a
                href="https://eips.ethereum.org/EIPS/eip-1155"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                EIP-1155
              </a>
              ) allows for both fungible and non-fungible tokens in a single
              contract. Perfect for game items where you might have multiple
              copies of some items (like Gold coins) and unique items (like
              Thor&apos;s Hammer).
            </p>

            <p>
              The contract is implemented using OpenZeppelin&apos;s ERC-1155
              component and includes ownership controls for minting new items.
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
            Interact with Game Items
          </h2>

          <p className="text-center text-lg mb-6">
            Below you can see your balances for each game item and mint new
            items (owner only). You can also transfer items to other addresses.
          </p>

          <div className="space-y-4 text-lg">
            <p>
              As the contract owner, you can mint new game items using the mint
              buttons. Each item has different properties - Gold and Silver are
              abundant resources, while Thor&apos;s Hammer is a unique legendary
              item.
            </p>

            <p>
              You can transfer any of your game items to another address. Select
              the item type, enter the recipient address and amount, then click
              send.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <div className="mx-4 text-gray-500 dark:text-gray-400">•••</div>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Game Items Information and Actions */}
        <div className="rounded-2xl p-8 mb-8 border-2 border-pink-500 backdrop-blur-sm">
          {/* Game Items Balances */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Your Game Items (Only Owner can mint)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Gold */}
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                  🪙 Gold
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-300">
                  Balance:{" "}
                  {isGoldBalanceLoading
                    ? "Loading..."
                    : goldBalance?.toString() || "0"}
                </div>
                <div className="text-xs text-yellow-500 dark:text-yellow-400">
                  ID: {goldId.toString()}
                </div>
                <button
                  className="btn btn-sm btn-warning mt-2"
                  onClick={handleMintGold}
                  disabled={!connectedAddress}
                >
                  Mint 100 Gold
                </button>
              </div>

              {/* Silver */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  🥈 Silver
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Balance:{" "}
                  {isSilverBalanceLoading
                    ? "Loading..."
                    : silverBalance?.toString() || "0"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {silverId.toString()}
                </div>
                <button
                  className="btn btn-sm btn-secondary mt-2"
                  onClick={handleMintSilver}
                  disabled={!connectedAddress}
                >
                  Mint 100 Silver
                </button>
              </div>

              {/* Thor&apos;s Hammer */}
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
                  🔨 Thor&apos;s Hammer
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">
                  Balance:{" "}
                  {isThorsHammerBalanceLoading
                    ? "Loading..."
                    : thorsHammerBalance?.toString() || "0"}
                </div>
                <div className="text-xs text-purple-500 dark:text-purple-400">
                  ID: {thorsHammerId.toString()}
                </div>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={handleMintThorsHammer}
                  disabled={!connectedAddress}
                >
                  Mint 1 Hammer
                </button>
              </div>

              {/* Sword */}
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  ⚔️ Sword
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  Balance:{" "}
                  {isSwordBalanceLoading
                    ? "Loading..."
                    : swordBalance?.toString() || "0"}
                </div>
                <div className="text-xs text-blue-500 dark:text-blue-400">
                  ID: {swordId.toString()}
                </div>
                <button
                  className="btn btn-sm btn-info mt-2"
                  onClick={handleMintSword}
                  disabled={!connectedAddress}
                >
                  Mint 100 Swords
                </button>
              </div>

              {/* Shield */}
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                <div className="text-lg font-bold text-green-800 dark:text-green-200">
                  🛡️ Shield
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Balance:{" "}
                  {isShieldBalanceLoading
                    ? "Loading..."
                    : shieldBalance?.toString() || "0"}
                </div>
                <div className="text-xs text-green-500 dark:text-green-400">
                  ID: {shieldId.toString()}
                </div>
                <button
                  className="btn btn-sm btn-success mt-2"
                  onClick={handleMintShield}
                  disabled={!connectedAddress}
                >
                  Mint 100 Shields
                </button>
              </div>
            </div>
          </div>

          {/* Transfer Section */}
          <div
            className={`rounded-xl p-6 border-2 border-pink-500 ${
              isDarkMode ? "bg-black" : "bg-white"
            }`}
          >
            <h3 className="text-2xl font-bold mb-6">Transfer Game Items</h3>

            <div className="space-y-6">
              {/* Item Selection */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Select Item to Transfer:
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedTokenId}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                >
                  <option value="0">🪙 Gold (ID: 0)</option>
                  <option value="1">🥈 Silver (ID: 1)</option>
                  <option value="2">🔨 Thor&apos;s Hammer (ID: 2)</option>
                  <option value="3">⚔️ Sword (ID: 3)</option>
                  <option value="4">🛡️ Shield (ID: 4)</option>
                </select>
              </div>

              {/* Send To Address */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Send To:
                </label>
                <AddressInput
                  value={transferAddress}
                  onChange={setTransferAddress}
                  placeholder="Recipient address"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Amount:{" "}
                  <span className="text-sm text-gray-500">(Integer only)</span>
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
                  Transfer Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERC1155Page;
