import React, { Component } from "react";
import styled from "styled-components";
import Gs from "../Theme/globalStyles";
import { Link } from "react-router-dom";
import Media from "../Theme/media-breackpoint";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { connect } from "react-redux";
import Banner1 from "../Assets/images/banner-1.jpg";
import Banner2 from "../Assets/images/banner-2.jpg";
import NFT1 from "../Assets/images/nft1.jpg";
import NFT2 from "../Assets/images/nft2.jpg";
import NFT3 from "../Assets/images/nft3.jpg";
import Redheart from "../Assets/images/Redheart.svg";
import UserImg from "../Assets/images/user-img.jpg";
import HeartIcon from "../Assets/images/heart-icon.svg";
import StarIcon from "../Assets/images/star-icon.svg";
import RoundIcon from "../Assets/images/round-icon.svg";
import AdBannerIMG from "../Assets/images/adbanner.jpg";
import LArrow from "../Assets/images/banner-larrow.svg";
import RArrow from "../Assets/images/banner-rarrow.svg";

import { actions } from "../actions";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const CustomDot = ({ onClick, ...rest }) => {
  const {
    onMove,
    index,
    active,
    carouselState: { currentSlide, deviceType },
  } = rest;
  const carouselItems = [1, 2, 3, 4, 5, 6];
  return (
    <button
      className={active ? "active" : "inactive"}
      onClick={() => onClick()}
    >
      {React.Children.toArray(carouselItems)[index]}
    </button>
  );
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3Data: null,
      nftContractInstance: null,
      newNFTURI: null,
      isApproved: false,
      creatorTokenIds: null,
      ethEnabled: false,
      nfts: [],
      selectedFile: null,
      cards: [],
      hasMore: false,
      tokenCopies: 0,
      tokenURI: null,
      isLogout: false,
    };
  }
  static async getDerivedStateFromProps(nextProps, prevState) {
    let { web3Data } = nextProps;
    if (web3Data !== prevState.web3Data) return { web3Data: web3Data };
    else return null;
  }

  async componentDidUpdate(prevProps, prevState) {
    // console.log(this.props);
    let { web3Data, nftContractInstance } = this.props;

    // if (web3Data !== prevProps.web3Data)
    //   this.setState({ web3Data: web3Data }, () => {
    //     if (nftContractInstance)
    //       this.setUserNFTData(nftContractInstance, web3Data);
    //   });
    // if (nftContractInstance !== this.state.nftContractInstance) {
    //   this.setState({ nftContractInstance }, () => {
    //     this.setGeneralNFTData(nftContractInstance);
    //     if (web3Data) this.setUserNFTData(nftContractInstance, web3Data);
    //   });
    // }
  }

  componentDidMount() {
    const { web3Data, nftContractInstance } = this.props;
    if (!web3Data) this.props.getWeb3();
    else this.setState({ web3Data: web3Data });
    this.props.getNFTContractInstance();

    // set initial cards
    this.setState(
      { cards: Array.from({ length: 8 }), hasMore: true },
      () => { }
    );
  }
  render() {
    return (
      <>
        <HomeBanner>
          <Carousel
            responsive={responsive}
            showDots
            infinite={true}
            customDot={<CustomDot />}
          >
            <div className="item">
              <Link to="/">
                <img src={Banner1} alt="" />
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <img src={Banner2} alt="" />
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <img src={Banner1} alt="" />
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <img src={Banner2} alt="" />
              </Link>
            </div>
            <div className="item">
              <Link to="/">
                <img src={Banner1} alt="" />
              </Link>
            </div>
          </Carousel>
        </HomeBanner>
        <HomeNFTs>
          <Gs.Container>
            <div className="home-title">
              <h3>Top NFTs</h3>
            </div>
            <NFTfirstbox>
              <div className="w60">
                <NFTfbleft>
                  <img src={NFT3} alt="" />
                </NFTfbleft>
              </div>
              <div className="w40">
                <NFTfbright>
                  <NFTLike>
                    <Link to="/">
                      <img src={Redheart} alt="" />
                    </Link>
                    <p>306</p>
                  </NFTLike>
                  <h3>
                    Artwork name / title dolor lorem ipsum sit amet consectatur
                    elit
                  </h3>
                  <p>
                    Phasellus at dui imperdiet, eleifend lacus gravida, accumsan
                    arcu. Sed consequat arcu finibus augue, eu pellentesque quam
                    fermentum.{" "}
                  </p>
                  <Link to="/">
                    See the collection <i className="fas fa-angle-right"></i>
                  </Link>
                  <Edition>
                    <div className="ed-box">
                      <p>Edition</p>
                      <h3>
                        25 <span>of 2500</span>
                      </h3>
                    </div>
                    <div className="ed-box">
                      <p>Current bid</p>
                      <h3>0.00 BNB</h3>
                    </div>
                    <div className="ed-box">
                      <p>Ending in</p>
                      <h3>13h 12m 11s</h3>
                    </div>
                  </Edition>
                  <UserImgName>
                    <img src={UserImg} alt="" />
                    @username
                  </UserImgName>
                </NFTfbright>
              </div>
            </NFTfirstbox>
            <NFTfourbox>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <div className="NFT-home-box">
                    <img className="main" src={NFT2} alt="" />
                    <div className="NFT-home-box-inner">
                      <h4>
                        Artwork name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <CollectionBar>
                        <p>
                          25 <span>of 2500</span>
                        </p>
                        <p>
                          <Link to="/">
                            See the collection{" "}
                            <i className="fas fa-angle-right"></i>
                          </Link>
                        </p>
                      </CollectionBar>
                      <Edition className="edition2">
                        <div className="ed-box">
                          <p>Current bid</p>
                          <h3>0.00 BNB</h3>
                        </div>
                        <div className="ed-box">
                          <p>Ending in</p>
                          <h3>13h 12m 11s</h3>
                        </div>
                      </Edition>
                      <UserImgName>
                        <img src={UserImg} alt="" />
                        @username
                      </UserImgName>
                    </div>
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <div className="NFT-home-box">
                    <img className="main" src={NFT2} alt="" />
                    <div className="NFT-home-box-inner">
                      <h4>
                        Artwork name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <CollectionBar>
                        <p>
                          25 <span>of 2500</span>
                        </p>
                        <p>
                          <Link to="/">
                            See the collection{" "}
                            <i className="fas fa-angle-right"></i>
                          </Link>
                        </p>
                      </CollectionBar>
                      <Edition className="edition2">
                        <div className="ed-box">
                          <p>Current bid</p>
                          <h3>0.00 BNB</h3>
                        </div>
                        <div className="ed-box">
                          <p>Ending in</p>
                          <h3>13h 12m 11s</h3>
                        </div>
                      </Edition>
                      <UserImgName>
                        <img src={UserImg} alt="" />
                        @username
                      </UserImgName>
                    </div>
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <div className="NFT-home-box">
                    <img className="main" src={NFT2} alt="" />
                    <div className="NFT-home-box-inner">
                      <h4>
                        Artwork name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <CollectionBar>
                        <p>
                          25 <span>of 2500</span>
                        </p>
                        <p>
                          <Link to="/">
                            See the collection{" "}
                            <i className="fas fa-angle-right"></i>
                          </Link>
                        </p>
                      </CollectionBar>
                      <Edition className="edition2">
                        <div className="ed-box">
                          <p>Current bid</p>
                          <h3>0.00 BNB</h3>
                        </div>
                        <div className="ed-box">
                          <p>Ending in</p>
                          <h3>13h 12m 11s</h3>
                        </div>
                      </Edition>
                      <UserImgName>
                        <img src={UserImg} alt="" />
                        @username
                      </UserImgName>
                    </div>
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <div className="NFT-home-box">
                    <img className="main" src={NFT2} alt="" />
                    <div className="NFT-home-box-inner">
                      <h4>
                        Artwork name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <CollectionBar>
                        <p>
                          25 <span>of 2500</span>
                        </p>
                        <p>
                          <Link to="/">
                            See the collection{" "}
                            <i className="fas fa-angle-right"></i>
                          </Link>
                        </p>
                      </CollectionBar>
                      <Edition className="edition2 JCSB">
                        <div className="ed-box">
                          <p>Current bid</p>
                          <h3>0.00 BNB</h3>
                        </div>
                        <div className="ed-box">
                          <button>
                            <FormattedMessage id="buy_now" defaultMessage="Buy now" />
                          </button>
                        </div>
                      </Edition>
                      <UserImgName>
                        <img src={UserImg} alt="" />
                        @username
                      </UserImgName>
                    </div>
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25>
            </NFTfourbox>
            <ViewallButton>
              <button>View all auctions</button>
            </ViewallButton>
            <div className="star-title">
              <h3>Hall of Fame</h3>
            </div>
            <HomeTabs>
              <Tabs>
                <TabList>
                  <Tab>Artist</Tab>
                  <Tab>Artworks</Tab>
                  <Tab>Collector</Tab>
                  <Tab>Our Picks</Tab>
                </TabList>
                <TabPanel>
                  <HomeTabDetail>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@skyistheanswer</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@jimmy</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@ayeshachasm</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@danielstagner</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@wolfden</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                  </HomeTabDetail>
                </TabPanel>
                <TabPanel>
                  <HomeTabDetail>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox2>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="title">
                              Artwork name / title dolor lorem ipsum sit
                              adipiscing
                            </p>
                            <p className="small">Sold for</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox2>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox2>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="title">
                              Artwork name / title dolor lorem ipsum sit
                              adipiscing
                            </p>
                            <p className="small">Sold for</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox2>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox2>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="title">
                              Artwork name / title dolor lorem ipsum sit
                              adipiscing
                            </p>
                            <p className="small">Sold for</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox2>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox2>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="title">
                              Artwork name / title dolor lorem ipsum sit
                              adipiscing
                            </p>
                            <p className="small">Sold for</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox2>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                  </HomeTabDetail>
                </TabPanel>
                <TabPanel>
                  <HomeTabDetail>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@skyistheanswer</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@jimmy</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                  </HomeTabDetail>
                </TabPanel>
                <TabPanel>
                  <HomeTabDetail>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@skyistheanswer</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@jimmy</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className="HOF-inner">
                            <img src={NFT2} alt="" />
                            <p className="user-name">@ayeshachasm</p>
                            <p className="small">Total Sale</p>
                            <p className="price">0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                  </HomeTabDetail>
                </TabPanel>
              </Tabs>
            </HomeTabs>
            
            <AdBanner>
              <a target="_blank" rel="noopener noreferrer" href="">
                <img src={AdBannerIMG} alt="" />
              </a>
              <button className="ani-1">Lorem ipsum</button>
            </AdBanner>
            <div className="heart-title">
              <h3>Collections</h3>
            </div>
            <CollectionSection>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <Link to="/">
                    <img src={NFT2} alt="" />
                  </Link>
                </Gs.TenpxGutter>
              </Gs.W25>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <Link to="/">
                    <img src={NFT2} alt="" />
                  </Link>
                </Gs.TenpxGutter>
              </Gs.W25>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <Link to="/">
                    <img src={NFT2} alt="" />
                  </Link>
                </Gs.TenpxGutter>
              </Gs.W25>
              <Gs.W25>
                <Gs.TenpxGutter>
                  <Link to="/">
                    <img src={NFT2} alt="" />
                  </Link>
                </Gs.TenpxGutter>
              </Gs.W25>
            </CollectionSection>
            <ViewallButton>
              <button>View all collections</button>
            </ViewallButton>
          </Gs.Container>
          <AdBanner2>
            <h2>Lorem ipsum dolor sit amet consectetur adipiscing elit</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              at dui imperdiet, eleifend lacus gravida, accumsan arcu. Sed
              consequat arcu finibus augue, eu pellentesque quam fermentum.{" "}
            </p>
            <button>Lorem ipsum</button>
          </AdBanner2>
        </HomeNFTs>
      </>
    );
  }
}
// Common Style Div
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const HomeBanner = styled.div`
  height: 660px;
  width: 100%;
  .item {
    img {
      width: 100%;
    }
  }
  .react-multiple-carousel__arrow {
    background: transparent;
    min-width: 20px;
    min-height: 20px;
    padding: 0px;
    border-radius: 0px;
    :hover {
      background: transparent;
    }
  }
  .react-multiple-carousel__arrow--left::before {
    background: url(${LArrow}) no-repeat;
    color: transparent;
  }
  .react-multiple-carousel__arrow--right::before {
    background: url(${RArrow}) no-repeat;
    color: transparent;
  }
  .react-multiple-carousel__arrow--left {
    left: calc(42.8% + 1px);
    bottom: 33px;
  }
  .react-multiple-carousel__arrow--right {
    right: calc(42.8% + 1px);
    bottom: 33px;
  }
  .react-multi-carousel-dot-list {
    background-color: rgba(255, 255, 255, 0.85);
    width: 320px;
    height: 52px;
    border-radius: 20px;
    margin: 0 auto 20px;
    button {
      position: relative;
      margin: 0px 10px;
      padding: 0px 0px 0px 10px;
      font-size: 14px;
      color: rgb(0 0 0 / 20%);
      &.active {
        color: #000;
      }
      :before {
        content: "0";
        position: absolute;
        left: 0px;
      }
    }
  }
`;

