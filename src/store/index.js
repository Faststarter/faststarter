import { defineStore } from "pinia";
import { reactive, ref, useContext } from "@nuxtjs/composition-api";
import { abi } from "../../solidity/build/flipstarter.json";
import * as Web3 from "web3";
import axios from "axios";
import { marked } from "marked";

//
function alert(message, error) {
  // Get website store
  let website = websiteStore();

  if (error) console.log(error);

  website.alert(message);
}

export const userStore = defineStore({
  id: "user",
  state: () => ({
    address: ref(""),
    update: ref(false),
  }),
  actions: {
    async connect() {
      let { env, setLoading } = websiteStore();
      const campaign = campaignStore();
      let network = env.network;

      if (this.address) return;
      try {
        // Check of browser have wallet
        if (!ethereum) throw new Error("No wallet connected");

        // Check of chainId
        let chainId = await ethereum.request({ method: "eth_chainId" });
        if (Number(chainId) != Number(network.chainId)) {
          let isAttempt = await campaign.attemptMetaMaskProviderRegistration(
            network.chainId,
            network.name,
            network.rpc,
            network.symbol
          );
          if (!isAttempt || Number(chainId) != Number(network.chainId)) {
            throw new Error("This app just work in " + network.name);
          }
        }

        await setLoading(
          ethereum.request({ method: "eth_requestAccounts" }),
          "connecting metamask"
        );

        // Set ethereum provider
        global.walletContract = global.contract.clone();
        global.walletContract.setProvider(ethereum);

        // Set user adderss
        this.address = ethereum.selectedAddress || "";

        // Watch address and ChainId
        ethereum.on("accountsChanged", async (accounts) => {
          let chainId = await ethereum.request({ method: "eth_chainId" });

          this.update = false;

          // Check of chainId
          if (Number(chainId) !== Number(network.chainId)) return;

          // Select first account
          this.address = accounts[0] || "";
        });

        ethereum.on("chainChanged", async () => {
          let chainId = await ethereum.request({ method: "eth_chainId" });
          // Do not anything if network not change
          if (Number(chainId) === Number(network.chainId)) return;

          // Reset address and show alert If nework change
          this.address = "";
          alert("This app just work in " + network.name);
        });
      } catch (error) {
        alert(error.message, error);
      }
    },
  },
  getters: {
    isContributor() {
      const campaign = campaignStore();

      //
      if (!campaign.contributors) return false;

      //
      return !!campaign.contributors.find((contributor) => {
        let isContributor =
          contributor.address.toUpperCase() == this.address.toUpperCase();

        let isWithdrawn = contributor.withdrawn;

        return isContributor && !isWithdrawn;
      });
    },
    isOwner() {
      const campaign = campaignStore();

      // return false when owner in empty
      if (!campaign.owner.trim()) return false;

      //
      return campaign.owner.toUpperCase() === this.address.toUpperCase();
    },
  },
});

export const websiteStore = defineStore({
  id: "website",
  state: () => ({
    loading: ref(""),
    error: ref(""),
    env: reactive({}),

    currencyRates: ref([]),
    crypto: {
      price: ref(0),
      codeCoin: ref(""),
      currencyCode: ref("USD"),
    },
  }),
  actions: {
    async init() {
      this.env = useContext().env;

      const campaign = campaignStore();
      await campaign.init();

      this.crypto.codeCoin = this.env.network.symbol;
      await this.fetchCurrencyRates();
    },
    refresh() {},
    async fetchCurrencyRates() {
      try {
        if (!process.browser) return;
        let respons = await axios.get(
          "https://markets.api.bitcoin.com/rates?c=" + this.crypto.codeCoin
        );
        this.currencyRates = respons.data;
        this.setPrice();
      } catch (error) {
        this.currencyRates = [];
        alert(
          `We cannot determine the price of ${this.crypto.currencyCode} for ${this.crypto.codeCoin}`,
          error
        );
      }
    },
    setPrice() {
      let currencyRate = this.currencyRates.find((currency) => {
        return currency.code.toUpperCase() == this.crypto.currencyCode;
      });

      this.crypto.price = currencyRate.rate;
      return;
    },
    async setLoading(promise, message = "loading") {
      this.loading = message;
      try {
        await promise;
        this.loading = "";
      } catch (error) {
        alert(error.message, error);
        this.loading = "";
      }
    },
    alert(message) {
      this.error = message;
    },
  },
});

