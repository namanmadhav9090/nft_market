import React, { Component } from "react";
import styled from "styled-components";
import Gs from "../Theme/globalStyles";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from "react-player";
import Magnifypopup from "../Component/Modals/magnifyPopup";
import POSpopup from "../Component/Modals/putonsalepopup";
import PABpopup from "../Component/Modals/placebidpopup";
import Historypopup from "../Component/historypopup";
import SelectEdition from "../Component/selectedition";
import Collapse from "@kunukn/react-collapse";
import { web3 } from "../web3";
import Redheart from "../Assets/images/Redheart.svg";
import Lock from "../Assets/images/icon-set-lock.svg";
import redheartBorder from "../Assets/images/redheartBorder.svg";
import { actions } from "../actions";
import { connect } from "react-redux";
import Timer from "../Component/timer";
import { getContractInstance, getFileType } from "../helper/functions";
import NftOwnerActions from "../Component/Modals/nftOwnerAction";
import Login from "../Component/Modals/login";
import getContractAddresses from "../contractData/contractAddress/addresses";
import Media from "../Theme/media-breackpoint";
import UserImg from "../Assets/images/user-img.jpg";
import LoaderGif from "../Assets/images/loading.gif";

// import VideoThumbnail from "react-video-thumbnail";
import { Scrollbars } from "react-custom-scrollbars";

function CustomScrollbars(props) {
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
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}

