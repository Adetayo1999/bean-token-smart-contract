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
  } catch (error: any) {
    if (error.toString().includes("Contract source code already verified")) {
      console.log("Contract Already Verified...");
    } else console.error(error);
  }
};
