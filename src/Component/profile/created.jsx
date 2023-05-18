import loadable from '@loadable/component'
import styled from "styled-components";
import { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import { useParams } from 'react-router-dom';
import { connect } from "react-redux";

import HeartIcon from "../../Assets/images/heart-icon.svg";
import StarIcon from "../../Assets/images/star-icon.svg";
import RoundIcon from "../../Assets/images/round-icon.svg";
import LoaderGif from "../../Assets/images/loading.gif";

import { actions } from "../../actions";
import Media from '../../Theme/media-breackpoint';
import { Scrollbars } from "react-custom-scrollbars";

function CustomScrollbars(props) {
  return (
    <Scrollbars
      renderTrackHorizontal={(props) => (
        <div {...props} className="track-horizontal" />
      )}
      renderThumbHorizontal={(props) => (
        <div {...props} className="thumb-horizontal" />
      )}
      renderView={(props) => <div {...props} className="view" />}
      autoHide
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}
const NFTCard = loadable(() => import('../Cards/nftCard'))


function Created(props) {

  let { NFTs } = props;
  const params = useParams();
  const [tabPanel, setTaPanel] = useState("ALL");

  useEffect(() => {
    if (!NFTs) props.getNFTs(params.id ? params.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NFTs]);

  useEffect(() => {
    if (tabPanel !== 'ALL') props.getNFTs(params.id ? params.id : null, tabPanel);
    else props.getNFTs(params.id ? params.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPanel]);

  useEffect(() => {
    return function cleanup() {
      props.clearNFTs(); // clear the NFT data
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <FilterMBX>
        <FilterLbx>
          {/* <CustomScrollbars
            autoHide
            autoHideTimeout={1000}
            style={{ width: "100%", height: "70px", position: "relative" }}
          > */}
          <button
            className={tabPanel === "ALL" ? "active" : ""}
            id="all"
            onClick={() => {
              setTaPanel("ALL");
            }}
          >
            <FormattedMessage id="all" defaultMessage="All" />
          </button>

          <button
            className={tabPanel === "SOLD" ? "active" : ""}
            id="sold"
            onClick={() => {
              setTaPanel("SOLD");
            }}
          >
            <FormattedMessage id="sold" defaultMessage="Sold" />
          </button>

          <button
            className={tabPanel === "AUCTION" ? "active" : ""}
            id="liveauction"
            onClick={() => {
              setTaPanel("AUCTION");
            }}
          >
            <FormattedMessage id="live_acution" defaultMessage="Live auction" />
          </button>

          <button
            className={tabPanel === "BUY" ? "active" : ""}
            id="buynow"
            onClick={() => {
              setTaPanel("BUY");
            }}
          >
            <FormattedMessage id="buy_now" defaultMessage="Buy now" />
          </button>
          {/* </CustomScrollbars> */}
        </FilterLbx>
      </FilterMBX>
      <HomeNFTs>

        <NFTfourbox>
          {NFTs ? (
            NFTs.map((nft, key) => (
              nft.isActive &&
              <NFTCard
                key={key}
                nftSold={nft.nftSold}
                name={nft.ownerId.name}
                nftId={nft.id}
                collectionId={nft.collectionId?._id}
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
            ))
          ) : (
            <LoaderBX>
              <img src={LoaderGif} alt="" />
            </LoaderBX>
          )}
        </NFTfourbox>

        {NFTs?.length === 0 && tabPanel === 'ALL' ?
          props.profile ?
            <CEmpty>
              <h2 className="Bec"><FormattedMessage id="creation_empty" defaultMessage="Creation is empty" /></h2>
              {props.status ?
                <button className="ani-1" onClick={() => props.history.push("/user/nftminting")}>
                  <FormattedMessage id="create" defaultMessage="Create" />
                </button>
                : ``}
            </CEmpty>
            : <CEmpty>
              <h2 className="Bec"><FormattedMessage id="creation_empty" defaultMessage="Creation is empty" /></h2>
            </CEmpty>
          : ``
        }

      </HomeNFTs>
    </>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const NFTfourbox = styled(FlexDiv)`  
    flex-wrap:wrap; margin:0px -10px 50px; justify-content:flex-start;
    .row{margin:0px -10px;}
    img.main{width:100%; border-top-left-radius:10px; border-top-right-radius:10px;}
        .NFT-home-box{ border-radius:10px; border:1px solid #dddddd; 
          :hover{ box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);} 
          .NFT-home-box-inner{ padding:20px 15px;
            h4{margin:0px 0px 10px; font-size:18px; color:#000000; font-weight:600; line-height:22px; letter-spacing:-0.67px;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              min-height:44px;
            }
            .edition2
            {
              justify-content:flex-start; padding:10px 15px; margin-bottom:20px;
              .ed-box{
                margin-right:20px;
                p{font-size:10px; letter-spacing:-0.5px; margin:0px;}
                h3{font-size:16px; letter-spacing:-0.71px;}
                button{font-size:10px; color:#000; letter-spacing:-0.36px; font-weight:600; line-height:normal; padding:10px 17px; border-radius:13px; border:1px solid #000000;
                  :hover{background-color:#d121d6; color:#fff; border-color:#d121d6;}
                }
              }
            }
            .JCSB{justify-content:space-between;
              .ed-box{margin-right:0px;}
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

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const HomeNFTs = styled.div`
  width: 100%;
  margin-top: 20px;
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

const FilterMBX = styled(FlexDiv)`
  width: 100%;
  justify-content: space-between;
  max-width: 1080px;
  margin: 0px auto 0 auto;
  ${Media.lg}{
    max-width: 100%;
  }
`;

const FilterLbx = styled(FlexDiv)`
  width: 100%;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: initial;
  padding:0px 0px 15px;
  button {
    display: inline-block;
    padding: 10px 25px;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    border-radius: 15px;
    background-color: #eef2f7;
    margin-right: 8px;
    ${Media.sm}{
      white-space: pre;
    }
    &.active {
      background-color: #00babc;
      color: #fff;
    }
    :hover {
      background-color: #00babc;
      color: #fff;
      box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
    }
  }
`;

const CEmpty = styled.div`
  text-align:center; margin-bottom:120px;
  h2{ 
    font-size:22px;
    letter-spacing:-0.55px;
    color:#000;
    margin:0px 0px 10px;
    font-weight:600;
  }
  span {
    text-transform: lowercase;
  }
  p{ 
    font-size:16px;
    letter-spacing:-0.8px;
    color:#000;
    margin:0px 0px 22px;
  }
  button{
    font-size:14px;
    letter-spacing:-0.5px;
    color:#000;
    padding:13px 44px;
    border-radius:15px;
    border:1px solid #000;
    :hover{background-color:#000; color:#fff;}
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getNFTs: (id, filter) => dispatch(actions.getUserNFT(id, filter)),
    clearNFTs: () => dispatch({ type: 'FETCHED_USER_NFT', data: null }),
  };
};
const mapStateToProps = (state) => {
  return {
    NFTs: state.fetchUserNFT,
  };
};

export default withRouter(connect(mapStateToProps, mapDipatchToProps)(Created));