const saleMethods = {
  disabled: {
    name: null,
    btnName: "Disabled",
    bidDesc: "Price",
    disable: true,
  },
  sold: {
    name: null,
    btnName: <FormattedMessage id="sold" defaultMessage="Sold" />,
    bidDesc: <FormattedMessage id="sold" defaultMessage="Sold" />,
    disable: true,
  },
  buyNow: {
    name: "buyNow",
    btnName: <FormattedMessage id="buy_now" defaultMessage="Buy Now" />,
    bidDesc: <FormattedMessage id="price" defaultMessage="Price" />,
    open: 8,
  },
  placeABid: {
    name: "placeBid",
    btnName: <FormattedMessage id="place_a_bid" defaultMessage="Place a bid" />,
    bidDesc: <FormattedMessage id="current_bid" defaultMessage="Current bid" />,
    open: 8,
  },
  makeAnOffer: {
    name: "placeBid",
    btnName: (
      <FormattedMessage id="make_an_offer" defaultMessage="Place a bid" />
    ),
    bidDesc: (
      <FormattedMessage id="current_offer" defaultMessage="Current offer" />
    ),
    open: 8,
  },
  putOnSale: {
    name: null,
    btnName: (
      <FormattedMessage id="put_on_sale" defaultMessage="Put on sale " />
    ),
    bidDesc: (
      <FormattedMessage id="purchased_at" defaultMessage="Purchased at" />
    ),
    open: 7,
    checkApproval: true,
  },
  cancelSaleOrder: {
    name: "cancelSaleOrder",
    btnName: (
      <FormattedMessage id="cancel_sale_order" defaultMessage="Put on sale " />
    ),
    bidDesc: "",
    open: 1,
  },
  noButton: {
    name: "",
    btnName: null,
    bidDesc: <FormattedMessage id="price" defaultMessage="Price" />,
  },
  claimAfterAuction: {
    name: "claimAfterAuction",
    btnName: <FormattedMessage id="claim" defaultMessage="Put on sale " />,
    bidDesc: <FormattedMessage id="current_bid" defaultMessage="Current bid" />,
    open: 8,
  },
  claimBack: {
    name: "claimBack",
    btnName: (
      <FormattedMessage id="cancelMyOffer" defaultMessage="Cancel My Offer" />
    ),
    bidDesc: <FormattedMessage id="current_bid" defaultMessage="Current bid" />,
    open: 1,
    checkApproval: false,
  },
  acceptOffer: {
    name: "acceptOffer",
    btnName: (
      <FormattedMessage id="accpet_offer" defaultMessage="Accept Offer" />
    ),
    bidDesc: (
      <FormattedMessage id="current_offer" defaultMessage="Current offer" />
    ),
    open: 1,
  },
  burn: {
    name: "burnTokenEdition",
    btnName: <FormattedMessage id="burn" defaultMessage="Burn" />,
    bidDesc: (
      <FormattedMessage id="current_offer" defaultMessage="Current offer" />
    ),
    open: 1,
  },
  transfer: {
    name: "transfer",
    btnName: (
      <FormattedMessage id="transfer_nft" defaultMessage="Accept Offer" />
    ),
    bidDesc: (
      <FormattedMessage id="current_offer" defaultMessage="Current offer" />
    ),
    open: 1,
  },
};
class NftDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      isOpen4: false,
      isOpen9: false,
      imgClass: "",
      bnbUSDPrice: {},
      bidDetails: {
        currentBidValue: "0",
        bidder: "0x0000000000000000000000000000000000000000",
      },
      ownerActionName: "",
      currentEdition: 0,
      saleMethod: {
        name: "placeBid",
        btnName: (
          <FormattedMessage id="place_a_bid" defaultMessage="Place a bid" />
        ),
      },
      showTimer: false,
      loading: false,
      selectedNFTDetails: null,
      isApprovedForAll: false,
      NFTDetails: null,
      ext: null,
      nextMethod: null,
      loader: true,
      magnifyClass: " ",
      accountBalance: 0,
      networkError: false,
    };
  }
  async componentDidUpdate(prevProps, prevState) {
    const { isLiked, web3Data, authData } = this.props;
    if (this.state.currentEdition !== prevState.currentEdition) {
      this.fetchNFTDetails(this.state.currentEdition);
    }
    if (isLiked !== prevProps.isLiked) {
      this.setState({ loading: false });
    }
    if (web3Data.isLoggedIn !== prevProps.web3Data.isLoggedIn) {
      this.checkUserApproval(web3Data);
    }
    if (authData !== prevProps.authData) {
      if (authData && this.state.NFTDetails) {
        this.getEditionNumber(this.state.NFTDetails, 0);
      }
    }

    if (web3Data !== prevProps.web3Data) {
      if (window.web3) {
        const chainID = await web3.eth.getChainId();
        if (chainID === 56 || chainID === "0x38") {
          this.setState({ networkError: false });
        }
      }
    }
  }

  async componentDidMount() {
    const { web3Data } = this.props;
    if (web3Data.accounts.length) {
      this.checkUserApproval(web3Data);
    }
    if (this.props.match.params.id) {
      this.setState({ loader: true });
      // this.props.getSingleNFTDetails(this.props.match.params.id);
      const NFTDetails = await actions.getSingleNFTDetails(
        this.props.match.params.id
      );
      // console.log(NFTDetails);
      if (NFTDetails) {
        let ext;
        if (!NFTDetails.image.format) {
          ext = await getFileType(NFTDetails.image.compressed);
        } else {
          ext = NFTDetails.image.format;
        }
        this.setState({ NFTDetails, ext: ext }, () =>
          this.getEditionNumber(NFTDetails, this.state.currentEdition)
        );
      }
      this.props.getLikesCount(this.props.match.params.id);
      this.props.getIsLiked(this.props.match.params.id);
    }
    const string =
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd%2Ctry";
    await fetch(string)
      .then((resp) => resp.json())
      .then(async (data) => {
        this.setState({ bnbUSDPrice: data.binancecoin });
      });

    if (window.web3) {
      const chainID = await web3.eth.getChainId();
      if (chainID !== 56 && chainID !== "0x38") {
        this.setState({ networkError: true });
      }
    }
  }
  checkUserApproval = async (web3Data) => {
    const nftContractContractInstance = getContractInstance();
    const { escrowContractAddres } = getContractAddresses();
    const isApprovedForAll = await nftContractContractInstance.methods
      .isApprovedForAll(web3Data.accounts[0], escrowContractAddres)
      .call();
    const accountBalance = Number(
      web3.utils.fromWei(await web3.eth.getBalance(web3Data.accounts[0]))
    );
    this.setState({ isApprovedForAll, accountBalance });
  };
  setNFTBuyMethod = (
    bidDetails,
    isOwner,
    secondHand,
    isOpenForSale,
    saleState,
    price,
    isActive
  ) => {
    const { web3Data } = this.props;
    const NFTDetails = this.state.NFTDetails;
    const isAuction = secondHand
      ? false
      : NFTDetails.auctionEndDate > new Date().getTime() / 1000;
    if (!isActive)
      return this.setState({
        saleMethod: saleMethods.disabled,
      });
    if (secondHand) {
      if (isOwner) {
        if (isOpenForSale) {
          if (saleState === "OFFER" && +bidDetails.bidValue > price) {
            this.setState({
              saleMethod: saleMethods.acceptOffer,
            });
          } else
            this.setState({
              saleMethod: saleMethods.noButton,
            });
        } else {
          this.setState({
            saleMethod: saleMethods.putOnSale,
          });
        }
      } else {
        if (isOpenForSale) {
          if (saleState === "BUY") {
            this.setState({ saleMethod: saleMethods.buyNow });
          } else {
            if (
              +bidDetails.bidValue > 0 &&
              bidDetails.bidder === web3Data.accounts[0] &&
              +bidDetails.timeStamp + 86400 > new Date().getTime() / 1000
            ) {
              this.setState({
                saleMethod: saleMethods.claimBack,
              });
            } else {
              this.setState({
                saleMethod: saleMethods.placeABid,
              });
            }
          }
        } else {
          this.setState({
            saleMethod: saleMethods.sold,
          });
        }
      }
    } else {
      if (isOwner) {
        const method = saleMethods.noButton;
        method.bidDesc =
          saleState === "BUY" ? (
            <FormattedMessage id="price" defaultMessage="Price" />
          ) : (
            <FormattedMessage
              id="current_offer"
              defaultMessage="Current offer"
            />
          );
        return this.setState({
          saleMethod: method,
        });
      } else {
        if (isAuction) {
          this.setState({
            saleMethod: saleMethods.placeABid,
            showTimer: true,
          });
        } else {
          this.setState({ showTimer: false });
          if (+bidDetails.bidValue > 0) {
            if (bidDetails.bidder === web3Data.accounts[0]) {
              this.setState({
                saleMethod: saleMethods.claimAfterAuction,
              });
            } else
              this.setState({
                saleMethod: saleMethods.sold,
              });
          } else
            this.setState({
              saleMethod: saleMethods.buyNow,
            });
        }
      }
    }
  };

  getEditionNumber = (NFTDetails, currentEdition) => {
    const { authData, web3Data } = this.props;
    if (currentEdition) return this.fetchNFTDetails(currentEdition);
    const { editions, price, edition } = NFTDetails;
    var lowest = Number.POSITIVE_INFINITY;
    let index = 0;
    var tmp;
    // console.log("editions sold", NFTDetails);
    if (NFTDetails.edition === 1) return this.setEditionnumber(1);
    if (editions.length === edition || editions.length === 0)
      return this.setEditionnumber(1);
    if (NFTDetails.auctionEndDate >= new Date().getTime() / 1000)
      return this.setEditionnumber(1);
    for (var i = editions?.length - 1; i >= 0; i--) {
      if (
        !editions[i].isBurned &&
        authData &&
        authData?.data?.id === editions[i].ownerId.id
      )
        return this.setEditionnumber(editions[i].edition);
      if (editions[i].isOpenForSale && !editions[i].isBurned) {
        tmp = editions[i].saleType.price;
        if (tmp < lowest && tmp < NFTDetails.price) {
          lowest = tmp;
          index = editions[i].edition;
        }
      }
    }
    if (!index) {
      for (let k = 0; k < edition; k++) {
        const soldEdition = NFTDetails.editions.find(
          ({ edition }) => edition === k + 1
        );
        if (!soldEdition) {
          index = k + 1;
          break;
        }
      }
    }
    // console.log("index", index);

    this.setEditionnumber(index);
  };
  fetchNFTDetails = async (_edition) => {
    const { authData, web3Data } = this.props;
    const NFTDetails = this.state.NFTDetails;
    const escrowContractInstance = getContractInstance(true);

    const tokenID = NFTDetails.tokenId;
    let newEdition = _edition;
    const bidDetails = await escrowContractInstance.methods
      .bid(+tokenID, newEdition)
      .call();
    const soldEdition = NFTDetails.editions.find(
      ({ edition }) => edition === newEdition
    );
    let selectedNFTDetails;
    // console.log(soldEdition?.transactionId);
    if (soldEdition)
      selectedNFTDetails = {
        bidTimeStamp: bidDetails.timeStamp,
        isOwner:
          soldEdition.transactionId === "0x"
            ? false
            : soldEdition.ownerId.id === authData?.data?.id,
        ownerId: soldEdition.ownerId,
        isOpenForSale: soldEdition.isOpenForSale,
        price: soldEdition.isOpenForSale
          ? soldEdition.saleType.type === "OFFER"
            ? +web3.utils.fromWei(bidDetails.bidValue) > 0
              ? +web3.utils.fromWei(bidDetails.bidValue)
              : soldEdition.saleType.price
            : soldEdition.saleType.price
          : soldEdition.transactionId === "0x"
            ? +web3.utils.fromWei(bidDetails.bidValue) > 0
              ? +web3.utils.fromWei(bidDetails.bidValue)
              : soldEdition.saleType.price
            : soldEdition.price,
        saleState: soldEdition.saleType.type,
        secondHand: soldEdition.transactionId === "0x" ? false : true,
        orderNonce:
          soldEdition.transactionId === "0x"
            ? NFTDetails.nonce
            : soldEdition.nonce,
        isBurned: soldEdition.isBurned,
      };
    else
      selectedNFTDetails = {
        bidTimeStamp: bidDetails.timeStamp,
        isOwner: NFTDetails?.ownerId.id === authData?.data?.id,
        ownerId: NFTDetails.ownerId,
        isOpenForSale: true,
        price:
          NFTDetails.saleState === "AUCTION"
            ? +web3.utils.fromWei(bidDetails.bidValue) > 0
              ? +web3.utils.fromWei(bidDetails.bidValue)
              : NFTDetails.price
            : NFTDetails.price,
        saleState:
          NFTDetails.saleState === "AUCTION"
            ? NFTDetails.auctionEndDate > new Date().getTime() / 1000
              ? "AUCTION"
              : "BUY"
            : "BUY",
        secondHand: false,
        orderNonce: NFTDetails.nonce,
        isBurned: false,
      };

    this.setState({
      bidDetails: {
        currentBidValue: web3.utils.fromWei(bidDetails.bidValue),
        bidder: bidDetails.bidder,
      },
      selectedNFTDetails,
    });
    this.setState({ loader: false });
    this.setNFTBuyMethod(
      bidDetails,
      selectedNFTDetails.isOwner,
      selectedNFTDetails.secondHand,
      selectedNFTDetails.isOpenForSale,
      selectedNFTDetails.saleState,
      selectedNFTDetails.price,
      NFTDetails.isActive
    );
  };
  setEditionnumber = (number) => {
    this.setState({ currentEdition: number });
  };

  closePopUp = () => {
    this.setState({ isOpen4: false });
  };
  changeOwnerActionName = (action, open) => {
    // const { isApprovedForAll } = this.state;

    // if (!isApprovedForAll) return;

    if (open === 7) {
      this.toggle(1);
      this.toggle(open);
    } else {
      this.setState({ ownerActionName: action });
    }
  };

  setOwnerActions = (saleMethod) => {
    const { isApprovedForAll } = this.state;
    if (!isApprovedForAll) {
      this.setState(
        {
          ownerActionName: "setApprovalForAll",
          nextMethod: saleMethod,
        },
        () => this.toggle(1)
      );
    } else
      this.setState({ ownerActionName: saleMethod.name }, () =>
        this.toggle(saleMethod.open)
      );
  };

  userTransactionHandler = () => {
    const { authData } = this.props;
    const { saleMethod, isApprovedForAll } = this.state;
    if (authData) {
      if (
        (saleMethod.checkApproval && !isApprovedForAll) ||
        saleMethod.open === 1
      ) {
        return this.setOwnerActions(saleMethod);
      } else this.toggle(saleMethod.open);
    } else {
      this.toggle(4); // open login pop up
    }
  };

  getNFTDetails = async () => {
    const NFTDetails = await actions.getSingleNFTDetails(
      this.props.match.params.id
    );
    if (NFTDetails) {
      this.setState({ NFTDetails }, () =>
        this.getEditionNumber(NFTDetails, this.state.currentEdition)
      );
    }
  };

  render() {
    let id = this.props.match.params.id;
    const {
      bidDetails,
      bnbUSDPrice,
      currentEdition,
      loading,
      saleMethod,
      showTimer,
      selectedNFTDetails,
      NFTDetails,
      ext,
      loader,
      accountBalance,
      networkError,
    } = this.state;
    const { likesCount, isLiked, authData, web3Data } = this.props;
    // console.log('networkError ? ', networkError)
    let currentCurrenctyPrice =
      this.props.lng === "en" ? bnbUSDPrice.usd : bnbUSDPrice.try;
    // console.log("selected nft details", selectedNFTDetails);
    if (loader) {
      return (
        <>
          <Gs.MainSection>
            <NFTdetailSection>
              <LoaderBX>
                <img src={LoaderGif} alt="" />
              </LoaderBX>
            </NFTdetailSection>
          </Gs.MainSection>
          {networkError && (
            <BlackWrap>
              <WhiteBX01>
                <WGTitle>
                  <FormattedMessage
                    id="network_warning"
                    defaultMessage="Please switch to a supported network: BSC"
                  />
                </WGTitle>
              </WhiteBX01>
            </BlackWrap>
          )}
        </>
      );
    }
    Number.prototype.noExponents = function () {
      var data = String(this).split(/[eE]/);
      if (data.length == 1) return data[0];

      var z = "",
        sign = this < 0 ? "-" : "",
        str = data[0].replace(".", ""),
        mag = Number(data[1]) + 1;

      if (mag < 0) {
        z = sign + "0.";
        while (mag++) z += "0";
        return z + str.replace(/^-/, "");
      }
      mag -= str.length;
      while (mag--) z += "0";
      return str + z;
    };
    return (
      <>
        <Helmet>
          <meta property="og:url" content={window.location.href} />
          <meta property="og:title" content={NFTDetails?.title} />
          <meta property="og:image" content={NFTDetails?.image.compressed} />
          <meta property="og:description" content={NFTDetails?.description} />
        </Helmet>

        <Gs.MainSection>
          <NFTdetailSection>
            <NFTDleft>
              <NFTDleftcontainer>
                <NFTDleftImg>
                  {ext === `image` && (
                    <Link to="#" onClick={() => this.toggle(6)}>
                      <img
                        src={NFTDetails?.image.original}
                        alt=""
                        className={this.state.imgClass}
                        onLoad={(image) => {
                          if (image.target.height > image.target.width) {
                            this.setState({ imgClass: "vimg" });
                          } else if (image.target.width > image.target.height)
                            this.setState({ magnifyClass: "hr-box" });
                        }}
                      />{" "}
                    </Link>
                  )}
                  {ext === "audio" && (
                    <ReactAudioPlayer
                      src={NFTDetails?.image.original}
                      // autoPlay
                      controls
                    />
                  )}
                  {ext === "video" && (
                    <ReactPlayer
                      width="100%"
                      controls={true}
                      url={NFTDetails?.image.original}
                      playing={true}
                      playIcon={<></>}
                      loop={true}
                    />
                  )}
                </NFTDleftImg>
              </NFTDleftcontainer>
            </NFTDleft>
            <NFTDright>
              {
                <NFTDrightcontainer>
                  <NFTDRtopbar>
                    <NFTDrtitle>
                      {NFTDetails?.title ? NFTDetails?.title : ""}
                    </NFTDrtitle>
                    <NFTtopbarright>
                      {NFTDetails?.unlockContent && (
                        <NFTLock>
                          <img src={Lock} alt="" />
                        </NFTLock>
                      )}
                      <NFTLike
                        className={
                          loading || !web3Data?.isLoggedIn ? `disabled` : ``
                        }
                        onClick={() => {
                          this.props.likeToggler(id);
                          this.setState({ loading: true });
                        }}
                      >
                        <img
                          src={isLiked.isFollowed ? Redheart : redheartBorder}
                          alt=""
                        />
                        <p>{likesCount.count}</p>
                      </NFTLike>
                    </NFTtopbarright>
                  </NFTDRtopbar>
                  {NFTDetails?.description && (
                    <Decs2>
                      <CustomScrollbars
                        autoHide
                        autoHideTimeout={1000}
                        style={{
                          width: "100%",
                          height: "80px",
                          position: "relative",
                        }}
                      >
                        {NFTDetails.description}
                      </CustomScrollbars>
                    </Decs2>
                  )}
                  <Historysection>
                    <UserImgName>
                      <Link to={`/creator/${NFTDetails?.ownerId.id}`}>
                        <img
                          src={
                            NFTDetails?.ownerId.profile
                              ? NFTDetails.ownerId.profile
                              : UserImg
                          }
                          alt=""
                        />
                        {NFTDetails?.ownerId.username
                          ? `@${NFTDetails.ownerId.username}`
                          : NFTDetails?.ownerId.name}
                      </Link>
                    </UserImgName>
                    <button onClick={() => this.toggle(9)}>
                      <FormattedMessage id="history" defaultMessage="History" />
                    </button>
                  </Historysection>
                  <Edition>
                    <div className="ed-box">
                      <div className="ed-left">
                        <p>
                          <FormattedMessage
                            id="edition"
                            defaultMessage="Edition"
                          />
                        </p>
                        <div className="ed-left-inner">
                          <h3>{this.state.currentEdition}</h3>
                          <p className="gray-t">of {NFTDetails?.edition}</p>
                        </div>
                      </div>
                      <button to="#" onClick={() => this.toggle(10)}>
                        <FormattedMessage
                          id="select_edition"
                          defaultMessage="Select edition"
                        />
                      </button>
                    </div>
                    <div className="ed-box">
                      <div className="ed-left">
                        <p>{saleMethod.bidDesc}</p>
                        <div className="ed-left-inner">
                          <h3>
                            {Number(selectedNFTDetails?.price)
                              .noExponents()
                              .replace(
                                /([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,
                                "$1"
                              )}{" "}
                            BNB
                          </h3>
                          <p className="gray-t">
                            {/* {
                            <FormattedMessage id="currency" values={{}} defaultMessage="en">
                              {(lang) => {
                                return console.log("updated lang ? ", lang);
                              }}
                            </FormattedMessage>
                          } */}
                            {(
                              selectedNFTDetails?.price * currentCurrenctyPrice
                            ).toLocaleString(undefined, 2)}{" "}
                            <FormattedMessage
                              id="currency"
                              defaultMessage="en"
                            />
                          </p>
                        </div>
                      </div>
                      <p className="royalty">
                        <FormattedMessage
                          id="nft_price_lable"
                          defaultMessage="A 10% royalty goes to the creator for future resale"
                        />
                      </p>
                    </div>
                    {showTimer && (
                      <div className="ed-box ed-mb-block">
                        <p>
                          <FormattedMessage
                            id="ending_in"
                            defaultMessage="Ending in"
                          />
                          ,
                        </p>
                        <FlexDiv className="JCFS">
                          <Timer
                            timeLeft={NFTDetails?.auctionEndDate}
                            onlyHours={true}
                            isDetailed={true}
                          />
                        </FlexDiv>
                      </div>
                    )}
                    {NFTDetails?.unlockContent && NFTDetails?.digitalKey ? (
                      <div className="ed-box ed-ulock ed-mb-block">
                        <p>
                          <FormattedMessage
                            id="unlock_content_label"
                            defaultMessage="Unlockable content message"
                          />
                        </p>
                        <SkyNoteBox>
                          <CustomScrollbars
                            autoHide
                            autoHideTimeout={1000}
                            style={{
                              width: "100%",
                              height: "47px",
                              position: "relative",
                            }}
                          >
                            <p className="note-text">
                              {NFTDetails?.digitalKey}
                            </p>
                          </CustomScrollbars>
                        </SkyNoteBox>
                      </div>
                    ) : (
                      ``
                    )}
                  </Edition>
                  <NFTcartButtons>
                    {saleMethod.btnName ? (
                      <button
                        disabled={saleMethod.disable}
                        onClick={() => {
                          this.userTransactionHandler();
                        }}
                      >
                        {saleMethod.btnName}
                      </button>
                    ) : null}
                    {selectedNFTDetails?.isOwner &&
                      selectedNFTDetails.isOpenForSale &&
                      selectedNFTDetails.secondHand &&
                      !selectedNFTDetails.isBurned ? (
                      <button
                        className="bordered"
                        onClick={() => {
                          this.setOwnerActions(saleMethods.cancelSaleOrder);
                        }}
                      >
                        <FormattedMessage
                          id="cancel_sale_order"
                          defaultMessage="Cancel Sale Order"
                        />
                      </button>
                    ) : null}
                    {NFTDetails?.status === "NOT_MINTED" &&
                      web3Data.isLoggedIn ? (
                      <button
                        onClick={() =>
                          this.props.history.push(
                            `/user/nftEdit/${NFTDetails.id}`
                          )
                        }
                      >
                        Edit{" "}
                      </button>
                    ) : selectedNFTDetails?.isOwner &&
                      !selectedNFTDetails.isOpenForSale &&
                      !selectedNFTDetails.isBurned ? (
                      <>
                        <button
                          className="bordered"
                          onClick={() => {
                            this.setOwnerActions(saleMethods.burn);
                          }}
                        >
                          <FormattedMessage
                            id="burn"
                            defaultMessage="Transfer"
                          />
                        </button>
                        <button
                          className="bordered"
                          onClick={() =>
                            this.setOwnerActions(saleMethods.transfer)
                          }
                        >
                          <FormattedMessage
                            id="transfer"
                            defaultMessage="Transfer"
                          />
                        </button>
                      </>
                    ) : null}
                  </NFTcartButtons>
                </NFTDrightcontainer>
              }
            </NFTDright>
          </NFTdetailSection>
          <Collapse
            isOpen={this.state.isOpen1}
            className={
              "app__collapse " + (this.state.isOpen1 ? "collapse-active" : "")
            }
          >
            <NftOwnerActions
              toggle={this.toggle}
              ownerActionName={this.state.ownerActionName}
              edition={this.state.currentEdition}
              tokenID={NFTDetails?.tokenId}
              isApprovedForAll={this.state.isApprovedForAll}
              changeOwnerActionName={this.changeOwnerActionName}
              orderNonce={selectedNFTDetails?.orderNonce}
              timeStamp={selectedNFTDetails?.bidTimeStamp}
              checkUserApproval={this.checkUserApproval}
              nftDetails={this.getNFTDetails}
              nextMethod={this.state.nextMethod}
              accountBalance={accountBalance}
            />
          </Collapse>
          <Collapse
            isOpen={this.state.isOpen6}
            className={
              "app__collapse " + (this.state.isOpen6 ? "collapse-active" : "")
            }
          >
            <Magnifypopup
              toggle={this.toggle}
              imageURL={NFTDetails?.image.original}
              magnifyClass={this.state.magnifyClass}
            />
          </Collapse>
          <Collapse
            isOpen={this.state.isOpen7}
            className={
              "app__collapse " + (this.state.isOpen7 ? "collapse-active" : "")
            }
          >
            <POSpopup
              toggle={this.toggle}
              tokenId={NFTDetails?.tokenId}
              editionNumber={this.state.currentEdition}
              web3Data={this.props.web3Data}
              nftDetails={this.getNFTDetails}
              bnbUSDPrice={bnbUSDPrice}
              accountBalance={accountBalance}
            />
          </Collapse>
          <Collapse
            isOpen={this.state.isOpen8}
            className={
              "app__collapse " + (this.state.isOpen8 ? "collapse-active" : "")
            }
          >
            <PABpopup
              toggle={this.toggle}
              method={saleMethod.name}
              nonce={selectedNFTDetails?.orderNonce}
              price={selectedNFTDetails?.price}
              currentBidValue={bidDetails.currentBidValue}
              currentEdition={this.state.currentEdition}
              fetchNFTDetails={this.fetchNFTDetails}
              nftDetails={this.getNFTDetails}
              nextMethod={this.state.nextMethod}
              accountBalance={accountBalance}
              secondHand={selectedNFTDetails.secondHand}
            />
          </Collapse>
          {this.state.isOpen9 ? (
            <Collapse
              isOpen={this.state.isOpen9}
              className={
                "app__collapse " + (this.state.isOpen9 ? "collapse-active" : "")
              }
            >
              <Historypopup
                toggle={this.toggle}
                edition={currentEdition}
                nftId={id}
              />
            </Collapse>
          ) : (
            ``
          )}
          <Collapse
            isOpen={this.state.isOpen10}
            className={
              "app__collapse " + (this.state.isOpen10 ? "collapse-active" : "")
            }
          >
            <SelectEdition
              toggle={this.toggle}
              NFTDetails={NFTDetails}
              web3Data={this.props.web3Data}
              setEditionnumber={this.setEditionnumber}
            />
          </Collapse>

          {this.state.isOpen4 ? <Login toggle={this.toggle} /> : ``}
        </Gs.MainSection>
      </>
    );
  }
  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };
}

