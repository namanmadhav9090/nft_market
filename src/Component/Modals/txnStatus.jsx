import React, { Component } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import LoaderGif from "../../Assets/images/loading.gif";
import Media from "../../Theme/media-breackpoint";

function TxnStatus(props) {
  const { status, msg, toggleIndex, toggle, refreshStates, errorMsg } = props;
  return (
    <>
      {status === "initiate" && (
        <>
          <OnbTitle01 className="v2">
            <FormattedMessage
              id="follow_the_instructions"
              defaultMessage="Please follow the instructions on your wallet"
            />
          </OnbTitle01>
          <LoaderBX>
            <img src={LoaderGif} alt="" />
          </LoaderBX>
        </>
      )}
      {status === "progress" && (
        <>
          <OnbTitle01 className="v2">
            <FormattedMessage
              id="transaction_in_progress"
              defaultMessage="Transaction in progress"
            />
          </OnbTitle01>
          <LoaderBX>
            <img src={LoaderGif} alt="" />
          </LoaderBX>
        </>
      )}
      {status === "progress1" && (
        <>
          <OnbTitle01 className="v2">
            <FormattedMessage
              id="submission_in_progress"
              defaultMessage="Submission in progress"
            />
          </OnbTitle01>
          <LoaderBX>
            <img src={LoaderGif} alt="" />
          </LoaderBX>
        </>
      )}

      {status === "complete" && (
        <>
          <WGTitle>
            {" "}
            <FormattedMessage
              id="transaction_success"
              defaultMessage="Transaction is successful"
            />
          </WGTitle>

          <WGBtn
            onClick={() => {
              toggle(toggleIndex);
              refreshStates();
            }}
          >
            OK
          </WGBtn>
        </>
      )}
      {status === "error" && (
        <>
          <WGTitle>
            <FormattedMessage
              id="transaction_failed"
              defaultMessage="Transaction failed"
            />
          </WGTitle>
          <WGdescText>{errorMsg ? errorMsg : ""}</WGdescText>
          <WGBtn
            onClick={() => {
              toggle(toggleIndex);
              refreshStates();
            }}
          >
            OK
          </WGBtn>
        </>
      )}
    </>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const OnBTNBar = styled(FlexDiv)`
  flex-direction: column;
  width: 100%;
  margin-top: 25px;
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #eef2f7;
    border-radius: 10px;
    height: 58px;
    margin-bottom: 8px;
    i {
      width: 32px;
      height: 32px;
      display: block;
      margin-right: 12px;
      margin-left: 4px;
    }
    :hover {
      filter: brightness(0.97);
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

  &.v2 {
    max-width: 220px;
    margin: 0 auto;
    text-align: center;
    line-height: 28px;
  }
`;
const OnbText01 = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  letter-spacing: -0.5px;
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
  line-height: 28px;
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
  width: 100%;
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
export default TxnStatus;
