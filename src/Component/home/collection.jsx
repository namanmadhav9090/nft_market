import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from "react-intl";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from "react-router";
import LazyLoad from "react-lazyload";
import { motion } from "framer-motion";

import Gs from '../../Theme/globalStyles';
import HeartIcon from '../../Assets/images/heart-icon.svg';
import LoaderGif from "../../Assets/images/loading.gif";

import { actions } from '../../actions';
import Media from "../../Theme/media-breackpoint";


class Collections extends Component {

  componentDidMount() {
    const { collections } = this.props
    if (!collections) {
      this.props.getCollections() // fetch popular collection list
    }
  }

  renderedCollection = (collection) => {
    return (
      <Gs.W25 key={collection.collectionId.id}>
        <Gs.TenpxGutter>
          <Link className="home-collection-box" to={`/collection-detail/${collection.collectionId.id}`}>
            <div className="img-outer">
              <motion.img
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                key={collection.collectionId.logo}
                src={collection.collectionId.logo}
                exit={{ opacity: 0 }}
              />
            </div>
            <div className="collbox-desc">
              <p className="coll-title">{collection.collectionId.name}</p>
              <p className="creator-name">
                by {collection.collectionId.ownerId.username}
              </p>
            </div>
          </Link>
        </Gs.TenpxGutter>
      </Gs.W25>
    )
  }

  render() {
    const { collections } = this.props
    return (
      <LazyLoad>
        <HomeNFTs>
          <Gs.Container>
            <div className='heart-title'>
              <h3><FormattedMessage id="collections" defaultMessage="Collections" /></h3>
            </div>
            <CollectionSection>
              {!collections ? (<LoaderBX> <img src={LoaderGif} alt="" /> </LoaderBX>) :
                collections.map((collection) => this.renderedCollection(collection))}
            </CollectionSection>
            <ViewallButton>
              <button
                onClick={() => this.props.history.push("/collections")}
              ><FormattedMessage id="view_all_collections" defaultMessage="Collections" /></button>
            </ViewallButton>
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

const HomeNFTs = styled.div`
  width: 100%;
  margin-top: 120px;
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
        content: '';
        position: absolute;
        left: 0px;
        top: 12px;
        width: 12px;
        height: 11px;
        background: url(${HeartIcon}) no-repeat;
      }
      ${Media.sm} {
        font-size: 24px;
      }
    }
  }
  ${Media.md}{
    margin-top: 80px;
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

const CollectionSection = styled(FlexDiv)`
  justify-content:flex-start;
  margin: 0px -10px 50px;
  .home-collection-box{
    position:relative;
    display:block;
  }
  .img-outer
  {
    width:100%;
    height:255px;
    border-radius: 10px;
    overflow:hidden;
    ${Media.md}{
      height:180px;
    }
    ${Media.xs}{
      height:135px;
    }
    img {
      width:100%;
      height:100%;
      object-fit:cover;
      border: 1px solid #dddddd;
    }
  }
  .collbox-desc
  {
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    background-color:rgb(0 0 0 / 70%);
    border-radius:10px;
    padding:20px 10px 0px 20px;
    opacity:0;
    ${Media.xs}{
      padding:10px 10px 0px 10px;
    }
    :hover
    {
      opacity:1;
    }
    .coll-title
    {
      font-size:20px;
      color:#fff;
      letter-spacing:-0.75px;
      font-weight:700;
      margin:0px 0px 2px;
      ${Media.xs}{
        font-size:14px;
      }
    }
    .creator-name
    {
      font-size:16px;
      color:rgb(255 255 255 / 50%);
      letter-spacing:-0.8px;
      font-weight:600;
      margin:0px;
      ${Media.xs}{
        font-size:12px;
      }
    }
  }
  ${Media.sm}{
    flex-wrap:nowrap;
    overflow-x:auto;
    justify-content:flex-start;
    margin:0px 0px 50px;
  }
  
`;

Gs.W25 = styled(Gs.W25)`
  ${CollectionSection} & {
    ${Media.sm}{
      width: 180px;
      min-width:180px;
    }
    ${Media.xs}{
      min-width:145px;
      width:145px;
    }
  }
`;

Gs.TenpxGutter = styled(Gs.TenpxGutter)`
  ${CollectionSection} & {
    margin:0px 10px 20px;
    ${Media.xs}{
     margin:0px 5px;
    }
  }
`;

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;


const mapDipatchToProps = (dispatch) => {
  return {
    getCollections: () => dispatch(actions.getTopCollection()),
  }
}

const mapStateToProps = (state) => {
  return {
    collections: state.fetchTopCollection,
  }
}

export default withRouter(connect(mapStateToProps, mapDipatchToProps)(Collections));
