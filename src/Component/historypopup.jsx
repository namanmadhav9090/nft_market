import React, { Component } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import dateFormat from "dateformat";

import { actions } from "../actions";
import CloseBTN01 from "../Assets/images/closeBTN01.svg";
import LoaderGif from "../Assets/images/loading.gif";

import Media from "../Theme/media-breackpoint";

class CustomScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        renderTrackVertical={(props) => (
          <div {...props} className="track-vertical" />
        )}
        renderThumbVertical={(props) => (
          <div {...props} className="thumb-vertical" />
        )}
        renderView={(props) => <div {...props} className="view" />}
        autoHide
        style={this.props.style}
      >
        {this.props.children}
      </Scrollbars>
    );
  }
}

class Historypopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      nftId: this.props.nftId,
      edition: this.props.edition,
      bnbUSDPrice: 0,
    };
  }

  async componentDidMount() {
    const { nftId, edition } = this.state;
    this.props.getHistory(nftId, edition); // get NFT edition history

    const string =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";
    await fetch(string)
      .then((resp) => resp.json())
      .then(async (data) => {
        this.setState({ bnbUSDPrice: data.binancecoin.usd });
      });
  }
  async componentDidUpdate(prevProps, prevState) {
    const { nftId, edition } = this.props;
    if (edition !== prevState.edition) this.props.getHistory(nftId, edition);
  }

  getHistoryText(lng, text) {
    if (lng === 'tr' && text === 'NFT minted ') {
      return 'NFT üretildi'
    } else if (lng === 'tr' && text === 'NFT bought') {
      return 'NFT alındı'
    } else {
      return text
    }
  }

  render() {
    const { history, lng } = this.props;
    const { bnbUSDPrice } = this.state;
    return (
      <>
        <BlackWrap>
          <WhiteBX0D2>
            {history ? (
              <>
                <CloseBTN
                  className="ani-1"
                  onClick={() => this.props.toggle(9)}
                >
                  <img src={CloseBTN01} alt="" />
                </CloseBTN>

                <Htitle>
                  <FormattedMessage id="history" defaultMessage="History" />
                </Htitle>
                <CustomScrollbars
                  autoHide
                  autoHideTimeout={1000}
                  style={{
                    width: "100%",
                    height: "400px",
                    position: "relative",
                    className: "HCscroll",
                  }}
                >
                  {history.map((history, key) => {
                    return (
                      <HDsection key={key}>
                        <HDleft>
                          <h3>
                            {history
                              ? this.getHistoryText(lng, history.text)
                              : "Lorem ipsum dolor sit amet"}
                          </h3>
                          <p className="desktop-block">
                            {history
                              ? history.createdAt
                                ? dateFormat(
                                    new Date(history.createdAt).toString(),
                                    "dd mmmm yyyy"
                                  )
                                : "Transaction Date Here"
                              : "Transaction Date Here"}
                          </p>
                          <HDmiddle className="mobile-block">
                            <p>
                              <FormattedMessage
                                id="history_by_label"
                                defaultMessage="by"
                              />{" "}
                              @<b>{history ? history.ownerId?.username : ""}</b>
                            </p>
                          </HDmiddle>
                          <p className="mobile-block">
                            {history
                              ? history.createdAt
                                ? dateFormat(
                                    new Date(history.createdAt).toString(),
                                    "dd mmmm yyyy"
                                  )
                                : "Transaction Date Here"
                              : "Transaction Date Here"}
                          </p>
                        </HDleft>
                        <HDmiddle className="desktop-block">
                          <p>
                            by @
                            <b>{history ? history.ownerId?.username : ""}</b>
                          </p>
                        </HDmiddle>
                        <HDright>
                          <HDrightbox>
                            <h3>{history ? history.buyPrice : "0.00"} BNB</h3>
                            <p>
                              {(history?.buyPrice * bnbUSDPrice).toLocaleString(
                                2
                              )}{" "}
                              USD
                            </p>
                          </HDrightbox>
                        </HDright>
                      </HDsection>
                    );
                  })}
                </CustomScrollbars>
              </>
            ) : (
              <>
                <OnbTitle01 className="v2">
                  Please wait history is fetching
                </OnbTitle01>
                <LoaderBX>
                  <img src={LoaderGif} alt="" />
                </LoaderBX>
              </>
            )}
          </WhiteBX0D2>
        </BlackWrap>
      </>
    );
  }

  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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
const WhiteBX0D2 = styled(FlexDiv)`
  width: 100%;
  position: relative;
  max-width: 720px;
  margin: 0 15px;
  min-height: 491px;
  padding: 50px 50px 0px 50px;
  background-color: #fff;
  border-radius: 30px;
  justify-content: flex-start;
  align-content: center;
  ${Media.xs} {
    padding: 50px 25px;
  }
  .view {
    width: 100%;
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

const Htitle = styled.div`
  font-size: 22px;
  letter-spacing: -0.55px;
  color: #000;
  font-weight: 600;
  margin: 0px 0px 20px;
  width: 100%;
`;

const HDsection = styled(FlexDiv)`
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  border: 1px solid #dddddd;
  padding: 20px 15px;
  border-radius: 10px;
  margin: 0px 0px 10px 0px;
  ${Media.sm} {
    padding: 15px;
  }
`;

const HDleft = styled.div`
  h3 {
    margin: 0px 0px 5px;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: -0.9px;
    color: #000;
    ${Media.sm} {
      font-size: 12px;
      margin: 0px;
    }
  }
  p {
    margin: 0px;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: -0.2px;
    color: #8e9194;
    ${Media.sm} {
      font-size: 10px;
    }
  }
  .mobile-block {
    display: none;
    ${Media.sm} {
      display: block;
    }
  }
  .desktop-block {
    ${Media.sm} {
      display: none;
    }
  }
`;

const HDmiddle = styled.div`
  p {
    margin: 0px;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: -0.9px;
    color: #000;
    ${Media.sm} {
      font-size: 12px;
      margin: 0px 0px 5px;
    }
  }
  b {
    font-weight: 600;
  }
  &.mobile-block {
    display: none;
    ${Media.sm} {
      display: block;
    }
  }
  &.desktop-block {
    ${Media.sm} {
      display: none;
    }
  }
`;

const HDright = styled(FlexDiv)`
  text-align: right;
`;

const HDrightbox = styled.div`
  margin: 0px 10px 0px 0px;
  ${Media.sm} {
    margin: 0px;
  }
  h3 {
    font-size: 18px;
    color: #000;
    letter-spacing: -0.9px;
    font-weight: 600;
    margin: 0px 0px 5px;
    ${Media.sm} {
      font-size: 12px;
      margin: 0px;
    }
  }
  p {
    margin: 0px;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: -0.6px;
    color: #8e9194;
    ${Media.sm} {
      font-size: 10px;
    }
  }
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

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getHistory: (nftId, edition) =>
      dispatch(actions.getEditionHistory(nftId, edition)),
  };
};
const mapStateToProps = (state) => {
  return {
    history: state.fetchNFTEditionHistory,
    lng: state.fetchLanguage,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Historypopup);
