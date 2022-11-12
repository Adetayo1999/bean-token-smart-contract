import fs from "fs";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const FRONTEND_PATH = "../dapp/consts/data.json";

const updateFrontend: DeployFunction = async ({
  ethers,
  network,
}: HardhatRuntimeEnvironment) => {
  try {
    const beanTokenAddress = await ethers.getContract("BeanToken");

    const abiData = JSON.parse(
      fs.readFileSync("./artifacts/contracts/bean.sol/BeanToken.json", "utf-8")
    );

    const data = {
      [network.config.chainId!]: {
        address: beanTokenAddress.address,
        abi: abiData.abi,
      },
    };

    fs.writeFileSync(FRONTEND_PATH, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export default updateFrontend;
