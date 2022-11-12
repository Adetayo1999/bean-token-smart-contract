import fs from "fs";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const FRONTEND_PATH = "../dapp/consts/data.json";

const updateFrontend: DeployFunction = async ({
  ethers,
  network,
  deployments,
}: HardhatRuntimeEnvironment) => {
  try {
    const { log } = deployments;

    log("*************** Updating Frontend ************************");

    const beanTokenAddress = await ethers.getContract("BeanToken");

    const abiData = JSON.parse(
      fs.readFileSync("./artifacts/contracts/bean.sol/BeanToken.json", "utf-8")
    );

    let data: any;

    const frontendFile = JSON.parse(fs.readFileSync(FRONTEND_PATH, "utf-8"));

    log(
      `******************** Updating Frontend For ${network.name} with chain ID ${network.config.chainId} *******************`
    );

    if (!frontendFile) {
      data = {
        [network.config.chainId!]: {
          address: beanTokenAddress.address,
          abi: abiData.abi,
        },
      };
    } else {
      data = { ...frontendFile };
      data[network.config.chainId!] = {
        address: beanTokenAddress.address,
        abi: abiData.abi,
      };
    }

    fs.writeFileSync(FRONTEND_PATH, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

export default updateFrontend;
