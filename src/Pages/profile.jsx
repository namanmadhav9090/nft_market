import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Gs from '../Theme/globalStyles';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router';
import dateFormat from 'dateformat';
import { motion } from 'framer-motion';

import AdBannerIMG from '../Assets/images/adbanner.jpg';
import LoaderGif from '../Assets/images/loading.gif';
import UserIcon from '../Assets/images/user-img.jpg';
import ProfielBack from '../Assets/images/profile-back.jpg';
import CopyICO from '../Assets/images/icon-copy.svg';
import PlusICO from '../Assets/images/icon-plus.svg';

import SocialICO01 from '../Assets/images/social-icon01.svg';
import SocialICO02 from '../Assets/images/social-icon02.svg';
import SocialICO03 from '../Assets/images/social-icon03.svg';
import SocialICO04 from '../Assets/images/social-icon04.svg';
import SocialICO05 from '../Assets/images/social-icon05.svg';
import SocialICO06 from '../Assets/images/social-icon06.svg';

import ipfs from '../config/ipfs';
import { actions } from '../actions';
import { Context } from '../Component/wrapper';
import { expiryTime } from '../config';
import { compressImage } from '../helper/functions';

import Created from '../Component/profile/created';
import Collected from '../Component/profile/collected';
import Collection from '../Component/profile/collection';
import Liked from '../Component/profile/liked';
import Drafts from '../Component/profile/drafts';
import Media from '../Theme/media-breackpoint';
import { Link } from 'react-router-dom';
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

class Profile extends Component {
  static contextType = Context;
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.profileInput = React.createRef();
    this.profileCoverInput = React.createRef();
    this.walletAddress = React.createRef();