const HomeNFTs = styled.div`
  width: 100%;
  margin-top: 120px;
  .home-title {
    border-bottom: 1px solid #dddddd;
    text-align: left;
    margin-bottom: 30px;
    h3 {
      color: #000000;
      font-size: 32px;
      position: relative;
      line-height: 32px;
      margin: 0px 0px 15px;
      padding-left: 20px;
      letter-spacing: -1px;
      :before {
        content: "";
        position: absolute;
        left: 0px;
        top: 12px;
        width: 10px;
        height: 10px;
        background: url(${RoundIcon}) no-repeat;
      }
    }
  }
  .star-title {
    text-align: left;
    margin-bottom: 18px;
    h3 {
      color: #000000;
      font-size: 32px;
      position: relative;
      line-height: 32px;
      margin: 0px;
      padding-left: 20px;
      letter-spacing: -1px;
      :before {
        content: "";
        position: absolute;
        left: 0px;
        top: 12px;
        width: 12px;
        height: 12px;
        background: url(${StarIcon}) no-repeat;
      }
    }
  }
  .heart-title {
    border-bottom: 1px solid #dddddd;
    text-align: left;
    margin-bottom: 30px;
    h3 {
      color: #000000;
      font-size: 32px;
      position: relative;
      line-height: 32px;
      margin: 0px 0px 15px;
      padding-left: 20px;
      letter-spacing: -1px;
      :before {
        content: "";
        position: absolute;
        left: 0px;
        top: 12px;
        width: 12px;
        height: 11px;
        background: url(${HeartIcon}) no-repeat;
      }
    }
  }
`;

