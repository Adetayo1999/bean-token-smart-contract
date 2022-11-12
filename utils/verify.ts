import { run } from "hardhat";

export const verifyContract = async (
  contractAddress: string,
  constructorArguments: any[]
) => {
  try {
    await run("verify:verify", {
      constructorArguments,
      address: contractAddress,
    });
  } catch (error) {
    console.error(error);
  }
};