// Common Style Div

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  &.JCFS {
    justify-content: flex-start;
  }
`;
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;
const NFTdetailSection = styled(FlexDiv)`
  justify-content: flex-start;
`;
const NFTDleft = styled(FlexDiv)`
  background-color: #eef2f7;
  width: 41%;
  min-height: 660px;
  ${Media.md} {
    width: 100%;
    min-height: 504px;
  }
`;

const NFTDleftcontainer = styled.div`
  width: 100%;
  // max-width: 515px;
  max-width: 85%;
  margin: 0 auto;
  padding: 50px 25px;
  ${Media.md} {
    margin: 0 auto;
    padding: 70px 43px;
  }
  ${Media.xs} {
    max-width: 100%;
    padding: 50px 25px;
  }
  .vimg {
    max-width: 380px;
  }
`;

const NFTDleftImg = styled.div`
  width: 100%;
  text-align: center;
  img {
    box-shadow: 30px 30px 25px 10px rgb(0 0 0 / 20%);
    width: 100%;
    ${Media.xs} {
      box-shadow: 10px 10px 20px 2px rgb(0 0 0 / 20%);
    }
  }
`;
const NFTDright = styled.div`
  width: 59%;
  ${Media.md} {
    width: 100%;
  }
`;
const NFTDrightcontainer = styled.div`
  width: 100%;
  max-width: 740px;
  margin-right: auto;
  padding: 70px 100px 70px 70px;
  position: relative;
  ${Media.lg} {
    padding: 30px 100px 30px 30px;
  }
  ${Media.md} {
    max-width: 100%;
    padding: 30px 15px;
  }