    this.state = {
      profile: { file: null, url: null, buffer: null },
      cover: { file: null, url: null, buffer: null },
      profile_banner: false,
      dashboard: cookies.get('dashboard') || null,
      profileInfo: null,
    };
  }

  async componentDidMount() {
    const { dashboard, profileInfo,
      cookies
    } = this.props;
    if (!this.state.dashboard && !dashboard) {
      this.props.getDashboard(); // fetch dashboard config
    }
    else {
      const isActive = cookies
        .get('dashboard')
        .filter((dash) => dash.name === 'Profile Info')
        .map((data) => data.isActive)[0];
      this.setState({ profile_banner: isActive });
    }
    if (!this.state.profileInfo && !profileInfo) {
      this.props.getProfileInfo(); // fetch profile info list
    }
    this.props.getProfile(); // fetch profile
  }

  async componentDidUpdate(prevProps, prevState) {
    let { updated, authData } = this.props;
    if (updated !== prevProps.updated) {
      this.props.getUserDetails(); // fetch user updated details
    }
    if (authData !== prevProps.authData) {
      this.profileUpdated(updated); // profile updated
    }
    let { profile, cover } = this.state;
    if (profile.buffer !== prevState.profile.buffer) {
      this.updateProfileFile();
    }
    if (cover.buffer !== prevState.cover.buffer) {
      this.updateCoverFile();
    }
  }

  convertToBuffer = async (reader, cover = false) => {
    //file is converted to a buffer to prepare for uploading to IPFS`
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    if (cover)
      this.setState({ cover: { ...this.state.cover, buffer: buffer } });
    else this.setState({ profile: { ...this.state.profile, buffer: buffer } });
  };

  profileFileChange = async () => {
    this.setState({ loading: true }); // start the loader
    let file = this.profileInput.current.files[0];
    let url = URL.createObjectURL(file);
    this.setState({ profile: { ...this.state.profile, url: url, file: file } });
    if (file.size > 1572864) {
      // check file size
      file = await compressImage(file); // compress image
    }
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, false);
  };

  updateProfileFile = async () => {
    let { profile } = this.state;
    let ipfsHash = await ipfs.add(profile.buffer, {
      // get buffer IPFS hash
      pin: true,
      progress: (bytes) => {
        // console.log("File upload progress ", Math.floor(bytes * 100 / (profile.file.size)))
      },
    });
    let userObj = { profile: ipfsHash.path };
    this.props.updateProfile(userObj); // update profile
  };

  coverFileChange = async () => {
    this.setState({ loading: true }); // start the loader
    let file = this.profileCoverInput.current.files[0];
    let url = URL.createObjectURL(file);
    this.setState({ cover: { ...this.state.cover, url: url, file: file } });
    if (file.size > 1572864) {
      // check file size
      file = await compressImage(file); // compress image
    }
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, true);
  };

  updateCoverFile = async () => {
    let { cover } = this.state;
    let ipfsHash = await ipfs.add(cover.buffer, {
      // get buffer IPFS hash
      pin: true,
      progress: (bytes) => {
        // console.log("File upload progress ", Math.floor(bytes * 100 / (cover.file.size)))
      },
    });
    let userObj = { cover: ipfsHash.path };
    this.props.updateProfile(userObj); // update profile
  };

  profileUpdated = (data) => {
    this.setState({ loading: false }); // stop loader
  };

  renderedProfileInfo(profile, index) {
    let context = this.context;
    let img = '',
      mobImg = '';
    if (context.locale === 'tr') {
      img = profile.banner.tu;
      mobImg = profile.mobile.tu;
    } else {
      img = profile.banner.en;
      mobImg = profile.mobile.en;
    }
    return (
      <Link to={profile.url} key={index}>
        <motion.img
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          key={index}
          src={img}
          exit={{ opacity: 0 }}
          className='desk-img'
        />
        <img src={mobImg} className='mobile-img' alt='' />
      </Link>
    );
  }

  render() {
    const { profile, profileInfo } = this.props;
    const { loading, profile_banner } = this.state;
    function _compactAddress(address) {
      const newAddress = address;
      if (address) {
        return (
          newAddress.substring(0, 5) +
          '....' +
          newAddress.substring(newAddress.length - 10, newAddress.length)
        );
      }
    }
    return (
      <>
        <ProMBannerBX
          style={{
            backgroundImage: `url(${this.state.cover.url
              ? this.state.cover.url
              : profile
                ? profile.cover
                  ? profile.cover
                  : ProfielBack
                : ProfielBack
              })`,
          }}
        >
          <ProMBX01>
            <ProSBX01>
              <UserImgBX>
                <UserImgSB>
                  {this.state.profile.url ? (
                    <img src={this.state.profile.url} alt='' />
                  ) : (
                    <motion.img
                      initial={{ opacity: 0.2 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      key={profile?.profile ? profile.profile : UserIcon}
                      src={profile?.profile ? profile.profile : UserIcon}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </UserImgSB>

                <ImgUplBTN>
                  <button>
                    <img src={PlusICO} alt='' />{' '}
                  </button>
                  <div className='ddMBX'>
                    <input
                      type='file'
                      accept="image/*"
                      ref={this.profileInput}
                      name='profile_pic'
                      id='profile_file'
                      hidden
                      onChange={() => {
                        this.profileFileChange();
                      }}
                    />
                    <button
                      onClick={() => {
                        this.profileInput.current.click();
                      }}
                    >
                      Edit Profile Pic
                    </button>

                    <input
                      type='file'
                      accept="image/*"
                      ref={this.profileCoverInput}
                      name='profileCoverInput'
                      id='profileCoverInput'
                      hidden
                      onChange={() => {
                        this.coverFileChange();
                      }}
                    />
                    <button
                      onClick={() => {
                        this.profileCoverInput.current.click();
                      }}
                    >
                      Edit Cover Pic
                    </button>
                  </div>
                </ImgUplBTN>
              </UserImgBX>

              <UserDetailBX>
                <UserDTitle01>
                  {profile
                    ? profile.name
                      ? profile.name
                      : 'User Name'
                    : 'User Name'}
                  <span>
                    @
                    {profile
                      ? profile.username
                        ? profile.username
                        : 'username'
                      : 'username'}
                  </span>
                </UserDTitle01>
                <CustomScrollbars
                  autoHide
                  autoHideTimeout={1000}
                  style={{
                    width: '100%',
                    height: '58px',
                    position: 'relative',
                  }}
                >
                  <UserDText01>
                    {profile ? profile.bio : 'user bio'}
                  </UserDText01>
                </CustomScrollbars>
                <UserSocilMBX>
                  {profile ? (
                    profile.portfolio?.website?.url ? (
                      <button
                        onClick={() => {
                          window.open(profile.portfolio.website.url, '_blank');
                        }}
                      >
                        <img src={SocialICO01} alt='' />
                      </button>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                  {profile?.portfolio?.discord?.url && (
                    <button
                      onClick={() => {
                        window.open(profile.portfolio.discord.url, '_blank');
                      }}
                    >
                      <img src={SocialICO02} alt='' />
                    </button>
                  )
                  }
                  {profile ? (
                    profile.portfolio?.facebook?.url ? (
                      <button
                        onClick={() => {
                          window.open(profile.portfolio.facebook.url, '_blank');
                        }}
                      >
                        <img src={SocialICO03} alt='' />
                      </button>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                  {profile ? (
                    profile.portfolio?.twitter?.url ? (
                      <button
                        onClick={() => {
                          window.open(profile.portfolio.twitter.url, '_blank');
                        }}
                      >
                        <img src={SocialICO04} alt='' />
                      </button>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                  {profile ? (
                    profile.portfolio?.youtube?.url ? (
                      <button
                        onClick={() => {
                          window.open(profile.portfolio.youtube.url, '_blank');
                        }}
                      >
                        <img src={SocialICO05} alt='' />
                      </button>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                  {profile ? (
                    profile.portfolio?.instagarm?.url ? (
                      <button
                        onClick={() => {
                          window.open(
                            profile.portfolio.instagarm.url,
                            '_blank'
                          );
                        }}
                      >
                        <img src={SocialICO06} alt='' />
                      </button>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                </UserSocilMBX>
                <UserDText02 className='desktop-block'>
                  <FormattedMessage id='joined' defaultMessage='Joined' />
                  <span>
                    {profile
                      ? dateFormat(
                        new Date(profile.createdAt).toString(),
                        'dd mmmm yyyy'
                      )
                      : 'join date'}
                  </span>
                </UserDText02>
              </UserDetailBX>
            </ProSBX01>

            <ProSBX02>
              <ProSBX03>
                <div className='cff-section'>
                  <FollowerMBX>
                    <FormattedMessage id='created' defaultMessage='Created' />
                    <span>{profile ? profile.nftCreated : '000'}</span>
                  </FollowerMBX>
                  <FollowerMBX>
                    <FormattedMessage
                      id='followers'
                      defaultMessage='Followers'
                    />
                    <span>{profile ? profile.followersCount : '000'}</span>
                  </FollowerMBX>
                  <FollowerMBX>
                    <FormattedMessage
                      id='following'
                      defaultMessage='Following'
                    />
                    <span>{profile ? profile.followingCount : '000'}</span>
                  </FollowerMBX>
                </div>
                <ProSBX04 className='mobile-block'>
                  <span>#000000</span>{' '}
                  <p>{profile ? profile.walletAddress : 'xyz....'}</p>
                  <button
                    title='Copied'
                    onClick={() => {
                      navigator.clipboard.writeText(
                        profile ? profile.walletAddress : 'xyz....'
                      );
                    }}
                  >
                    <img src={CopyICO} alt='' />
                  </button>
                </ProSBX04>
                <UserDText02 className='mobile-block'>
                  <FormattedMessage id='joined' defaultMessage='Joined' />
                  <span>
                    {profile
                      ? dateFormat(
                        new Date(profile.createdAt).toString(),
                        'dd mmmm yyyy'
                      )
                      : 'join date'}
                  </span>
                </UserDText02>
                <EditPrBTN
                  onClick={() => this.props.history.push('/user/edit-profile')}
                >
                  <FormattedMessage
                    id='edit_profile'
                    defaultMessage='Edit Profile'
                  />
                </EditPrBTN>
              </ProSBX03>

              <ProSBX04 className='desktop-block'>
                <span>#000000</span>{' '}
                <p>
                  {profile ? _compactAddress(profile.walletAddress) : 'xyz....'}
                </p>
                <button
                  title='Copied'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      profile ? profile.walletAddress : 'xyz....'
                    );
                  }}
                >
                  <img src={CopyICO} alt='' />
                </button>
              </ProSBX04>
            </ProSBX02>
          </ProMBX01>
        </ProMBannerBX>

        <Gs.Container>
          {loading ? (
            <>
              <BlackWrap>
                <WhiteBX01>
                  <OnbTitle01 className='v2'>
                    Please wait profile is updating
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

          <ADBannerMBX>
            {profile_banner && profileInfo
              ? profileInfo.map((info, key) =>
                this.renderedProfileInfo(info, key)
              )
              : ``}
          </ADBannerMBX>

          <HomeTabs>
            <Tabs>
              {profile?.role.roleName === 'CREATOR' ? (
                <>
                  <TabList>
                    <Tab>
                      <FormattedMessage id='created' defaultMessage='Created' />
                    </Tab>
                    <Tab>
                      <FormattedMessage
                        id='collected'
                        defaultMessage='Collected'
                      />
                    </Tab>
                    <Tab>
                      <FormattedMessage
                        id='collections'
                        defaultMessage='Collections'
                      />
                    </Tab>
                    <Tab>
                      <FormattedMessage id='liked' defaultMessage='Liked' />
                    </Tab>
                    <Tab>
                      <FormattedMessage id='drafts' defaultMessage='Drafts' />
                    </Tab>
                  </TabList>

                  <TabPanel>
                    {' '}
                    <Created
                      status={profile.status === 'APPROVED' ? true : false}
                      profile={true}
                    />{' '}
                  </TabPanel>
                  <TabPanel>
                    {' '}
                    <Collected role='creator' profile={true} />{' '}
                  </TabPanel>
                  <TabPanel>
                    {' '}
                    <Collection profile={true} />{' '}
                  </TabPanel>
                  <TabPanel>
                    {' '}
                    <Liked profile={true} />{' '}
                  </TabPanel>
                  <TabPanel>
                    {' '}
                    <Drafts
                      status={profile.status === 'APPROVED' ? true : false}
                    />{' '}
                  </TabPanel>
                </>
              ) : (
                <>
                  <TabList>
                    <Tab>
                      <FormattedMessage
                        id='collected'
                        defaultMessage='Collected'
                      />
                    </Tab>
                    <Tab>
                      <FormattedMessage id='liked' defaultMessage='Liked' />
                    </Tab>
                  </TabList>

                  <TabPanel>
                    {' '}
                    <Collected role='collector' profile={true} />{' '}
                  </TabPanel>
                  <TabPanel>
                    {' '}
                    <Liked profile={true} />{' '}
                  </TabPanel>
                </>
              )}
            </Tabs>
          </HomeTabs>
        </Gs.Container>
      </>
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
`;

const ProMBannerBX = styled(FlexDiv)`
  width: 100%;
  height: 300px;
  margin-bottom: 230px;
  background-size: cover;
  background-position: 50% 50%;
  position: relative;
  :after{
    content: '';
    position: absolute;
    top: 0px;
    background: linear-gradient(#000, transparent);
    width: 100%;
    height: 178px;
    z-index: 0;
  }
  ${Media.md} {
    margin-bottom: 180px;
    height: 180px;
  }
  ${Media.sm} {
    margin-bottom: 550px;
  }
`;
const ProMBX01 = styled(FlexDiv)`
  width: 100%;
  max-width: 1160px;
  background-color: #fff;
  padding: 40px;
  border-radius: 40px;
  min-height: 315px;
  margin-bottom: -291px;
  box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.1);
  align-items: stretch;
  z-index:1;
  ${Media.lg} {
    max-width: 94%;
  }
  ${Media.md} {
    padding: 20px;
    min-height: 200px;
  }
  ${Media.sm} {
    margin-bottom: -600px;
  }
`;
const ProSBX01 = styled(FlexDiv)`
  width: 50%;
  justify-content: flex-start;
  align-items: flex-start;
  ${Media.lg} {
    width: 40%;
  }
  ${Media.md} {
    width: 44%;
  }
  ${Media.sm} {
    width: 100%;
    display: block;
  }
`;

const UserImgBX = styled(FlexDiv)`
  width: 142px;
  justify-content: flex-start;
  position: relative;
  ${Media.md} {
    width: 120px;
  }
  ${Media.sm} {
    justify-content: center;
    margin: 0 auto;
  }
`;

const UserImgSB = styled.div`
  width: 122px;
  height: 122px;
  border-radius: 62px;
  overflow: hidden;
  border: 1px solid #efecf0;
  ${Media.md} {
    width: 100px;
    height: 100px;
  }
  ${Media.sm} {
    width: 72px;
    height: 72px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const UserDetailBX = styled(FlexDiv)`
  justify-content: flex-start;
  flex-direction: column;
  width: calc(100% - 142px);
  ${Media.sm} {
    justify-content: center;
    display: block;
    width: 100%;
    text-align: center;
  }
`;
const UserDTitle01 = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #000000;
  width: 100%;
  margin-top: 19px;
  margin-bottom: 18px;
  text-transform: capitalize;
  ${Media.xs} {
    font-size: 18px;
  }
  span {
    font-size: 16px;
    display: block;
    width: 100%;
    margin-top: 6px;
    text-transform: initial;
    ${Media.xs} {
      font-size: 12px;
    }
  }
`;
const UserDText01 = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  width: 100%;
  ${Media.xs} {
    font-size: 10px;
    line-height: 14px;
  }
`;
const UserDText02 = styled(UserDText01)`
  color: rgba(0, 0, 0, 0.3);
  width: 100%;
  margin-top: 30px;
  span {
    color: #000000;
    padding-left: 25px;
    ${Media.sm} {
      font-weight: normal;
    }
  }
  ${Media.sm} {
    font-size: 12px;
  }
  &.desktop-block {
    ${Media.sm} {
      display: none;
    }
  }
  &.mobile-block {
    display: none;
    ${Media.sm} {
      display: block;
      margin: 0 auto;
    }
  }
`;
const UserSocilMBX = styled(FlexDiv)`
  width: 100%;
  justify-content: flex-start;
  margin-top: 22px;
  button {
    display: block;
    width: 28px;
    height: 28px;
    padding: 0;
    margin: 0 4px 0 0;
    filter: brightness(0.2);
    :hover {
      filter: brightness(1);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  ${Media.sm} {
    justify-content: center;
  }
`;
const ProSBX02 = styled(FlexDiv)`
  width: 50%;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  ${Media.lg} {
    width: 60%;
  }
  ${Media.md} {
    width: 56%;
  }
  ${Media.sm} {
    width: 100%;
  }
  .cff-section {
    display: flex;
    ${Media.sm} {
      justify-content: center;
      border: 1px solid #dddddd;
      border-radius: 10px;
      padding: 15px;
      max-width: 287px;
      width: 100%;
      margin: 0 auto 20px;
    }
  }
`;

const ProSBX03 = styled(FlexDiv)`
  flex-direction: row;
  margin-bottom: auto;
  ${Media.md} {
    margin-top: 15px;
    width: -webkit-fill-available;
    justify-content: flex-end;
  }
  ${Media.sm} {
    display: block;
    text-align: center;
    margin-top: 40px;
  }
  .mobile-block {
    display: none;
    a {
      display: block;
      font-size: 12px;
      color: #000000;
      line-height: 20px;
      margin: 15px 0px 0px;
      text-decoration: underline;
    }
    ${Media.sm} {
      display: block;
    }
  }
`;
const FollowerMBX = styled(FlexDiv)`
  font-size: 16px;
  font-weight: 600;
  color: #b2b2b2;
  justify-content: flex-start;
  padding-right: 10px;
  span {
    width: 100%;
    margin-top: 5px;
    color: #000;
    font-size: 22px;
    display: block;
    ${Media.xs} {
      font-size: 20px;
    }  
  }
  ${Media.sm} {
    font-size: 14px;
    justify-content: center;
    color: #8e9194;
  }
`;
const EditPrBTN = styled.button`
  border: 1px solid #000000;
  border-radius: 15px;
  padding: 8px 18px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  :hover {
    background-color: #f40058;
    color: #fff;
    border: 1px solid #f40058;
  }
  ${Media.md} {
    margin: initial;
  }
  ${Media.sm} {
    font-size: 16px;
    margin-top: 40px;
  }
  ${Media.xs} {
    font-size: 14px;
  }
`;

const ProSBX04 = styled(FlexDiv)`
  min-width: 172px;
  background-color: #eef2f7;
  border-radius: 15px;
  min-height: 38px;
  padding: 6px 12px 6px 97px;
  margin: 50px 0 0 0;
  font-size: 14px;
  color: #000;
  position: relative;
  ${Media.md} {
    padding: 6px 12px 6px 94px;
  }
  &.desktop-block {
    ${Media.sm} {
      display: none;
    }
  }
  &.mobile-block {
    display: none;
    ${Media.sm} {
      display: block;
      width: max-content;
      margin: 0 auto 40px;
    }
  }
  p {
    margin: 0px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 142px;
    ${Media.sm} {
      width: 125px;
    }
  }
  span {
    background-color: #f40058;
    position: absolute;
    left: 0;
    top: 0;
    line-height: 38px;
    padding: 0 12px;
    border-radius: 15px;
    color: #fff;
    height: 38px;
  }

  button {
    padding: 0;
    margin: 0 0 0 8px;
    :hover {
      opacity: 0.6;
    }
  }
`;
const ImgUplBTN = styled(FlexDiv)`
  position: absolute;
  width: 21px;
  height: 21px;
  right: 28px;
  bottom: 8px;
  display: none;
  button {
    width: 21px;
    height: 21px;
    padding: 0;
    :hover {
      filter: brightness(1.2);
    }
  }
  ${UserImgBX}:hover & {
    display: block;
  }
  .ddMBX {
    position: absolute;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
    border: solid 1px #eef2f7;
    background-color: #ffffff;
    width: 100px;
    border-radius: 20px;
    padding: 6px 0;
    top: 24px;
    z-index: 100;
    overflow: hidden;
    display: none;
    left: 50%;
    transform: translateX(-50%);
    button {
      display: block;
      font-size: 12px;
      padding: 8px 8px;
      width: 100%;
      height: auto;
      :hover {
        background-color: #d9f5f5;
        :hover {
          filter: brightness(1);
        }
      }
    }
  }
  :hover .ddMBX {
    display: block;
  }
`;

const ADBannerMBX = styled.div`
  width: 100%;
  height: 100%;
  max-width: -webkit-fill-available;
  margin: 0 15px 50px 15px;
  border-radius: 10px;
  overflow: hidden;
  img {
    max-width: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    &.desk-img {
      ${Media.xs} {
        display: none;
      }
    }
    &.mobile-img {
      display: none;
      ${Media.xs} {
        display: block;
      }
    }
    ${Media.xs} {
      object-fit: initial;
      width: auto;
      height: auto;
    }
  }
  ${Media.md} {
    margin: 50px 15px;
  }
  ${Media.sm} {
    margin: 0px 0px 40px;
  }
`;

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const HomeTabs = styled.div`
  margin: 0px 0px 70px;
  .react-tabs__tab-list {
    border-bottom: 1px solid #ddd;
    margin-bottom: 30px;
    ${Media.sm} {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      flex-wrap: initial;
    }
  }
  .react-tabs__tab-panel--selected {
    margin: 0px 20px;
    ${Media.sm} {
      margin: 0px;
    }
  }
  .react-tabs__tab {
    bottom: 0px;
    padding: 6px 0px;
    margin: 0px 20px;
    color: rgb(0 0 0 / 30%);
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.8px;
    ${Media.sm} {
      font-size: 16px;
      margin: 0px 30px 0px 0px;
    }
    :focus {
      box-shadow: none;
      border: none;
    }
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
  padding: 120px 0px;
  margin: 120px 0px;
  text-align: center;
  background: url(${AdBannerIMG}) no-repeat;
  background-size: cover;
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

const mapDipatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(actions.getProfile()),
    getUserDetails: () => dispatch(actions.getUserDetails()),
    updateProfile: (params) => dispatch(actions.updateUserDetails(params)),
    getProfileBanner: () => dispatch(actions.getProfileBanner()),
    getDashboard: () => dispatch(actions.fetchDashboardConfig()),
    setDashboard: (data) => dispatch({ type: 'FETCHED_DASHBOARD', data: data }),
    getProfileInfo: () => dispatch(actions.getProfileInfo()),
    setProfileInfo: (data) =>
      dispatch({ type: 'FETCHED_PROFILE_INFO', data: data }),
  };
};
const mapStateToProps = (state) => {
  return {
    profile: state.fetchProfile,
    updated: state.updateProfile,
    dashboard: state.fetchDashboard,
    profileBanner: state.fetchProfileBanner,
    profileInfo: state.fetchProfileInfo,
    authData: state.fetchAuthData,
  };
};

export default withCookies(
  withRouter(connect(mapStateToProps, mapDipatchToProps)(Profile))
);