const NFTfirstbox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  position: relative;
  border-radius: 10px;
  margin-bottom: 30px;
  .w60 {
    width: 60%;
  }
  .w40 {
    width: 40%;
  }
`;
const NFTfbleft = styled(FlexDiv)`
  background-color: #eef2f7;
  padding: 80px 0px;
  img {
    box-shadow: 20px 20px 40px 1px rgb(0 0 0 /30%);
  }
`;
const NFTfbright = styled.div`
  padding: 20px 50px;
  h3 {
    color: #000000;
    font-size: 22px;
    letter-spacing: -0.83px;
    margin: 0px 0px 10px;
    line-height: normal;
  }
  p {
    color: #000000;
    font-size: 12px;
    letter-spacing: -0.53px;
    margin: 0px 0px 10px;
    line-height: 20px;
  }
  a {
    color: #000000;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: -0.5px;
    margin: 0px 0px 40px;
    line-height: 20px;
    display: block;
    :hover {
      color: #555;
      text-decoration: underline;
    }
  }
`;
const NFTLike = styled(FlexDiv)`
  width: 56px;
  height: 34px;
  position: absolute;
  right: 20px;
  top: 20px;
  box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 10%);
  border-radius: 30px;
  p {
    color: #ff2a44;
    font-size: 12px;
    font-weight: 600;
    margin: 0px;
  }
  a {
    line-height: normal;
    width: 15px;
    height: 15px;
    margin: 0px 4px 0px 0px;
  }
