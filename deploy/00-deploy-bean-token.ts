import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const DeployBeanToken: DeployFunction = async ({
  deployments,
  ethers,
}: HardhatRuntimeEnvironment) => {
  try {
    const [deployer] = await ethers.getSigners();
    const { log, deploy } = deployments;
    log("****************** Deploying Bean Token ****************************");

    const CONSTRUCTOR_ARGUMENTS = ["Bean Token", "BNT"];

    const beanToken = await deploy("BeanToken", {
      from: deployer.address,
      args: CONSTRUCTOR_ARGUMENTS,
      log: true,
    });

    log(
      `************ Bean Token Deployed at ${beanToken.address} *******************`
    );
  } catch (error) {
    console.error(error);
  }
};

export default DeployBeanToken;
