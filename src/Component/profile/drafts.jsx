import loadable from '@loadable/component'
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import HeartIcon from '../../Assets/images/heart-icon.svg';
import StarIcon from '../../Assets/images/star-icon.svg';
import RoundIcon from '../../Assets/images/round-icon.svg';
import LoaderGif from '../../Assets/images/loading.gif';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../actions';

const NFTCard = loadable(() => import('../Cards/nftCard'))

function Drafts(props) {
  const { userDraftNFT } = props;
  useEffect(() => {
    if (!userDraftNFT) props.getUserDraftNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDraftNFT]);
  // console.log('user status ? ', props)
  return (
    <HomeNFTs>
      <NFTfourbox>
        {userDraftNFT ? (
          userDraftNFT.map((nft) => (
            <NFTCard
              edit={true}
              nftSold={nft.nftSold}
              nftId={nft.id}
              name={nft.ownerId.name}
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
          // this.renderTabPanel(NFTs)
          <LoaderBX>
            <img src={LoaderGif} alt='' />
          </LoaderBX>
        )}
      </NFTfourbox>

      {userDraftNFT?.length === 0 ? (
        <CEmpty>
          <h2 className="Bec"> <FormattedMessage id="draft_empty" defaultMessage="Draft is empty" /> </h2>
          {props.status ? (
            <button
              className='ani-1'
              onClick={() => props.history.push('/user/nftminting')}
            >
              <FormattedMessage id='create' defaultMessage='Create' />
            </button>
          ) : (
            ``
          )}
        </CEmpty>
      ) : (
        ``
      )}
    </HomeNFTs>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const NFTfourbox = styled(FlexDiv)`  
    flex-wrap:wrap; margin:0px -10px 50px; justify-content: flex-start;
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
  margin-top: 40px;
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
        content: '';
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
        content: '';
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
const CEmpty = styled.div`
  text-align: center;
  margin-bottom: 120px;
  h2 {
    font-size: 22px;
    letter-spacing: -0.55px;
    color: #000;
    margin: 0px 0px 10px;
    font-weight: 600;
  }
  p {
    font-size: 16px;
    letter-spacing: -0.8px;
    color: #000;
    margin: 0px 0px 22px;
  }
  button {
    font-size: 14px;
    letter-spacing: -0.5px;
    color: #000;
    padding: 13px 44px;
    border-radius: 15px;
    border: 1px solid #000;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getUserDraftNFT: () => dispatch(actions.getUserDraftNFT()),
  };
};
const mapStateToProps = (state) => {
  return {
    userDraftNFT: state.fetchUserDraftNFT,
  };
};

export default withRouter(connect(mapStateToProps, mapDipatchToProps)(Drafts));
