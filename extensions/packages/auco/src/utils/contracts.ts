import deployedContracts from "../contracts/deployedContracts";
import globalConfig from "../../auco.config";

/**
 * Retrieves contract information by name from the deployed contracts configuration
 * for the currently configured network. To be used with auco onEvent or onReorg
 *
 * @param name - The name of the contract to retrieve, must be a valid contract name
 *               for the current network configuration
 * @returns An object containing the contract address and ABI for the specified contract
 */
export const getContractByName = (
  name: keyof (typeof deployedContracts)[keyof typeof deployedContracts],
) => {
  return {
    contractAddress: deployedContracts[globalConfig.network][name].address,
    abi: deployedContracts[globalConfig.network][name].abi,
  };
};
