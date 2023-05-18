import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { withRouter } from 'react-router';
import LazyLoad from "react-lazyload";
import Media from '../../Theme/media-breackpoint';

import Redheart from '../../Assets/images/Redheart.svg';
import Lock from '../../Assets/images/icon-set-lock.svg';
import UserImg from '../../Assets/images/user-img.jpg';
import LoaderGif from '../../Assets/images/loading.gif';
import RoundIcon from '../../Assets/images/round-icon.svg';
import redheartBorder from '../../Assets/images/redheartBorder.svg';
import AudioCover from '../../Assets/images/audio-square.jpg';
import VideoCover from '../../Assets/images/video-square.jpg';
import Gs from '../../Theme/globalStyles';

import { actions } from '../../actions';
import Timer from '../timer';
import { getFileType } from '../../helper/functions';
import NFTCard from '../../Component/Cards/nftCard';
import { Scrollbars } from 'react-custom-scrollbars';

function CustomScrollbars(props) {
  return (
    <Scrollbars
      renderTrackVertical={(props) => (
        <div {...props} className='track-vertical' />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className='thumb-vertical' />
      )}
      renderView={(props) => <div {...props} className='view' />}
      autoHide
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}

class TopNFT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like_fetched: false,
      loding: false,
      imageClass: '',
      ext: null,
    };
  }

  componentDidMount() {
    const { nfts } = this.props;
    if (!nfts) {
      this.props.getTopNFT(); // fetch top nft list
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { likesCount, nfts } = this.props;
    if (likesCount !== prevProps.likesCount) {
      this.setState({ like_fetched: true, loading: false });
    }
    if (nfts !== prevProps.nfts) {
      if (nfts[0]) {
        let ext;
        if (!nfts[0].nftId.image.format) {
          ext = await getFileType(nfts[0].nftId.image.compressed)
        } else {
          ext = nfts[0].nftId.image.format
        }
        this.setState({ ext: ext })
      }
    }
  }

  renderedFirstElement = (nft, likesCount, isLiked) => {
    let { loading, ext } = this.state;
    if (!ext) {
      ext = nft.nftId.image.format
    }
    return (
      <>
        <div className='w60'>
          <Link to={`/nftDetails/${nft.nftId.id}`}>
            <NFTfbleft>
              {ext === `image` && (
                <motion.img
                  className={this.state.imageClass}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  key={nft.nftId.image.compressed}
                  src={nft.nftId.image.compressed}
                  exit={{ opacity: 0 }}
                  onLoad={(image) => {
                    if (image.target.width > image.target.height) {
                      this.setState({ imageClass: 'horizontal-tnimg' });
                    } else if (image.target.height > image.target.width) {
                      this.setState({ imageClass: 'vertical-tnimg' });
                    }
                  }}
                />
              )}
              {ext === 'audio' && (
                <motion.img
                  className={this.state.imageClass}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  key={AudioCover}
                  src={AudioCover}
                  exit={{ opacity: 0 }}
                  onLoad={(image) => {
                    if (image.target.width > image.target.height) {
                      this.setState({ imageClass: 'horizontal-tnimg' });
                    } else if (image.target.height > image.target.width) {
                      this.setState({ imageClass: 'vertical-tnimg' });
                    }
                  }}
                />
              )}
              {ext === 'video' && (
                <motion.img
                  className={this.state.imageClass}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  key={VideoCover}
                  src={VideoCover}
                  exit={{ opacity: 0 }}
                  onLoad={(image) => {
                    if (image.target.width > image.target.height) {
                      this.setState({ imageClass: 'horizontal-tnimg' });
                    } else if (image.target.height > image.target.width) {
                      this.setState({ imageClass: 'vertical-tnimg' });
                    }
                  }}
                />
              )}
            </NFTfbleft>
          </Link>
        </div>
        <div className='w40'>
          <NFTtopbarright>
            {nft.nftId.unlockContent && (
              <NFTLock>
                <img src={Lock} alt='' />
              </NFTLock>
            )}
            <NFTLike
              className={
                loading || !this.props.web3Data?.isLoggedIn ? `disabled` : ``
              }
              onClick={() => {
                this.props.likeToggler(nft.nftId.id);
                this.setState({ loading: true });
              }}
            >
              <img
                src={isLiked.isFollowed ? Redheart : redheartBorder}
                alt=''
              />
              <p>{likesCount.count}</p>
            </NFTLike>
          </NFTtopbarright>
          <NFTfbright>
            <h3>{nft.nftId.title}</h3>
            <p>
              <CustomScrollbars
                autoHide
                autoHideTimeout={1000}
                style={{
                  width: '100%',
                  height: '59px',
                  position: 'relative',
                }}
              >
                {nft.nftId.description}
              </CustomScrollbars>
            </p>
            {nft.nftId.collectionId?.id ? (
              <Link to={`collection-detail/${nft.nftId.collectionId.id}`}>
                  <FormattedMessage
                    id="see_the_collections"
                    defaultMessage="See the collection"
                  />
                 <i className='fas fa-angle-right'></i>
              </Link>
            ) : (
              ''
            )}
            <Edition>
              <div className='ed-box'>
                <p>
                  <FormattedMessage id='edition' defaultMessage='EDITION' />
                </p>
                <h3>
                  {nft.nftId.edition}
                  {/* <span>of 2500</span> */}
                </h3>
              </div>
              <div className='ed-box'>
                <p>
                  {nft.nftId.auctionEndDate &&
                    nft.nftId.auctionEndDate > new Date().getTime() / 1000 ? (
                    <FormattedMessage
                      id='current_bid'
                      defaultMessage='Current bid'
                    />
                  ) : (
                    <>
                      <FormattedMessage id='price' defaultMessage='Price' />
                    </>
                  )}
                </p>
                <h3>{nft.nftId.price} BNB</h3>
              </div>
              <div className='ed-box'>
                {nft.nftId.auctionEndDate &&
                  nft.nftId.auctionEndDate > new Date().getTime() / 1000 ? (
                  <>
                    <p>
                      <FormattedMessage
                        id='ending_in'
                        defaultMessage='Ending in'
                      />
                    </p>
                    <h3>
                      <Timer
                        timeLeft={nft.nftId.auctionEndDate}
                        onlyHours={true}
                      />
                    </h3>
                  </>
                ) : nft.nftId.nftSold === nft.nftId.edition ? (
                  <button className='disabled' disabled>
                    <FormattedMessage id='sold' defaultMessage='Sold' />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      this.props.history.push(`/nftDetails/${nft.nftId.id}`)
                    }
                  >
                    <FormattedMessage id='buy_now' defaultMessage='Buy now' />
                  </button>
                )}
              </div>
            </Edition>
            <UserImgName>
              <img
                src={
                  nft.nftId.ownerId.profile
                    ? nft.nftId.ownerId.profile
                    : UserImg
                }
                alt=''
              />
              {nft.nftId.ownerId.username
                ? `@${nft.nftId.ownerId.username}`
                : nft.nftId.ownerId.name}
            </UserImgName>
          </NFTfbright>
        </div>
      </>
    );
  };

  render() {
    const { nfts, likesCount, isLiked } = this.props;
    const { like_fetched } = this.state;
    if (nfts && !like_fetched && nfts[0]) {
      this.props.getLikesCount(nfts[0].nftId.id); // fetch the likes count for the first NFT
    }
    return (
      <LazyLoad>
        <HomeNFTs>
          <Gs.Container>
            <div className='home-title'>
              <h3>
                <FormattedMessage
                  id='top_nfts'
                  defaultMessage='Top Creations'
                />
              </h3>
            </div>

            {!nfts ? (
              <LoaderBX>
                {' '}
                <img src={LoaderGif} alt='' />{' '}
              </LoaderBX>
            ) : (
              <>
                <NFTfirstbox>
                  {nfts[0]
                    ? this.renderedFirstElement(nfts[0], likesCount, isLiked)
                    : ''}
                </NFTfirstbox>

                <NFTfourbox className='homepage'>
                  {nfts.slice(1).map((nft, key) => {
                    return (
                      <NFTCard
                        key={key}
                        nftSold={nft.nftId.nftSold}
                        name={nft.nftId.ownerId.name}
                        nftId={nft.nftId.id}
                        collectionId={nft.nftId.collectionId?.id}
                        auctionEndDate={nft.nftId.auctionEndDate}
                        nftImg={nft.nftId.image.compressed}
                        title={nft.nftId.title}
                        edition={nft.nftId.edition}
                        price={nft.nftId.price}
                        auctionTime={nft.nftId.auctionTime}
                        userImg={nft.nftId.ownerId.profile}
                        username={nft.nftId.ownerId.username}
                        format={nft.nftId.image.format}
                      />
                    );
                  })}
                </NFTfourbox>

                {nfts.length > 4 ? (
                  <ViewallButton>
                    <button
                      onClick={() => this.props.history.push('/marketplace')}
                    >
                      <FormattedMessage
                        id='view_all_nfts'
                        defaultMessage='View all NFTs'
                      />
                    </button>
                  </ViewallButton>
                ) : (
                  ``
                )}
              </>
            )}
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

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
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
        content: '';
        position: absolute;
        left: 0px;
        top: 12px;
        width: 10px;
        height: 10px;
        background: url(${RoundIcon}) no-repeat;
      }
      ${Media.sm} {
        font-size: 24px;
      }
    }
  }
  ${Media.md} {
    margin-top: 60px;
  }