`;
const NFTDrtitle = styled.div`
  font-size: 28px;
  letter-spacing: -1.4px;
  color: #000;
  margin: 0px 0px 16px 0px;
  font-weight: 700;
  line-height: normal;
  ${Media.md} {
    margin: 25px 0px 10px 0px;
    font-size: 22px;
    letter-spacing: -1.1px;
  }
`;
const NFTDRtopbar = styled(FlexDiv)`
  justify-content: space-between;
  align-items: flex-start;
  ${Media.md} {
    display: initial;
  }
`;
const NFTtopbarright = styled(FlexDiv)`
  position: absolute;
  right: 0px;
  ${Media.lg} {
    right: 10px;
  }
  ${Media.md} {
    top: 10px;
  }
`;
const NFTLock = styled(FlexDiv)`
  width: 34px;
  height: 34px;
  box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 10%);
  border-radius: 30px;
  margin-right: 5px;
`;
const NFTLike = styled(FlexDiv)`
  width: 56px;
  height: 34px;
  box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 10%);
  border-radius: 30px;
  cursor: pointer;
  p {
    color: #ff2a44;
    font-size: 12px;
    font-weight: 600;
    margin: 0px;
  }
  img {
    line-height: normal;
    width: 15px;
    height: 15px;
    margin: 0px 4px 0px 0px;
  }
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const UserImgName = styled(FlexDiv)`
  a {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #000;
    font-size: 14px;
    letter-spacing: -0.7px;
    font-weight: 600;
    margin: 0px;
    img {
      border-radius: 50%;
      margin-right: 10px;
      width: 32px;
      height: 32px;
    }
  }
`;