`;

const Edition = styled(FlexDiv)`
  justify-content: space-between;
  background-color: #eef2f7;
  border-radius: 10px;
  padding: 16px 20px;
  margin: 0px 0px 40px;
  .ed-box {
    p {
      color: #8e9194;
      font-size: 12px;
      letter-spacing: -0.6px;
      font-weight: 600;
      margin: 0px 0px 5px;
    }
    h3 {
      color: #000;
      font-size: 20px;
      letter-spacing: -0.89px;
      font-weight: 700;
      margin: 0px;
      span {
        font-size: 10px;
        font-weight: 300;
        letter-spacing: -0.44px;
      }
    }
  }
`;

const UserImgName = styled(FlexDiv)`
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
`;

const NFTfourbox = styled(FlexDiv)`
  flex-wrap: wrap;
  margin: 0px -10px 50px;
  .row {
    margin: 0px -10px;
  }
  img.main {
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .NFT-home-box {
    border-radius: 10px;
    border: 1px solid #dddddd;
    .NFT-home-box-inner {
      padding: 20px 15px;
      h4 {
        margin: 0px 0px 10px;
        font-size: 18px;
        color: #000000;
        font-weight: 600;
        line-height: 22px;
        letter-spacing: -0.67px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        min-height:44px;
      }
      .edition2 {
        justify-content: flex-start;
        padding: 10px 15px;
        margin-bottom: 20px;
        .ed-box {
          margin-right: 20px;
          p {
            font-size: 10px;
            letter-spacing: -0.5px;
            margin: 0px;
          }
          h3 {
            font-size: 16px;
            letter-spacing: -0.71px;
          }
          button {
            font-size: 10px;
            color: #000;
            letter-spacing: -0.36px;
            font-weight: 600;
            line-height: normal;
            padding: 10px 17px;
            border-radius: 13px;
            border: 1px solid #000000;
            :hover {
              background-color: #d121d6;
              color: #fff;
              border-color: #d121d6;
            }
          }
        }
      }
      .JCSB {
        justify-content: space-between;
        .ed-box {
          margin-right: 0px;
        }
      }
    }
  }
`;

const CollectionBar = styled(FlexDiv)`
  justify-content: space-between;
  margin-bottom: 20px;
  p {
    font-size: 14px;
    letter-spacing: -0.62px;
    font-weight: 600;
    margin: 0px;
    color: #000;
    span {
      font-size: 12px;
      letter-spacing: -0.53px;
      font-weight: 300;
    }
    a {
      font-size: 10px;
      letter-spacing: -0.5px;
      font-weight: 600;
      color: #000;
      :hover {
        color: #555;
        text-decoration: underline;
      }
    }
  }
`;

const ViewallButton = styled.div`
  text-align: center;
  margin-bottom: 120px;
  button {
    border: 1px solid #000000;
    border-radius: 10px;
    width: 190px;
    height: 44px;
    margin: 0 auto;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.5px;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

const CollectionSection = styled(FlexDiv)`
  margin: 0px -10px 50px;
  img {
    border-radius: 10px;
    border: 1px solid #dddddd;
  }
`;

const HomeTabs = styled.div`
  margin: 0px 0px 70px;
  .react-tabs__tab-list {
    border-bottom: 1px solid #ddd;
    margin-bottom: 30px;
  }
  .react-tabs__tab {
    bottom: 0px;
    padding: 6px 0px;
    margin: 0px 20px;
    color: rgb(0 0 0 / 30%);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.8px;
  }
  .react-tabs__tab--selected {
    border: none;
    border-bottom: 3px solid #000000;
    color: #000;
  }
`;

const HomeTabDetail = styled(FlexDiv)`
  margin: 0px -10px;
  justify-content: flex-start;
`;

const HallofFameBox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  border-radius: 10px;
  text-align: center;
  min-height: 260px;
  .HOF-inner {
    img {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin: 0px 0px 10px;
    }
    p.user-name {
      margin: 0px 0px 15px;
      font-size: 18px;
      color: #000000;
      font-weight: 700;
      letter-spacing: -0.9px;
    }
    p.small {
      margin: 0px;
      font-size: 10px;
      color: #8e9194;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    p.price {
      margin: 0px;
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      letter-spacing: -0.71px;
    }
  }
`;
const HallofFameBox2 = styled(FlexDiv)`
  border: 1px solid #dddddd;
  border-radius: 10px;
  text-align: center;
  .HOF-inner {
    img {
      width: 200px;
      height: 200px;
      margin: 0px 0px 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    p.title {
      margin: 0px 0px 15px;
      padding: 0px 15px;
      font-size: 12px;
      color: #000000;
      font-weight: 700;
      letter-spacing: -0.45px;
      line-height: normal;
    }
    p.small {
      margin: 0px;
      font-size: 10px;
      color: #8e9194;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    p.price {
      margin: 0px 0px 20px;
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      letter-spacing: -0.71px;
    }
  }
`;

const AdBanner = styled.div`
  border-radius: 20px;
  margin: 120px 0px;
  height: 406px;
  position: relative;
  a {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }
  }
  button {
    position: absolute;
    bottom: 50px;
    left: calc(50% - 95px);
    background-color: #000000;
    color: #fff;
    font-size: 14px;
    letter-spacing: -0.5px;
    font-weight: 700;
    border-radius: 15px;
    width: 190px;
    height: 44px;
    :hover {
      background-color: #d121d6;
      box-shadow: 2px 5px 10px 0px rgb(0 0 0 / 30%);
    }
  }
`;

const AdBanner2 = styled.div`
  padding: 120px 0px;
  margin: 120px 0px 0px;
  text-align: center;
  background: url(${AdBannerIMG}) no-repeat;
  background-size: cover;
  h2 {
    color: #000000;
    font-size: 42px;
    letter-spacing: -2px;
    font-weight: bold;
    line-height: normal;
    max-width: 680px;
    width: 100%;
    margin: 0 auto 30px;
  }
  p {
    color: #000000;
    font-size: 20px;
    letter-spacing: -0.5px;
    font-weight: 700;
    line-height: normal;
    max-width: 680px;
    width: 100%;
    margin: 0 auto 50px;
    :last-child {
      margin-bottom: 0px;
    }
  }
  button {
    background-color: #f40058;
    color: #fff;
    font-size: 14px;
    letter-spacing: -0.5px;
    font-weight: 700;
    border-radius: 15px;
    width: 190px;
    height: 44px;
    :hover {
      background-color: #000;
    }
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: () => dispatch(actions.getWeb3()),
    logIn: (nonce, signature) => dispatch(actions.logIn(nonce, signature)),
    getNFTContractInstance: () => dispatch(actions.getNFTContractInstance()),
    enableMetamask: () => dispatch(actions.enableMetamask()),
    generateNaunce: (address) => dispatch(actions.generateNaunce(address)),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.fetchWeb3Data,
    nftContractInstance: state.fetchNFTContractInstance,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(Dashboard);
