import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { BeanToken } from "../typechain-types";
import { developmentChains } from "../utils/dev-chains";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Tests on the bean token contract", () => {
      let BeanToken: BeanToken,
        accounts: SignerWithAddress[],
        beanTokenPrice: BigNumber;

      beforeEach(async () => {
        await deployments.fixture();
        accounts = await ethers.getSigners();
        BeanToken = await ethers.getContract("BeanToken");
        beanTokenPrice = await BeanToken.beanTokenPriceInEth();
      });

      describe("Tests on the constructor function", () => {
        it("Tests the Token Name And Symbol gets initialzed correctly", async () => {
          const [beanTokenName, beanTokenSymbol] = await Promise.all([
            BeanToken.name(),
            BeanToken.symbol(),
          ]);

          expect(beanTokenName).to.equal("Bean Token");
          expect(beanTokenSymbol).to.equal("BNT");
        });

        it("expects the user to have an intial amount of 10000BNT", async () => {
          const deployer = accounts[0];
          const balanceOfDeployer = await BeanToken.balanceOf(deployer.address);
          expect(balanceOfDeployer).to.equal(ethers.utils.parseEther("10000"));
        });
      });

      describe("tests on the buyBeanToken function", () => {
        it("tests the user is unable to buy token with insufficient ETH", async () => {
          await expect(
            BeanToken.buyBeanToken("50")
          ).to.be.revertedWithCustomError(
            BeanToken,
            "BeanToken__Insufficient__Funds"
          );
        });

        it("tests the user is able to buy a bean token ", async () => {
          const newUser = accounts[1];
          const NewBeanToken = BeanToken.connect(newUser);
          const tokenAmountToBuy = "10";
          const beanTokenInEth = Number(beanTokenPrice.toString()) / 1e18;
          const ethToPay = Number(tokenAmountToBuy) * beanTokenInEth;
          const txResponse = await NewBeanToken.buyBeanToken(tokenAmountToBuy, {
            value: ethers.utils.parseEther(ethToPay.toString()),
          });
          const txReceipt = await txResponse.wait(1);
          const beanTokenArgs = txReceipt?.events![1]?.args;

          expect(beanTokenArgs?.buyer).to.equal(newUser.address);
          expect(beanTokenArgs?.amount?.toString()).to.equal(tokenAmountToBuy);
        });
      });

      describe("tests on the withdrawal function", () => {
        beforeEach(async () => {
          for (let i = 1; i < accounts.length; i++) {
            const newUser = accounts[i];
            const NewBeanToken = BeanToken.connect(newUser);
            const tokenAmountToBuy = "10";
            const beanTokenInEth = Number(beanTokenPrice.toString()) / 1e18;
            const ethToPay = Number(tokenAmountToBuy) * beanTokenInEth;
            await NewBeanToken.buyBeanToken(tokenAmountToBuy, {
              value: ethers.utils.parseEther(ethToPay.toString()),
            });
          }
        });

        it("tests that only the owner is able to withdraw from the contract", async () => {
          const newUser = accounts[1];
          const NewBeanToken = BeanToken.connect(newUser);
          await expect(NewBeanToken.withdraw()).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
      });
    });
