import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Gs from '../Theme/globalStyles';

import { actions } from '../actions';
import { services } from '../services';
import ipfs from '../config/ipfs';
import { compressImage } from '../helper/functions';
import SuccessPopup from '../Component/Modals/sucessPopup';
import UserImg from '../Assets/images/user-img.jpg';
import Timer from '../Component/timer';
import LoaderGif from '../Assets/images/loading.gif';
import Whitecross from '../Assets/images/white-cross.svg';

import Media from '../Theme/media-breackpoint';

class CollectionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      collection: {
        name: null,
        file: null,
        description: null,
        logo: null,
        nftId: [],
      },
      buffer: null,
      formChange: false,
      loading: false,
      updated: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    let { updated } = this.props;
    if (updated !== prevProps.updated) {
      this.setState({ loading: false, updated: true }); // stop loader
    }
  }

  componentDidMount() {
    const { id } = this.state;
    this.props.getCollectionDetails({ id: id }); // fetch collection details
  }

  formChange = async (e) => {
    const { collection } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    if (name === 'logo') {
      let file = e.target.files[0];
      value = URL.createObjectURL(file);
      this.setState({
        collection: { ...collection, [name]: value, file: file },
        formChange: true,
      });
      if (file.size > 1572864) {
        // check file size
        file = await compressImage(file); // compress image
      }
      let reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => this.convertToBuffer(reader);
    } else {
      this.setState({
        formChange: true,
        collection: { ...collection, [name]: value },
      });
    }
  };

  convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS`
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer: buffer });
  };

  categoryChecked = (e, id) => {
    e.preventDefault();
    let { collection } = this.state;
    let nftId = collection.nftId;
    nftId.push(id);
    this.setState({
      collection: { ...collection, nftId: nftId },
      formChange: true,
    });
  };

  formSubmit = async (e) => {
    e.preventDefault();
    let { file, logo, name, description, nftId } = this.state.collection;
    const { collection } = this.props;
    this.setState({ loading: true }); // start loader
    let ipfsHash = null;
    if (logo && file) {
      ipfsHash = await ipfs.add(this.state.buffer, {
        // get buffer IPFS hash
        pin: true,
        progress: (bytes) => {
          // console.log("File upload progress ", Math.floor(bytes * 100 / (file.size)))
        },
      });
    }
    let params = {
      id: collection.id,
      name: name ? name : collection.name,
      description: description ? description : collection.description,
      logo: this.state.buffer ? ipfsHash.path : collection.logo,
      nftId: nftId,
    };
    this.props.updateCollection(params); // call update collection api
  };

  render() {
    const { collection } = this.props;
    const { id, loading, updated, formChange } = this.state;
    let logo = null;
    if (this.state.collection && this.state.collection.logo) {
      logo = this.state.collection.logo;
    }
    if (collection) {
      if (!collection.isOwner) {
        return <Redirect to={`/collection-detail/${id}`} />;
      }
    }
    return (
      <Gs.MainSection>
        {updated ? (
          <SuccessPopup
            message={<FormattedMessage id='collection_success' />}
            url={`/collection-detail/${id}`}
          />
        ) : (
          ''
        )}

        {loading ? (
          <>
            <BlackWrap>
              <WhiteBX01>
                <OnbTitle01 className='v2'>
                  Please wait collection is updating
                </OnbTitle01>
                <LoaderBX>
                  <img src={LoaderGif} alt='' />
                </LoaderBX>
              </WhiteBX01>
            </BlackWrap>
          </>
        ) : (
          ''
        )}

        {collection ? (
          <CollectionContainer>
            <CreatorInfo>
              <CreatorILeft>
                <div className='CIbox'>
                  <img src={collection.ownerId?.profile} alt='' />
                </div>
                <div className='CNbox'>
                  <p className='title'>{collection.ownerId?.name}</p>
                  <p className='by'>@{collection.ownerId?.username}</p>
                </div>
              </CreatorILeft>
              <CreatorIRight>
                <div className='ed-box'>
                  <p>
                    <FormattedMessage
                      id='followers'
                      defaultMessage='Followers'
                    />
                  </p>
                  <h3>{collection.ownerId?.followersCount}</h3>
                </div>
                <div className='ed-box'>
                  <p>
                    <FormattedMessage
                      id='following'
                      defaultMessage='Following'
                    />
                  </p>
                  <h3>{collection.ownerId?.followingCount}</h3>
                </div>
                <div className='ed-box'>
                  {/* {<button className="ani-1">Follow</button>} */}
                </div>
              </CreatorIRight>
            </CreatorInfo>

            <form
              className='w100'
              onChange={(e) => this.formChange(e)}
              onSubmit={(e) => this.formSubmit(e)}
            >
              <Colleditform>
                <label>
                  <FormattedMessage
                    id='collection_name'
                    defaultMessage='Collection Name'
                  />
                </label>
                <input
                  type='text'
                  name='name'
                  placeholder='Collection Name Here'
                  required
                  defaultValue={collection.name}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
              </Colleditform>

              <Colleditform>
                <label>
                  <FormattedMessage
                    id='about_collection'
                    defaultMessage='About Collection'
                  />
                </label>
                <textarea
                  type='textarea'
                  required
                  name='description'
                  placeholder='Add description'
                  defaultValue={collection.description}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
              </Colleditform>

              <Colleditform>
                <label>
                  <FormattedMessage
                    id='collection_cover_image'
                    defaultMessage='Collection Cover Image'
                  />
                </label>
                <FlexDiv className='JCFS AIFS'>
                  <div className='CIbox'>
                    <img
                      src={logo ? logo : collection.logo}
                      alt=''
                      name='logo'
                    />
                  </div>
                  <div className='label-line'>
                    <p>Upload PNG, GIF, WEBP</p>
                    <p>{/* <b>Max 30 mb.</b> */}</p>
                    <FileuploadBox>
                      <label className='custom-file-upload'>
                        <input type='file' name='logo' accept="image/*" />
                        <FormattedMessage id='change' defaultMessage='Change' />
                      </label>
                      <input type='file' placeholder='Choose' accept="image/*"/>
                    </FileuploadBox>
                  </div>
                </FlexDiv>
              </Colleditform>

              <CardTitle>Artworks</CardTitle>
              <NFTfourbox className='cdetail'>
                {collection.nft.map((nft, key) => {
                  if (!this.state.collection.nftId.includes(nft.id)) {
                    return (
                      <Gs.W25V2 key={key}>
                        <Gs.TenpxGutter>
                          <div className='NFT-home-box'>
                            <NFTImgBX>
                              <img src={nft.image.compressed} alt='' />
                            </NFTImgBX>
                            <div className='NFT-home-box-inner'>
                              <h4>
                                {nft.title
                                  ? nft.title
                                  : 'Artwork name / title dolor lorem ipsum sit adipiscing'}
                              </h4>
                              <CollectionBar>
                                <p>
                                  0{' '}
                                  <span>
                                    of {nft.edition ? nft.edition : 0}
                                  </span>
                                </p>
                                {/* <p>
                                  See the collection
                                  <i className='fas fa-angle-right'></i>
                                </p> */}
                              </CollectionBar>
                              <Edition className='edition2'>
                                <div className='ed-box'>
                                  {nft.auctionEndDate ? (
                                    <>
                                      <p>
                                        <FormattedMessage
                                          id='ending_in'
                                          defaultMessage='Ending in'
                                        />
                                      </p>
                                      <h3>
                                        <Timer
                                          timeLeft={nft.auctionEndDate}
                                          onlyHours={true}
                                        />
                                      </h3>
                                    </>
                                  ) : (
                                    <button>
                                      <FormattedMessage
                                        id='buy_now'
                                        defaultMessage='Buy now'
                                      />
                                    </button>
                                  )}
                                </div>
                              </Edition>
                              <UserImgName>
                                <img
                                  src={
                                    nft.ownerId.profile
                                      ? nft.ownerId.profile
                                      : UserImg
                                  }
                                  alt=''
                                />
                                {nft.ownerId.username
                                  ? `@${nft.ownerId.username}`
                                  : nft.ownerId.name}
                              </UserImgName>
                            </div>
                            <RedCross>
                              <button type='button'>
                                <img
                                  src={Whitecross}
                                  alt=''
                                  onClick={(e) =>
                                    this.categoryChecked(e, nft.id)
                                  }
                                />
                              </button>
                            </RedCross>
                          </div>
                        </Gs.TenpxGutter>
                      </Gs.W25V2>
                    );
                  } else return ``;
                })}
              </NFTfourbox>

              <EditCollection>
                <button
                  type='submit'
                  className='ani-1'
                  disabled={!formChange ? true : false}
                >
                  <FormattedMessage
                    id='save_changes'
                    defaultMessage='Save changes'
                  />
                </button>
              </EditCollection>
            </form>
          </CollectionContainer>
        ) : (
          <LoaderBX>
            {' '}
            <img src={LoaderGif} alt='' />{' '}
          </LoaderBX>
        )}
      </Gs.MainSection>
    );
  }
  toggle = (index) => {
    let collapse = 'isOpen' + index;
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
    ${Media.xs} {
      justify-content: center;
      text-align: center;
      display: block;
    }
  }
  &.AIFS {
    align-items: flex-start;
  }
`;
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const CollectionContainer = styled(FlexDiv)`
  max-width: 845px;
  width: 100%;
  margin: 40px auto 120px;
  .w100 {
    width: 100%;
  }
  ${Media.sm} {
    margin: 40px auto 100px;
  }
`;