const Decs2 = styled.div`
  font-size: 16px;
  letter-spacing: -0.8px;
  color: #000;
  margin: 0px 0px 20px 0px;
  font-weight: 500;
  line-height: 28px;
  word-break: break-word;
  ${Media.md} {
    margin: 0px 0px 30px 0px;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: -0.7px;
  }
`;

const Historysection = styled(FlexDiv)`
  justify-content: flex-start;
  margin-bottom: 40px;
  button {
    font-size: 10px;
    letter-spacing: -0.36px;
    color: #000;
    padding: 6px 15px;
    border-radius: 9px;
    border: 1px solid #000;
    margin: 0px 0px 0px 58px;
    :hover {
      background-color: #000;
      color: #fff;
    }
    ${Media.xs} {
      margin:0px;
    }
  }
  ${Media.xs} {
    justify-content: space-between;
  }
`;

const Edition = styled(FlexDiv)`
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0px 0px 50px;
  ${Media.lg} {
    justify-content: space-between;
  }
  ${Media.md} {
    display: initial;
  }
  .ed-box {
    margin-right: 45px;
    &.ed-mb-block {
      ${Media.md} {
        display: block;
      }
    }
    ${Media.lg} {
      margin-right: 18px;
    }
    ${Media.md} {
      margin: 0px 0px 30px 0px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .ed-left-inner {
      ${Media.md} {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        p.gray-t {
          margin: 0px 0px 0px 4px;
          font-size: 12px;
          line-height: 12px;
        }
        h3 {
          margin: 0px;
          font-size: 24px;
        }
      }
    }
    :last-child {
      margin-right: 0px;
      max-width: 232px;
      width: 100%;
      &.ed-ulock {
        ${Media.lg} {
          max-width: 200px;
        }
        ${Media.md} {
          max-width: 100%;
        }
      }
      ${Media.md} {
        max-width: 100%;
      }
    }
    p {
      color: #000;
      font-size: 16px;
      letter-spacing: -0.5px;
      margin: 0px 0px 10px;
      ${Media.md} {
        font-size: 12px;
        margin: 0px 0px 5px;
      }
    }
    a,
    button {
      color: #0066ff;
      font-size: 12px;
      letter-spacing: -0.6px;
      font-weight: 600;
      line-height: 13px;
      padding: 0px;
      ${Media.xs} {
        font-size: 10px;
      }
    }
    h3 {
      color: #000;
      font-size: 32px;
      letter-spacing: -1.42px;
      font-weight: 700;
      margin: 0px 0px 7px;
    }
    .gray-t {
      color: rgb(0 0 0 / 30%);
      font-size: 16px;
      letter-spacing: -0.71px;
      font-weight: 600;
      margin: 0px 0px 8px;
    }
    .royalty {
      color: #000;
      font-size: 12px;
      letter-spacing: -0.6px;
      margin: 0px;
      line-height: normal;
      width: 120px;
    }
    .time-block {
      margin-right: 20px;
      ${Media.md} {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        p.gray-t {
          margin: 0px 0px 0px 4px;
          font-size: 12px;
          line-height: 12px;
        }
        h3 {
          margin: 0px;
          font-size: 24px;
        }
      }
    }
  }
`;