export const campaignStore = defineStore({
  id: "campaign",
  state: () => ({
    info: {
      title: ref(""),
      summary: ref(""),
      proposal: ref(""),
      summaryHtml: ref(""),
      proposalHtml: ref(""),
    },
    isEnd: ref(false),
    owner: ref(""),
    recipient: ref(0),
    balance: ref(0),
    recipients: reactive([]),
    contributionAmount: ref(0),
    contributors: ref([]),
  }),
  actions: {
    async init() {
      let { contractAddress, network } = useContext().env;

      //
      let web3 = new Web3(network.rpc);

      //
      let contract = new web3.eth.Contract(abi, contractAddress);

      //
      global.contract = contract;
      global.web3 = web3;

      //

      if (process.browser) {
        await this.getBrowserData();
      } else {
        await this.getServerData();
      }
    },
    async callFunction(name, ...props) {
      try {
        // Save methods with name
        let methods = contract.methods[name];

        if (!methods) return;

        // Call methods and show alert if he have error
        return await methods(...props).call();
      } catch (error) {
        alert(error.message, error);
      }
    },
    async sendFunction(name, value = 0, ...props) {
      try {
        // Save methods with name
        let methods = walletContract.methods[name];

        //
        if (!methods) return;

        // Call methods and show alert if he have error
        let result = await methods(...props).send({
          from: userStore().address,
          value,
        });

        this.getBrowserData();

        return result;
      } catch (error) {
        alert(error.message, error);
      }
    },
    async getContributors() {
      let keys = await this.callFunction("getContributorsKeys");

      let contributors = [];

      for (let key in keys) {
        let contributor = await this.callFunction("getContributor", keys[key]);
        if (!contributor.withdrawn) {
          contributors.push({
            address: contributor._address,
            amount: contributor.amount,
            name: contributor.name,
            comment: contributor.comment,
            withdrawn: contributor.withdrawn,
            exists: contributor.exists,
          });
        }
      }

      this.contributors = contributors;
    },
    async getServerData() {
      this.recipient = await this.callFunction("goal");
      this.balance = await this.callFunction("balance");
      this.owner = await this.callFunction("owner");

      //
      let campaign = await this.callFunction("campaign");
      this.info.title = campaign.title;
      this.info.summary = campaign.summary;
      this.info.proposal = campaign.proposal;
      await this.getDetails();

      //
      const getRecipients = await this.callFunction("getRecipients");
      this.recipients = getRecipients.map(({ photo, name, website }) => ({
        name,
        photo,
        website,
      }));
    },
    async getDetails() {
      if (process.browser) return;
      try {
        let summary = await axios.get(this.info.summary);
        let proposal = await axios.get(this.info.proposal);

        this.info.summaryHtml = marked.parse(summary.data);
        this.info.proposalHtml = marked.parse(proposal.data);
      } catch (error) {}
    },
    async getBrowserData() {
      this.contributionAmount = await this.callFunction("getAmount");
      this.isEnd = await this.callFunction("isEnd");
      this.balance = await this.callFunction("balance");

      await this.getContributors();
    },
    async attemptMetaMaskProviderRegistration(chainId, chainName, rpc, symbol) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId,
            },
          ],
        });
        return true;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId,
                  rpcUrls: [rpc.replace("ws://", "https://")],
                  chainName,
                  nativeCurrency: {
                    chainName,
                    symbol,
                    decimals: 18,
                  },
                },
              ],
            });
            return true;
          } catch (addError) {
            return false;
          }
        }
        return false;
      }
    },
  },
  getters: {
    request() {
      return this.recipient - this.contributionAmount;
    },
  },
});