const CreatorInfo = styled(FlexDiv)`
  justify-content: space-between;
  background-color: #eef2f7;
  padding: 20px;
  border-radius: 20px;
  width: 100%;
  margin: 0px 15px 60px;
  ${Media.xs} {
    padding: 15px 14px;
    margin: 0px 10px 40px;
  }
`;

const CreatorILeft = styled(FlexDiv)`
  .CIbox {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    ${Media.sm} {
      width: 72px;
      height: 72px;
    }
  }
  ${Media.sm} {
    justify-content: flex-start;
  }

  .CNbox {
    margin-left: 30px;
    ${Media.sm} {
      margin-left: 10px;
    }
    .title {
      font-size: 22px;
      letter-spacing: -1.1px;
      color: #000;
      font-weight: 700;
      margin: 0px 0px 5px;
      ${Media.sm} {
        font-size: 18px;
        margin: 0px 0px 2px;
      }
    }
    .by {
      font-size: 16px;
      letter-spacing: -0.8px;
      color: #000;
      font-weight: 600;
      margin: 0px;
      ${Media.sm} {
        font-size: 12px;
      }
    }
  }
`;

const CreatorIRight = styled(FlexDiv)`
  justify-content: space-between;
  ${Media.sm} {
    justify-content: flex-start;
    margin-left: 82px;
  }
  .ed-box {
    p {
      color: rgb(0 0 0 /30%);
      font-size: 16px;
      letter-spacing: -0.8px;
      font-weight: 600;
      margin: 0px 30px 3px 0px;
      ${Media.sm} {
        margin: 0px 20px 3px 0px;
        font-size: 13px;
      }
      ${Media.xs} {
        margin: 0px 10px 3px 0px;
      }
    }
    h3 {
      color: #000;
      font-size: 22px;
      letter-spacing: -0.98px;
      font-weight: 700;
      margin: 0px;
      ${Media.sm} {
        font-size: 20px;
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
      ${Media.sm} {
        padding: 9px 15px;
      }
    }
  }
`;

