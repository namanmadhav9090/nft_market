import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";

import React, { Component } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import LazyLoad from "react-lazyload";
import styled from "styled-components";
import Media from "../../Theme/media-breackpoint";

import NFT2 from "../../Assets/images/nft2.jpg";
import UserIcon from "../../Assets/images/user-img.jpg";
import AudioCover from "../../Assets/images/audio-square.jpg";
import VideoCover from "../../Assets/images/video-square.jpg";
import HeartIcon from "../../Assets/images/heart-icon.svg";
import StarIcon from "../../Assets/images/star-icon.svg";
import RoundIcon from "../../Assets/images/round-icon.svg";
import Gs from "../../Theme/globalStyles";
import LoaderGif from "../../Assets/images/loading.gif";
import { motion } from "framer-motion";
import { actions } from "../../actions";
import { getFileType } from "../../helper/functions";

class HallOfFrame extends Component {
  componentDidMount() {
    const { artists, artworks, collectors } = this.props;
    if (!artists) {
      this.props.getHallOfFrameArtist(`artist`); // fetch hall of frame top artist
    }
    if (!artworks) {
      this.props.getHallOfFrameArtwork(`artwork`); // fetch hall of frame top artwork
    }
    if (!collectors) {
      this.props.getHallOfFrameCollector(`collector`); // fetch hall of frame top collector
    }
  }