const SkyNoteBox = styled.div`
  background-color: #eef2f7;
  border-radius: 10px;
  padding: 15px;

  p.note-text {
    color: #000;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: -0.5px;
    margin: 0px;
    word-break: break-word;
  }
`;

const NFTcartButtons = styled.div`
  ${Media.md} {
    text-align: center;
  }
  button {
    background-color: #000;
    color: #fff;
    padding: 13px 60px;
    border-radius: 15px;
    font-size: 14px;
    letter-spacing: -0.5px;
    margin: 0px 10px 10px 0px;
    ${Media.xs} {
      display: block;
      margin: 0px auto 10px;
      // width: 200px;
      height: 44px;
      // padding: 0px;
    }
    :hover {
      background-image: linear-gradient(90deg, #d121d6, #febf11);
      box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 20%);
    }
    &:disabled {
      background-color: rgb(0 0 0 / 30%);
      :hover {
        background: rgb(0 0 0 / 30%);
        box-shadow: none;
      }
    }
    &.bordered {
      background-color: transparent;
      border: 1px solid #000;
      color: #000;
      padding: 12px 60px;
      :hover {
        background: none;
      }
    }
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
  form {
    width: 100%;
    // .view{
    //   width:100%;
    //   overflow-x:hidden !important;
    //   overflow-y:auto !important;
    // }
  }
`;
const WGTitle = styled.div`
  color: #000000;
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const mapDipatchToProps = (dispatch) => {
  return {
    likeToggler: (id) => dispatch(actions.likeToggler(id)),
    // getSingleNFTDetails: (id) => dispatch(actions.getSingleNFTDetails(id)),
    getLikesCount: (id) => dispatch(actions.getLikesCount(id)),
    getIsLiked: (id) => dispatch(actions.getIsLiked(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    NFTDetails: state.fetchSingleNFTDetails,
    likesCount: state.fetchLikesCount,
    likeToggled: state.fetchLikeToggled,
    isLiked: state.fetchIsLiked,
    authData: state.fetchAuthData,
    web3Data: state.fetchWeb3Data,
    lng: state.fetchLanguage,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDipatchToProps)(NftDetail)
);
