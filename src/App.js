import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from 'reactjs-popup';
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import BubbleBackground from './bubble/bubble'

import tacoTruckNight from "./assets/taco-truck-night.png";
import tacoTruckNightMobile from "./assets/taco-truck-night-mobile.png";
import tacoTruckDay from "./assets/taco-truck-day-inside.png";
import tacoTruckDayMobile from "./assets/taco-truck-day-inside-mobile.png";
// import metamask from "./assets/metamask.png";

import { MdLogout, MdSailing } from 'react-icons/md';
import { BsGlobe } from 'react-icons/bs';

import { config } from "./config";

export const StyledButton = styled.button`
  float: ${({ fl }) => (fl ? fl : "right")};
  padding: 10px;
  font-size: 11px;
  text-align: ${({ txa }) => (txa ? txa : "center")};
  margin-left: ${({ ml }) => (ml ? ml : "0px")};
  margin-right: ${({ mr }) => (mr ? mr : "0px")};
  border-radius: ${({ br }) => (br ? br : "50px")};
  border: none;
  background-color: ${({ bg }) => (bg ? bg : "#ffffff")};;
  padding: 10px;
  font-weight: bold;
  font-size:${({ fs }) => (fs ? fs : "0px")};
  color: #000000;
  width:  ${({ w }) => (w ? w : "100px")};
  cursor: ${({ crs }) => (crs ? crs : "")};
  z-index:44;
  position: "absolute";
  box-shadow: 0px 6px 0px-2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px-2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px-2px rgba(250, 250, 250, 0.3);
    : active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
}
`;

export const CountBox = styled.button`
padding: 10px;
border: 2px solid black;
border-radius: ${({ br }) => (br ? br : "50px")};
background-color: ${({ bg }) => (bg ? bg : "#ffffff")};;
margin-left: ${({ ml }) => (ml ? ml : "0px")};
font-weight: bold;
font-size:${({ fs }) => (fs ? fs : "0px")};
color: #000000;
width:  ${({ w }) => (w ? w : "45px")};
cursor: pointer;
}
`;

export const ResponsiveWrapper = styled.div`
display: contents;
flex: 0;
flex-direction: column;
justify-content: stretched;
align-items: stretched;
width: 100 %;
@media(min-width: 767px) {
  flex-direction: row;
}
`;