  render() {
    const { artists, artworks, collectors } = this.props;

    const getPreview = (nftLink, ext) => {
      if (!ext) {
        let extension = getFileType(nftLink);
        extension.then(function (result) {
          ext = result;
        })
      }

      return ext === `image` ? (
        <motion.img
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          key={nftLink}
          src={nftLink}
          exit={{ opacity: 0 }}
        />
      ) : ext === "audio" ? (
        <motion.img
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          key={AudioCover}
          src={AudioCover}
          exit={{ opacity: 0 }}
        />
      ) : ext === "video" ? (
        <motion.img
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          key={VideoCover}
          src={VideoCover}
          exit={{ opacity: 0 }}
        />
      ) : (
        ``
      );
    };

    return (
      <LazyLoad>
        <HomeNFTs>
          <Gs.Container>
            <div className="star-title">
              <h3>
                <FormattedMessage
                  id="hall_of_fame"
                  defaultMessage="Hall of Fame"
                />
              </h3>
            </div>

            <HomeTabs>
              <Tabs>
                <TabList>
                  <Tab>
                    <FormattedMessage id="creators" defaultMessage="Creators" />
                  </Tab>
                  <Tab>
                    <FormattedMessage id="nfts" defaultMessage="NFTs" />
                  </Tab>
                  <Tab>
                    <FormattedMessage
                      id="collectors"
                      defaultMessage="Collectors"
                    />
                  </Tab>
                  {/* <Tab>Our Picks</Tab> */}
                </TabList>

                <TabPanel>
                  <HomeTabDetail>
                    {!artists ? (
                      <LoaderBX>
                        {" "}
                        <img src={LoaderGif} alt="" />{" "}
                      </LoaderBX>
                    ) : artists.length > 1 ? (
                      artists.map((artist, key) => {
                        return (
                          <Gs.W20 key={key}>
                            <Link to={`/creator/${artist._id}`}>
                              <Gs.TenpxGutter>
                                <HallofFameBox>
                                  <div className="HOF-inner">
                                    <img
                                      src={
                                        artist.profile
                                          ? artist.profile
                                          : UserIcon
                                      }
                                      alt=""
                                    />
                                    <p className="user-name">
                                      @{artist.username}
                                    </p>
                                    <p className="small">Total Sale</p>
                                    <p className="price">
                                      {artist.totalSale} BNB
                                    </p>
                                  </div>
                                </HallofFameBox>
                              </Gs.TenpxGutter>
                            </Link>
                          </Gs.W20>
                        );
                      })
                    ) : (
                      <p className="no-found-data">No Creators found</p>
                    )}
                  </HomeTabDetail>
                </TabPanel>

                <TabPanel>
                  <HomeTabDetail>
                    {!artworks ? (
                      <LoaderBX>
                        {" "}
                        <img src={LoaderGif} alt="" />{" "}
                      </LoaderBX>
                    ) : artworks.length > 1 ? (
                      artworks.map((artwork, key) => {
                        return (
                          <Gs.W20 key={key}>
                            <Link to={`/nftDetails/${artwork._id}`}>
                              <Gs.TenpxGutter>
                                <HallofFameBox2>
                                  <div className="HOF-inner">
                                    <div className="img-outer">
                                      {getPreview(artwork.image?.compressed, artwork.image?.format)}

                                      {/* <img
                                        src={artwork.image?.compressed}
                                        alt=""
                                      /> */}
                                    </div>
                                    <p className="title">{artwork.username}</p>
                                    <p className="small">Sold for</p>
                                    <p className="price">
                                      {artwork.totalSale} BNB
                                    </p>
                                  </div>
                                </HallofFameBox2>
                              </Gs.TenpxGutter>
                            </Link>
                          </Gs.W20>
                        );
                      })
                    ) : (
                      <p className="no-found-data">No NFTs found</p>
                    )}
                  </HomeTabDetail>
                </TabPanel>

                <TabPanel>
                  <HomeTabDetail>
                    {!collectors ? (
                      <LoaderBX>
                        {" "}
                        <img src={LoaderGif} alt="" />{" "}
                      </LoaderBX>
                    ) : collectors.length > 1 ? (
                      collectors.map((collector, key) => {
                        return (
                          <Gs.W20 key={key}>
                            <Link to={`/creator/${collector._id}`}>
                              <Gs.TenpxGutter>
                                <HallofFameBox>
                                  <div className="HOF-inner">
                                    <img
                                      src={
                                        collector.profile
                                          ? collector.profile
                                          : UserIcon
                                      }
                                      alt=""
                                    />
                                    <p className="user-name">
                                      @{collector.username}
                                    </p>
                                    <p className="small">Total Sale</p>
                                    <p className="price">
                                      {collector.totalSale} BNB
                                    </p>
                                  </div>
                                </HallofFameBox>
                              </Gs.TenpxGutter>
                            </Link>
                          </Gs.W20>
                        );
                      })
                    ) : (
                      <p className="no-found-data">
                        No{" "}
                        <FormattedMessage
                          id="collectors"
                          defaultMessage="Collectors"
                        />{" "}
                        found
                      </p>
                    )}
                  </HomeTabDetail>
                </TabPanel>

                {/* <TabPanel>
                  <HomeTabDetail>
                    <Gs.W20>
                      <Gs.TenpxGutter>
                        <HallofFameBox>
                          <div className='HOF-inner'>
                            <img src={NFT2} alt='' />
                            <p className='user-name'>@skyistheanswer</p>
                            <p className='small'>Total Sale</p>
                            <p className='price'>0.00 BNB</p>
                          </div>
                        </HallofFameBox>
                      </Gs.TenpxGutter>
                    </Gs.W20>
                  </HomeTabDetail>
                </TabPanel> */}
              </Tabs>
            </HomeTabs>
          </Gs.Container>
        </HomeNFTs>
      </LazyLoad>
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
    ${Media.xs} {
      margin: 0px 15px;
    }
  }
  .react-tabs__tab--selected {
    border: none;
    border-bottom: 3px solid #000000;
    color: #000;
  }
  .react-tabs__tab:focus {
    box-shadow: none;
    border: none;
  }
`;

const HomeTabDetail = styled(FlexDiv)`
  margin: 0px -10px;
  justify-content: flex-start;
  p.no-found-data {
    margin: 0px;
    width: 100%;
    text-align: center;
  }
`;

const HallofFameBox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  border-radius: 10px;
  text-align: center;
  min-height: 260px;
  ${Media.md} {
    margin: 0px 0px 20px;
  }
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
  ${Media.md} {
    margin: 0px 0px 20px;
  }
  .HOF-inner {
    width: 100%;
    .img-outer {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      margin: 0px 0px 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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

const HomeNFTs = styled.div`
  width: 100%;
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
      ${Media.sm} {
        font-size: 24px;
      }
    }
  }
`;
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getHallOfFrameArtist: () => dispatch(actions.getHallOfFrameArtist()),
    getHallOfFrameArtwork: () => dispatch(actions.getHallOfFrameArtwork()),
    getHallOfFrameCollector: () => dispatch(actions.getHallOfFrameCollector()),
  };
};

const mapStateToProps = (state) => {
  return {
    artists: state.fetchHallOfFrameArtist,
    artworks: state.fetchHallOfFrameArtwork,
    collectors: state.fetchHallOfFrameCollector,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDipatchToProps)(HallOfFrame)
);
