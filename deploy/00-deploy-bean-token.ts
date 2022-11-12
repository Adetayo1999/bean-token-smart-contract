import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../utils/dev-chains";
import { verifyContract } from "../utils/verify";

const contractName = "BeanToken";

const DeployBeanToken: DeployFunction = async ({
  deployments,
  ethers,
  network,
}: HardhatRuntimeEnvironment) => {
  try {
    const [deployer] = await ethers.getSigners();
    const { log, deploy } = deployments;
    log("****************** Deploying Bean Token ****************************");

    const CONSTRUCTOR_ARGUMENTS = ["Bean Token", "BNT"];

    const beanToken = await deploy(contractName, {
      from: deployer.address,
      args: CONSTRUCTOR_ARGUMENTS,
      log: true,
      waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
    });

    log(
      `************ Bean Token Deployed at ${beanToken.address} *******************`
    );

    if (!developmentChains.includes(network.name)) {
      log(
        "****************** Verifying " + contractName + " ******************"
      );
      await verifyContract(beanToken.address, CONSTRUCTOR_ARGUMENTS);
      log(
        `********************* ${contractName} verified on ${network.name} ********************`
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export default DeployBeanToken;
