// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import SmartContract from "../../contracts/abi.json";
import Onboard from 'bnc-onboard'

// log
import { fetchData } from "../data/dataActions";
import { config } from "../../config";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    // const { ethereum } = window;
    // const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    let web3 = null;
    let ethereum = null;

    const wallets = [
      { walletName: "coinbase" },
      { walletName: "trust", rpcUrl: "https://polygon-mainnet.infura.io/v3/2fa4ae0028b14a3883bdb64c2c465f80" },
      { walletName: "metamask" },
      { walletName: "walletLink" },
      {
        walletName: "walletConnect",
        // infuraKey: "2fa4ae0028b14a3883bdb64c2c465f80",
        rpc: {
          "137": 'https://polygon-mainnet.infura.io/v3/2fa4ae0028b14a3883bdb64c2c465f80'
        },
      },
    ];

    const onboard = Onboard({
      dappId: "d1f91014-62b4-4dad-a06b-2bb17b81642c",
      networkId: 137,
      subscriptions: {
        wallet: wallet => {
          web3 = new Web3(wallet.provider)
        }
      },
      walletSelect: {
        wallets: wallets
      }
    });

    const walletSelected = await onboard.walletSelect();
    if (walletSelected) {
      const walletChecked = await onboard.walletCheck();
      if (walletChecked) {
        try {
          const currentState = onboard.getState()
          ethereum = currentState.wallet.provider;
          Web3EthContract.setProvider(ethereum);
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          let balance = await web3.eth.getBalance(accounts[0]);
          balance = Web3.utils.fromWei(balance, 'ether');
          const networkId = await ethereum.request({
            method: "net_version",
          });
          // const NetworkData = await SmartContract.networks[networkId];
          if (parseInt(networkId) === parseInt(config.NETWORK.ID)) {
            const SmartContractObj = new Web3EthContract(
              SmartContract,
              config.CONTRACT_ADDRESS
            );
            dispatch(
              connectSuccess({
                account: accounts[0],
                smartContract: SmartContractObj,
                web3: web3,
                balance
              })
            );
            // Add listeners start
            ethereum.on("accountsChanged", (accounts) => {
              dispatch(updateAccount(accounts[0]));
            });
            ethereum.on("chainChanged", () => {
              window.location.reload();
            });
            // Add listeners end
          } else {
            dispatch(connectFailed("Change network to Polygon."));
          }
        } catch (err) {
          dispatch(connectFailed("Something went wrong."));
        }
      } else {
        dispatch(connectFailed("Wallet Not Connected"));
      }
    } else {
      dispatch(connectFailed("Wallet Not Selected"));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