const NFTfourbox = styled(FlexDiv)`
  width: 100%;
  justify-content: flex-start;
  img.main {
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .NFT-home-box {
    border-radius: 10px;
    border: 1px solid #dddddd;
    position: relative;
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
        min-height: 44px;
      }
    }
  }
`;
const RedCross = styled(FlexDiv)`
  position: absolute;
  top: -10px;
  right: -10px;
  button {
    background-color: #ff2a44;
    border-radius: 15px;
    width: 34px;
    height: 34px;
    line-height: 43px;
  }
`;

const NFTImgBX = styled(FlexDiv)`
  width: 100%;
  height: 253px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

const Edition = styled(FlexDiv)`
  justify-content: flex-start;
  background-color: #eef2f7;
  border-radius: 10px;
  padding: 10px 15px;
  margin: 0px 0px 20px;
  .ed-box {
    margin-right: 20px;
    p {
      color: #8e9194;
      font-size: 10px;
      letter-spacing: -0.6px;
      font-weight: 600;
      margin: 0px 0px 5px;
    }
    h3 {
      color: #000;
      font-size: 16px;
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

Gs.W25V2 = styled(Gs.W25V2)`
  ${NFTfourbox}.cdetail & {
    width: 33.33%;
    ${Media.sm} {
      width: 50%;
    }
    ${Media.xs} {
      width: 295px;
    }
  }
`;

const EditCollection = styled.div`
  margin: 65px auto 0px;
  text-align: center;
  button {
    background-color: #000;
    border: 1px solid #000;
    color: #fff;
    padding: 13px 53px;
    border-radius: 15px;
    font-size: 14px;
    letter-spacing: -0.5px;
    font-weight: 600;
    :hover {
      box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 20%);
    }
    &.bordered {
      background-color: transparent;
      border: 1px solid #000;
      color: #000;
    }
  }
`;

const CardTitle = styled.div`
  width: 100%;
  color: #8e9194;
  font-size: 16px;
  letter-spacing: -0.8px;
  font-weight: 600;
  text-align: left;
  margin: 0px 0px 6px 10px;
`;

const Colleditform = styled.div`
  width: 100%;
  margin: 0px 15px 30px;
  max-width: -webkit-fill-available;
  label {
    display: block;
    color: #8e9194;
    font-size: 16px;
    letter-spacing: -0.8px;
    font-weight: 600;
    margin: 0px 0px 6px 0px;
  }
  input {
    width: 100%;
    border: 1px solid #dddddd;
    height: 54px;
    border-radius: 10px;
    padding: 0px 15px;
    font-size: 24px;
    color: #000000;
    letter-spacing: -1.07px;
    font-weight: 600;
  }
  textarea {
    width: 100%;
    border: 1px solid #dddddd;
    height: 170px;
    border-radius: 10px;
    padding: 13px 15px;
    font-size: 16px;
    line-height: 24px;
    color: #000000;
    letter-spacing: -0.8px;
    resize: none;
  }
  .CIbox {
    width: 295px;
    height: 295px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    ${Media.xs} {
      margin: 0 auto;
    }
  }
  .label-line {
    margin-left: 30px;
    ${Media.xs} {
      margin: 10px 0px 0px 0px;
    }
    p {
      font-size: 14px;
      color: #8e9194;
      letter-spacing: -0.7px;
      font-weight: 300;
      margin: 0px 0px 15px;
      :first-child {
        margin: 0px;
      }
    }
  }
`;

const FileuploadBox = styled.div`
  margin: 0px 0px 30px;
  input {
    display: none;
  }
  .custom-file-upload {
    border: 1px solid #000000;
    border-radius: 15px;
    font-size: 14px;
    color: #000;
    letter-spacing: -0.5px;
    padding: 13px 28px;
    width: max-content;
    cursor: pointer;
    :hover {
      background-color: #000;
      color: #fff;
    }
    ${Media.xs} {
      margin: 0 auto;
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

  &.w100 {
    width: 100%;
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getCollectionDetails: (params) =>
      dispatch(actions.getCollectionDetails(params)),
    updateCollection: (params) => dispatch(actions.updateCollection(params)),
  };
};
const mapStateToProps = (state) => {
  return {
    collection: state.fetchCollectionDetails,
    updated: state.updateCollection,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(CollectionEdit);