export const StyledImg = styled.img`
width: 200px;
height: 200px;
@media(min-width: 767px) {
  width: 350px;
  height: 350px;
}
transition: width 0.5s;
transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);;
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [gasFee, setGasFee] = useState(0);

  const closeModal = () => {
    document.getElementById('root').style.filter = "brightness(100%)";
    setOpen(false);
  };

  const claimNFTs = (_amount) => {
    

    //let cost = config.WEI_COST;
    //let gasLimit = config.GAS_LIMIT;
    //let totalCostWei = String(cost * _amount);
    //let totalGasLimit = String(gasLimit * _amount);
    //console.log("Cost: ", totalCostWei);
    //console.log("Gas limit: ", totalGasLimit);
    toast.success(`Minting your Taco...`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    blockchain.smartContract.methods
      .mint()
      .send({
        //gasLimit: String(totalGasLimit),
        to: config.CONTRACT_ADDRESS,
        from: blockchain.account,
        gasPrice: gasFee,
        //maxPriorityFeePerGas: null,
        //maxFeePerGas: null,
      })
      .once("error", (err) => {
        console.log(err);
        let errorMsg = 'Something went wrong please try again later.';
        if (err.hasOwnProperty("message")) {
          errorMsg = err.message;
        }
        if (err)
          toast.error(errorMsg, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        setCount(0);
      })
      .then((receipt) => {
        toast.success('Successfully minted a Taco, you can view it on OpenSea.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCount(0);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getGas = () => { 
    //setTimeout(()=>{
      blockchain.web3.eth.getGasPrice()
      .then(setGasFee)
    //}, 1000);
    
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      getGas();
    } 
  };

  useEffect(() => {
    getData();
    
    // eslint-disable-next-line 
  }, [blockchain.account]);

  const connectFailed = (payload) => {
    return {
      type: "CONNECTION_FAILED",
      payload: payload,
    };
  };

  useEffect(() => {
    if (blockchain.errorMsg !== "") {
      toast.error(blockchain.errorMsg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(connectFailed(""));
    }
    // eslint-disable-next-line 
  }, [blockchain.errorMsg]);
  // eslint-disable-next-line

  return (
    <s.Screen
      style={{
        backgroundImage: blockchain.metamask ?
          window.innerWidth > 600 ? `url(${tacoTruckDay})` : `url(${tacoTruckDayMobile})`
          :
          window.innerWidth > 600 ? `url(${tacoTruckNight})` : `url(${tacoTruckNightMobile})`
      }}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <ResponsiveWrapper d={"block"} flex={1} ai={"center"} >
          {
            !blockchain.metamask ?
              (
                <s.Container flex={1} ai={"end"} onClick={(e) => {
                  e.preventDefault();
                  dispatch(connect());
                  getData();
                }}>
                  <StyledButton fs={window.innerWidth > 1500 ? "13px" : "15px"} crs="pointer">Connect</StyledButton>
                </s.Container>
                // <Popup trigger={
                //   <s.Container flex={1} ai={"end"}>
                //     <StyledButton fs={window.innerWidth > 1500 ? "13px" : "15px"} crs="pointer">Connect</StyledButton>
                //   </s.Container>} position="center">

                //   <s.Container
                //     onClick={(e) => {
                //       e.preventDefault();
                //       dispatch(connect());
                //       getData();
                //     }}
                //     flex={1}
                //     jc={"center"}
                //     ai={"center"}
                //     style={{
                //       backgroundColor: "#fff",
                //       padding: 20,
                //       paddingLeft: window.innerWidth > 600 ? 120 : 30,
                //       paddingRight: window.innerWidth > 600 ? 120 : 30,
                //       borderRadius: 20,
                //       cursor: "pointer"
                //     }}
                //   >
                //     <s.SpacerSmall />
                //     <img src={metamask} style={{ width: window.innerWidth > 600 ? 85 : 60 }} alt="metamask" />
                //     <s.SpacerSmall />
                //     <s.TextTitle style={{ textAlign: "center", color: "black" }}>
                //       MetaMask
                //     </s.TextTitle>
                //     <s.SpacerSmall />
                //     <s.TextDescription style={{ textAlign: "center", color: "black" }}>
                //       Connect your metamask wallet.
                //     </s.TextDescription>
                //   </s.Container>
                // </Popup>
              ) :
              (
                <>
                  {/* {
                    window.innerWidth < 600 ? !open ?
                      <BubbleBackground setOpen={setOpen} />
                      : <></>
                      : <BubbleBackground setOpen={setOpen} />
                  } */}
                  <s.Container d={"inline"} flex={0} ai={"end"} pb={"5px"}>
                    <StyledButton fs={window.innerWidth > 1500 ? "13px" : "13px"} crs="pointer" bg={"gold"} br={"50px"} ml={"0px"} onClick={(e) => {
                      e.preventDefault();
                      window.location.reload();
                    }}><MdLogout style={{ fontSize: window.innerWidth > 1500 ? "14px" : "16px", float: "right" }} /></StyledButton>
                    <StyledButton fs={window.innerWidth > 1500 ? "13px" : "13px"} crs="pointer" w={window.innerWidth > 1500 ? "145px" : "145px"} br={"50px"} ml={"-35px"} mr={"-69px"} txa={"right"} onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://polygonscan.com/address/${blockchain.account}`, '_blank');
                    }}>
                      {blockchain.account.slice(0, 6) + "...." + blockchain.account.slice(blockchain.account.length - 5)}
                    </StyledButton>
                    <StyledButton fs={window.innerWidth > 1500 ? "13px" : "13px"} w={window.innerWidth > 1500 ? "130px" : "145px"} bg={"gold"} br={"50px"} ml={"0px"}>{parseFloat(blockchain.balance).toFixed(2)} MATIC</StyledButton>
                  </s.Container>
                  <s.Container d={"inline"} flex={0} ai={"end"}>
                    <StyledButton fs={window.innerWidth > 1500 ? "11px" : "12px"} w={window.innerWidth > 1500 ? "115px" : "145px"} ml={"10px"} bg={"gold"} >Minted: {data.totalSupply}/{config.MAX_SUPPLY}</StyledButton>
                    <StyledButton fs={window.innerWidth > 1500 ? "13px" : "13px"} bg={"gold"} w={"40px"} br={"100px"} ml={window.innerWidth > 1500 ? "10px" : "5px"} crs="pointer" onClick={(e) => {
                      e.preventDefault();
                      window.open(config.MARKETPLACE_LINK, '_blank');
                    }}>
                      <MdSailing />
                    </StyledButton>
                    <StyledButton fs={window.innerWidth > 1500 ? "13px" : "13px"} bg={"gold"} w={"40px"} br={"100px"} ml={window.innerWidth > 1500 ? "10px" : "5px"} crs="pointer" onClick={(e) => {
                      e.preventDefault();
                      window.open(config.HOMEPAGE_LINK, '_blank');
                    }}>
                      <BsGlobe />
                    </StyledButton>
                  </s.Container>
                  <s.Container flex={1} onClick={() => {
                    document.getElementById('root').style.filter = "brightness(50%)";
                    setOpen(o => !o)
                  }}>
                  </s.Container>
                  <Popup open={open} onClose={closeModal} position="center">
                    {close => (
                      <s.Container
                        flex={1}
                        d={"inline-block"}
                        jc={"center"}
                        ai={"center"}
                        style={{
                          opacity: 0.9,
                          backgroundColor: "#fff",
                          padding: 20,
                          paddingLeft: window.innerWidth > 600 ? 120 : 60,
                          paddingRight: window.innerWidth > 600 ? 120 : 60,
                          borderRadius: 20
                        }}
                      >
                        {/** 
                        <CountBox fs={"12px"} w={"35px"} br={"18px"} crs={"pointer"} onClick={(e) => {
                          e.preventDefault();
                          if (count > 0) {
                            setCount(count - 1);
                          }
                        }}> - </CountBox>
                        <CountBox fs={"15px"} w={"46px"} br={"12px"} ml={"5px"}>{count}</CountBox>
                        <CountBox fs={"12px"} w={"35px"} br={"18px"} ml={"5px"} crs={"pointer"} onClick={(e) => {
                          e.preventDefault();
                          if (count < 10) {
                            setCount(count + 1);
                          }
                        }}> + </CountBox>
                        <s.SpacerSmall />
                      */}
                        
                        <CountBox fs={"15px"} w={"110px"} bg={"gold"} ml={"8px"} crs={"pointer"} onClick={(e) => {
                          e.preventDefault();
                          close();
                          claimNFTs(count);
                          getData();
                        }}>Mint</CountBox>
                      </s.Container>
                    )}
                  </Popup>
                </>
              )
          }        </ResponsiveWrapper>
      </s.Container >
    </s.Screen >
  );
}

export default App;