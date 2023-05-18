import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import CloseBTN01 from "../../Assets/images/closeBTN01.svg";
import LoaderGif from "../../Assets/images/loading.gif";
import Media from "./../../Theme/media-breackpoint";

function MintNFTPopup({ mintNFT, toggle, mintNFTStatus, error, percentage }) {
  return (
    <>
      <BlackWrap>
        <WhiteBX01>
          {/* <CloseBTN className="ani-1" onClick={() => toggle(3)}>
            {" "}
            <img src={CloseBTN01} alt="" />{" "}
          </CloseBTN> */}
          {mintNFTStatus === "" && (
            <>
              <WGTitle>
                <FormattedMessage id="we_got_submission" defaultMessage="We got your Submission!" />
              </WGTitle>
              <FTTitle>Follow these steps</FTTitle>
              <TokenBox>
                <TokenLeft>
                  <p>Mint token</p>
                  <p className="small">Call contract method</p>
                </TokenLeft>
                <button onClick={() => mintNFT()}>Start</button>
              </TokenBox>
            </>
          )}
          {/* <TokenBox>
            <TokenLeft>
              <p>Sign sell order</p>
              <p className="small">Sign sell order using your wallet</p>
            </TokenLeft>
            <button>Start</button>
          </TokenBox> */}
          {/* <TokenBox>
            <TokenLeft>
              <p>Submit for listing</p>
              <p className="small">We will let you know when it is</p>
            </TokenLeft>
            <button>Start</button>
          </TokenBox> */}

          {mintNFTStatus === "initiate" && (
            <>
              <OnbTitle01 className="v2">
                <FormattedMessage id="follow_the_instructions" defaultMessage="Please follow the instructions on your wallet" />
              </OnbTitle01>
              <LoaderBX>
                <img src={LoaderGif} alt="" />
              </LoaderBX>
            </>
          )}
          {mintNFTStatus === "progress" && (
            <>
              <OnbTitle01 className="v2">
                <FormattedMessage id="transaction_in_progress" defaultMessage="Transaction in progress" />
              </OnbTitle01>
              <LoaderBX>
                <img src={LoaderGif} alt="" />
              </LoaderBX>
            </>
          )}
          {mintNFTStatus === "progress1" && (
            <>
              <OnbTitle01 className="v2">
                <FormattedMessage id="submission_in_progress" defaultMessage="Submission in progress" />
              </OnbTitle01>
              {/* <LoaderBX>
                <img src={LoaderGif} alt="" />
              </LoaderBX> */}
              <ProcessLoader>
                <div className="loader-outer">
                  <div class="loader"></div>
                  <p>{percentage}%</p>
                </div>
              </ProcessLoader>
            </>
          )}

          {mintNFTStatus === "complete" && (
            <>
              <OnbTitle01 className="v2">
                <FormattedMessage id="minting_complete" defaultMessage="Minting Complete" />
              </OnbTitle01>
              <HighlightText>
                <FormattedMessage id="minting_complete_label"
                  defaultMessage="Platform affected in sometime" />
              </HighlightText>
              <OkayBtn>
                <Link to="/marketplace">Okay</Link>
              </OkayBtn>
            </>
          )}

          {mintNFTStatus === "error" && (
            <>
              <OnbTitle01>
                <FormattedMessage id="attention" defaultMessage="Attention!" />
              </OnbTitle01>
              <OnbText01>
                <FormattedMessage id="nft_can_not_update" defaultMessage="NFT Can Not Update" />
              </OnbText01>
            </>
          )}
        </WhiteBX01>
      </BlackWrap>
    </>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  .JCSB {
    justify-content: space-between;
  }
`;
const BlackWrap = styled(FlexDiv)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 101;
  backdrop-filter: blur(2px);
`;
const WhiteBX01 = styled(FlexDiv)`
  width: 100%;
  position: relative;
  max-width: 400px;
  margin: 0 15px;
  min-height: 418px;
  padding: 50px;
  background-color: #fff;
  border-radius: 30px;
  justify-content: flex-start;
  align-content: center;
  ${Media.xs} {
    padding: 50px 25px;
  }
`;
const CloseBTN = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
  top: 27px;
  padding: 0;
  margin: 0px;
  :hover {
    transform: rotate(90deg);
  }
  ${Media.xs} {
    right: 15px;
    top: 15px;
  }
`;
const WGTitle = styled.div`
  color: #000000;
  font-size: 24px;
  line-height:28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;
const WGdescText = styled.div`
  color: #000000;
  font-size: 14px;
  letter-spacing: -0.7px;
  margin-bottom: 10px;
  text-align: center;
`;

const WGBtn = styled.button`
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.7px;
  padding: 13px 86px;
  border-radius: 15px;
  border: 1px solid #000000;
  margin: 30px auto 0px;
  :hover {
    background-color: #000;
    color: #fff;
  }
`;

const FTTitle = styled.div`
  color: #000000;
  font-size: 24px;
  letter-spacing: -1px;
  margin-bottom: 25px;
  font-weight: 700;
`;

const TokenBox = styled(FlexDiv)`
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  button {
    color: #000000;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.5px;
    padding: 13px 35px;
    border-radius: 15px;
    border: 1px solid #000000;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;
const TokenLeft = styled.div`
  p {
    color: #000000;
    font-size: 16px;
    letter-spacing: -0.8px;
    font-weight: 600;
    margin: 0px;
    &.small {
      color: rgb(0 0 0 / 23%);
      margin: 0px;
      font-size: 12px;
      letter-spacing: -0.6px;
    }
  }
`;

const CCTitle = styled.div`
  color: #000000;
  font-size: 24px;
  letter-spacing: -1px;
  margin-bottom: 25px;
  font-weight: 700;
`;

const NFTForm = styled.div`
  position: relative;
  width: 100%;
  .label-line {
    margin: 0px 0px 6px;
    label {
      font-size: 12px;
      color: #8e9194;
      letter-spacing: -0.6px;
      font-weight: 600;
    }
    span {
      color: #8e9194;
      font-size: 12px;
      letter-spacing: -0.6px;
      margin-left: 6px;
    }
    p {
      color: #8e9194;
      font-size: 10px;
      letter-spacing: -0.7px;
      font-weight: light;
      margin: 0px;
    }
  }
  input {
    width: 100%;
    height: 54px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.8px;
    margin: 0px 0px 20px;
    ::placeholder {
      color: #000;
      opacity: 20%;
    }
  }
  textarea {
    width: 100%;
    min-height: 82px;
    line-height: 24px;
    resize: none;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.8px;
    margin: 0px 0px 20px;
  }
  .errorinput {
    position: relative;
    input {
      border-color: #ff2a44;
    }
    p.error {
      color: #ff2a44;
      font-size: 12px;
      letter-spacing: -0.6px;
      font-weight: 600;
      margin: 0px;
      position: absolute;
      top: 18px;
      right: 15px;
    }
  }
`;

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 60px auto 0 auto;
`;

const OnbTitle01 = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #000;
  margin-bottom: 15px;
  width:100%;
  &.v2 {
    max-width: 220px;
    margin: 0 auto;
    text-align: center;
    line-height: 28px;
  }
`;

const OkayBtn = styled.div` 
  width: 100%;
  display: grid;
    a{
      font-size: 14px;
      color: #000;
      letter-spacing: -0.5px;
      cursor: pointer;
      border-radius: 15px;
      background-color: transparent;
      border:1px solid #000;
      margin:30px auto 0px;
      padding: 13px 50px;
      :hover {
        background-color: #000;
        color:#fff;
      } 
    }
`;

const FileuploadBox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  border-radius: 10px;
  width: 100%;
  height: 100px;
  margin: 0px 0px 30px;
  input {
    display: none;
  }
  .custom-file-upload {
    border: 1px solid #000000;
    border-radius: 15px;
    font-size: 14px;
    color: #000;
    letter-spacing: -0.5px;
    padding: 13px 28px;
    cursor: pointer;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

const CreateItemButton = styled.div`
  margin: 0px;
  width: 100%;
  text-align: center;
  button {
    font-size: 14px;
    color: #fff;
    letter-spacing: -0.5px;
    padding: 13px 60px;
    cursor: pointer;
    border-radius: 15px;
    background-color: rgb(0 0 0 / 30%);
    :hover {
      background-color: #000;
    }
  }
`;

const OnbText01 = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  letter-spacing: -0.5px;
`;

const ProcessLoader = styled.div`
  text-align:center;
  width:100%;
  margin:30px 0px 0px;
  .loader-outer{
    position:relative;
    .loader {
      border: 5px solid #f3f3f3; 
      border-top: 5px solid #000;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin:0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    p{
      position: absolute;
      top: 0px;
      width: 100%;
      text-align: center;
      font-size: 12px;
      margin: 0px;
      line-height: 50px;
      padding-left: 5px;
    }
  }
`;

const HighlightText = styled.div`
  text-align:center;
  width:100%;
  margin-top:20px;
`;



export default MintNFTPopup;
