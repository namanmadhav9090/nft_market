import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";

import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { withRouter } from "react-router";

import Gs from "../Theme/globalStyles";
import LoaderGif from "../Assets/images/loading.gif";
import NFTCard from "../Component/Cards/nftCard";
import { actions } from "../actions";
import Media from '../Theme/media-breackpoint';
import { Link, useParams } from "react-router-dom";

class CollectionDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      loading: false,
    };
  }

  componentDidMount() {
    const { id } = this.state;
    this.props.getCollectionDetails({ id: id }) // fetch collection details
    this.props.getIsFollow(id); // check user is following
  }

  componentDidUpdate(prevProps, prevState) {
    const { status } = this.props;
    const { id } = this.state;
    if (status !== prevProps.status) {
      this.props.getCollectionDetails({ id: id }) // fetch collection details
      this.setState({ loading: false }); // stop loader
    }
  }

  followToggler = (id) => {
    this.setState({ loading: true }); // start loader
    this.props.followToggler(id); // follow toggle api called
  }

  render() {
    const { collection, status, web3Data, authData } = this.props;
    const { loading } = this.state;
    return (
      <Gs.MainSection>
        <CollectionContainer>

          {loading ? (
            <>
              <BlackWrap>
                <WhiteBX01>
                  <LoaderBX>
                    <img src={LoaderGif} alt="" />
                  </LoaderBX>
                </WhiteBX01>
              </BlackWrap>
            </>
          ) : ('')}
          {collection ?
            <>
              <CreatorInfo>
                <CreatorILeft>
                  <div className="CIbox">
                    <Link to={`/creator/${collection?.ownerId.id}`}>
                      <img src={collection.ownerId?.profile} alt="" />
                    </Link>
                  </div>
                  <div className="CNbox">
                    <p className="title"><Link to={`/creator/${collection?.ownerId.id}`}>{collection.ownerId?.name}</Link></p>
                    <p className="by">@{collection.ownerId?.username}</p>
                  </div>
                </CreatorILeft>
                <CreatorIRight>
                  <div className='ed-box'>
                    <p>
                      <FormattedMessage id="followers" defaultMessage="Followers" />
                    </p>
                    <h3>{collection.ownerId?.followersCount}</h3>
                  </div>
                  <div className='ed-box'>
                    <p>
                      <FormattedMessage id="following" defaultMessage="Following" />
                    </p>
                    <h3>{collection.ownerId?.followingCount}</h3>
                  </div>
                  <div className='ed-box'>
                    {authData ?
                      web3Data.isLoggedIn && (authData.data.id !== collection.ownerId.id) ? <button className="ani-1" onClick={() => this.followToggler(collection.ownerId.id)}>{status.isFollowed ?
                        <FormattedMessage id="unfollow" defaultMessage="Unfollow" /> :
                        <FormattedMessage id="follow" defaultMessage="Follow" />}</button> : ('')
                      : ''}
                  </div>
                </CreatorIRight>
              </CreatorInfo>

              <CollectionDesc>
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
              </CollectionDesc>

              <NFTfourbox className="cdetail">
                {collection.nft ? collection.nft.map((nft, key) => (
                  nft.isActive &&
                  <NFTCard
                    key={key}
                    nftSold={nft.nftSold}
                    name={nft.ownerId.name}
                    nftId={nft.id}
                    collectionId={nft.collectionId?.id}
                    auctionEndDate={nft.auctionEndDate}
                    nftImg={nft.image.compressed}
                    title={nft.title}
                    edition={nft.edition}
                    price={nft.price}
                    auctionTime={nft.auctionTime}
                    userImg={nft.ownerId.profile}
                    username={nft.ownerId.username}
                    format={nft.image.format}
                  />
                )) : (<LoaderBX> <img src={LoaderGif} alt="" /> </LoaderBX>)}
              </NFTfourbox>
              {/* <EditCollection>
                <button className="ani-1 disabled"
                >Edit Collection</button>
              </EditCollection> */}
              {collection.isOwner ? (
                <EditCollection>
                  <button className="ani-1 disabled"
                    onClick={() => this.props.history.push(`/user/collection-edit/${collection.id}`)}
                  >
                    <FormattedMessage id="edit_collection" defaultMessage="Edit Collection" />
                  </button>
                </EditCollection>
              ) : ("")}
            </>
            : <LoaderBX> <img src={LoaderGif} alt="" /> </LoaderBX>}
        </CollectionContainer>
      </Gs.MainSection>
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

const CollectionContainer = styled(FlexDiv)`
  max-width:845px;
  width:100%;
  margin:40px auto 120px;
  ${Media.sm}{
    max-width:100%;
    margin:40px auto 60px;
  }
`;

const CreatorInfo = styled(FlexDiv)`
  justify-content:space-between;
  background-color:#eef2f7;
  padding:20px;
  border-radius:20px;
  width:100%;
  margin:0px 15px 60px;
  ${Media.xs}{
    padding:15px 14px;
    margin:0px 10px 40px;
  }
`;

const CreatorILeft = styled(FlexDiv)`
  .CIbox
  {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    ${Media.sm}{
      width: 72px;
      height: 72px;
    }
  }
  ${Media.sm}{
    justify-content:flex-start;
  }
  .CNbox
  {
    margin-left:30px;
    ${Media.sm}{
      margin-left:10px;
    }
    .title{
      font-size:22px;
      letter-spacing:-1.1px;
      color:#000;
      font-weight:700;
      margin:0px 0px 5px;
      text-transform:capitalize;
      a{
        color:#000;
      }
      ${Media.sm}{
       font-size:18px;
       margin:0px 0px 2px;
      }
    }
    .by{
      font-size:16px;
      letter-spacing:-0.8px;
      color:#000;
      font-weight:600;
      margin:0px;
      ${Media.sm}{
        font-size:12px;
      }
    }
  }
`;

const CreatorIRight = styled(FlexDiv)`
  justify-content: space-between;
  ${Media.sm}{
    justify-content: flex-start;
    margin-left:82px;
  }
  .ed-box {
    p {
      color: rgb(0 0 0 /30%);
      font-size: 16px;
      letter-spacing: -0.8px;
      font-weight: 600;
      margin: 0px 30px 3px 0px;
      ${Media.sm}{
        margin: 0px 20px 3px 0px;
        font-size:13px;
      }
      ${Media.xs}{
        margin: 0px 10px 3px 0px;
      }
    }
    h3 {
      color: #000;
      font-size: 22px;
      letter-spacing: -0.98px;
      font-weight: 700;
      margin: 0px;
      ${Media.sm}{
        font-size:20px;
      }
    }
    button {
      font-size: 14px;
      color: #000;
      letter-spacing: -0.5px;
      font-weight: 600;
      line-height: normal;
      padding: 9px 23px;
      border-radius: 15px;
      border: 1px solid #000000;
      :hover {
        background-color: #000;
        color: #fff;
      }
      ${Media.sm}{
        padding: 9px 15px;
      }
    }
  }
`;

const CollectionDesc = styled.div`
  margin:0px 15px; width:100%;
  h3{
    color: #000;
    font-size: 24px;
    letter-spacing: -1.07px;
    font-weight: 700;
    margin: 0px 0px 10px;
    text-transform:capitalize;
    line-height:normal;
  }
  p{
    color: #000;
    font-size: 16px;
    line-height:24px;
    letter-spacing: -0.8px;
    margin:0px 0px 30px;
    white-space: pre-wrap;
  }
`;

const NFTfourbox = styled(FlexDiv)`
  width:100%;
  justify-content:flex-start;
  align-items:flex-start;
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
    }
  }
`;

Gs.W25V2 = styled(Gs.W25V2)`
  ${NFTfourbox}.cdetail & {
    width: 33.33%;
    ${Media.sm}{
      width:50%;
    }
    ${Media.xs}{
      width:295px;
      margin:0px auto 20px;
    }
  }
`;

const EditCollection = styled.div`
  margin:65px auto 0px;
  button{background-color:transparent; border:1px solid #000; color:#000; padding:13px 53px; border-radius:15px; font-size:14px; letter-spacing:-0.5px; font-weight:600;
    :hover{ box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 20%);}
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
  ${Media.xs}{
    padding:50px 25px;
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getCollectionDetails: (params) => dispatch(actions.getCollectionDetails(params)),
    getIsFollow: (id) => dispatch(actions.getIsFollow(id)),
    followToggler: (id) => dispatch(actions.followToggler(id)),
  }
}
const mapStateToProps = (state) => {
  return {
    collection: state.fetchCollectionDetails,
    web3Data: state.fetchWeb3Data,
    status: state.fetchIsFollow,
    authData: state.fetchAuthData,
  }
}

export default withRouter(connect(mapStateToProps, mapDipatchToProps)(CollectionDetail));