`;

const NFTfirstbox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  position: relative;
  border-radius: 10px;
  margin-bottom: 30px;
  .w60 {
    width: 60%;
    ${Media.md} {
      width: 100%;
    }
  }
  .w40 {
    width: 40%;
    ${Media.md} {
      width: 100%;
      position: relative;
    }
  }
  ${Media.md} {
    position: initial;
  }
  ${Media.xs} {
    width: 295px;
    margin: 0px auto 30px;
  }
`;
const NFTfbleft = styled(FlexDiv)`
  background-color: #eef2f7;
  padding: 80px 60px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  img {
    box-shadow: 20px 20px 40px 1px rgb(0 0 0 /30%);
    max-width: 300px;
    ${Media.sm} {
      box-shadow: 0px 5px 10px 1px rgb(0 0 0 /30%);
    }
    ${Media.xs} {
      max-width: -webkit-fill-available;
    }
    &.horizontal-tnimg {
      max-width: 500px;
      ${Media.xs} {
        max-width: -webkit-fill-available;
      }
    }
    &.vertical-tnimg {
      max-width: 288px;
      ${Media.xs} {
        max-width: -webkit-fill-available;
      }
    }
  }
  ${Media.md} {
    border-bottom-left-radius: 0px;
    border-top-right-radius: 10px;
  }
  ${Media.sm} {
    padding: 40px 30px;
  }
  ${Media.xs} {
    padding: 30px 20px;
  }
`;
const NFTfbright = styled.div`
  padding: 20px 50px;
  ${Media.md} {
    position: relative;
    padding: 20px 15px;
  }
  h3 {
    color: #000000;
    font-size: 22px;
    letter-spacing: -0.83px;
    margin: 40px 0px 10px;
    line-height: normal;
    ${Media.xs} {
      margin: 40px 0px 10px;
    }
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
    ${Media.md} {
      margin: 0px 0px 20px;
    }
  }
`;
const NFTtopbarright = styled(FlexDiv)`
  position: absolute;
  right: 20px;
  top: 20px;
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

const Edition = styled(FlexDiv)`
  justify-content: space-between;
  background-color: #eef2f7;
  border-radius: 10px;
  padding: 16px 20px;
  margin: 0px 0px 40px;
  ${Media.md} {
    margin: 0px 0px 20px;
  }
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
      ${Media.sm} {
        font-size: 16px;
      }
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
  justify-content: flex-start;
  align-items: flex-start;
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
      :hover {
        box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
      }
      padding: 20px 15px;
      border-radius: 10px;
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
        min-height: 44px;
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
  ${Media.md} {
    margin-bottom: 100px;
  }
  ${Media.sm} {
    margin-bottom: 60px;
  }
`;

Gs.W25V2 = styled(Gs.W25V2)`
  ${NFTfourbox}.homepage & {
    ${Media.md} {
      width: 50%;
    }
    ${Media.xs} {
      width: 295px;
    }
  }
`;

Gs.TenpxGutter = styled(Gs.TenpxGutter)`
  ${NFTfourbox}.homepage & {
    ${Media.xs} {
      margin: 0px;
    }
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    likeToggler: (id) => dispatch(actions.likeToggler(id)),
    getTopNFT: () => dispatch(actions.getTopNFT()),
    getLikesCount: (id) => dispatch(actions.getLikesCount(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    nfts: state.fetchTopNFT,
    isLiked: state.fetchIsLiked,
    likesCount: state.fetchLikesCount,
    likeToggled: state.fetchLikeToggled,
    web3Data: state.fetchWeb3Data,
  };
};

export default withRouter(connect(mapStateToProps, mapDipatchToProps)(TopNFT));
