import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";
import React, { Component } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import dateFormat from "dateformat";

import Gs from "../Theme/globalStyles";
import LoaderGif from "../Assets/images/loading.gif";
import UserIcon from "../Assets/images/user-img.jpg";
import ProfielBack from "../Assets/images/profile-back.jpg";
import CopyICO from "../Assets/images/icon-copy.svg";

import SocialICO01 from "../Assets/images/social-icon01.svg";
import SocialICO02 from '../Assets/images/social-icon02.svg';
import SocialICO03 from "../Assets/images/social-icon03.svg";
import SocialICO04 from "../Assets/images/social-icon04.svg";
import SocialICO05 from "../Assets/images/social-icon05.svg";
import SocialICO06 from "../Assets/images/social-icon06.svg";

import { actions } from "../actions";

import Created from "../Component/profile/created";
import Collected from "../Component/profile/collected";
import Collection from "../Component/profile/collection";
import Liked from "../Component/profile/liked";

import Media from "../Theme/media-breackpoint";
import { Scrollbars } from "react-custom-scrollbars";
import { _compactAddress } from "../helper/functions";

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

class CreatorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      loading: false,
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const { web3Data, profile } = this.props;
    if (!profile) this.props.getUserProfile(id); // fetch user profile by id
    if (web3Data.isLoggedIn) this.props.getIsFollow(id); // check user is following
  }

  componentWillUnmount() {
    this.props.clearUserProfile(); // clear the user profile data
  }

  componentDidUpdate(prevProps, prevState) {
    const { status } = this.props;
    const { id } = this.state;
    if (status !== prevProps.status) {
      this.setState({ loading: false }); // stop loader
      this.props.getUserProfile(id); // fetch user profile by id
    }
  }

  followToggler = (id) => {
    this.setState({ loading: true }); // start loader
    this.props.followToggler(id); // follow toggle api called
  };

  render() {
    const { profile, status, web3Data, authData } = this.props;
    const { id, loading } = this.state;
    return (
      <>
        {profile ? (
          <>
            <Helmet>
              <meta property="og:url" content={window.location.href} />
              <meta property="og:title" content={profile?.name} />
              <meta
                property="og:image"
                content={profile.profile ? profile.profile : UserIcon}
              />
              <meta property="og:description" content={profile?.bio} />
            </Helmet>

            <ProMBannerBX
              style={{
                backgroundImage: `url(${profile.cover ? profile.cover : ProfielBack
                  })`,
              }}
            >
              <ProMBX01>
                <ProSBX01>
                  <UserImgBX>
                    <UserImgSB>
                      <img
                        src={profile.profile ? profile.profile : UserIcon}
                        alt=""
                      />
                    </UserImgSB>
                  </UserImgBX>

                  <UserDetailBX>
                    <UserDTitle01>
                      {profile ? profile.name : "User Name"}
                      <span>@{profile ? profile.username : "username"}</span>
                    </UserDTitle01>
                    <CustomScrollbars
                      autoHide
                      autoHideTimeout={1000}
                      style={{ width: "100%", height: "58px", position: "relative" }}
                    >
                      <UserDText01>
                        {profile ? profile.bio : "user bio"}
                      </UserDText01>
                    </CustomScrollbars>
                    <UserSocilMBX>
                      {profile ? (
                        profile.portfolio?.website?.url ? (
                          <button
                            onClick={() => {
                              window.open(
                                profile.portfolio.website.url,
                                "_blank"
                              );
                            }}
                          >
                            <img src={SocialICO01} alt="" />
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
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
                              window.open(
                                profile.portfolio.facebook.url,
                                "_blank"
                              );
                            }}
                          >
                            <img src={SocialICO03} alt="" />
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      {profile ? (
                        profile.portfolio?.twitter?.url ? (
                          <button
                            onClick={() => {
                              window.open(
                                profile.portfolio.twitter.url,
                                "_blank"
                              );
                            }}
                          >
                            <img src={SocialICO04} alt="" />
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      {profile ? (
                        profile.portfolio?.youtube?.url ? (
                          <button
                            onClick={() => {
                              window.open(
                                profile.portfolio.youtube.url,
                                "_blank"
                              );
                            }}
                          >
                            <img src={SocialICO05} alt="" />
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                      {profile ? (
                        profile.portfolio?.instagarm?.url ? (
                          <button
                            onClick={() => {
                              window.open(
                                profile.portfolio.instagarm.url,
                                "_blank"
                              );
                            }}
                          >
                            <img src={SocialICO06} alt="" />
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </UserSocilMBX>
                    <UserDText02 className="desktop-block">
                      <FormattedMessage id="joined" defaultMessage="Joined" />
                      <span>
                        {profile
                          ? dateFormat(
                            new Date(profile.createdAt).toString(),
                            "dd mmmm yyyy"
                          )
                          : "join date"}
                      </span>
                    </UserDText02>
                  </UserDetailBX>
                </ProSBX01>

                <ProSBX02>
                  <ProSBX03>
                    <div className="cff-section">
                      <FollowerMBX>
                        <FormattedMessage
                          id="created"
                          defaultMessage="Created"
                        />
                        <span>{profile ? profile.nftCreated : "000"}</span>
                      </FollowerMBX>
                      <FollowerMBX>
                        <FormattedMessage
                          id="followers"
                          defaultMessage="Followers"
                        />
                        <span>{profile ? profile.followersCount : "000"}</span>
                      </FollowerMBX>
                      <FollowerMBX>
                        <FormattedMessage
                          id="following"
                          defaultMessage="Following"
                        />
                        <span>{profile ? profile.followingCount : "000"}</span>
                      </FollowerMBX>
                    </div>
                    <ProSBX04 className="mobile-block">
                      <span>#000000</span>{" "}
                      <p>
                        {profile
                          ? _compactAddress(profile.walletAddress)
                          : "xyz...."}{" "}
                      </p>
                      <button
                        title="Copied"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            profile ? profile.walletAddress : "xyz...."
                          );
                        }}
                      >
                        <img src={CopyICO} alt="" />
                      </button>
                    </ProSBX04>
                    <UserDText02 className="mobile-block">
                      <FormattedMessage id="joined" defaultMessage="Joined" />
                      <span>
                        {profile
                          ? dateFormat(
                            new Date(profile.createdAt).toString(),
                            "dd mmmm yyyy"
                          )
                          : "join date"}
                      </span>
                    </UserDText02>

                    {web3Data.isLoggedIn &&
                      authData?.data.id !== profile?.id ? (
                      <EditPrBTN
                        className={loading ? `disabled` : ``}
                        onClick={() => this.followToggler(profile.id)}
                      >
                        {loading ? (
                          "loading"
                        ) : status.isFollowed ? (
                          <FormattedMessage
                            id="unfollow"
                            defaultMessage="Unfollow"
                          />
                        ) : (
                          <FormattedMessage
                            id="follow"
                            defaultMessage="Follow"
                          />
                        )}
                      </EditPrBTN>
                    ) : (
                      ``
                    )}

                    {web3Data.isLoggedIn &&
                      authData?.data.id === profile?.id ? (
                      <EditPrBTN
                        onClick={() =>
                          this.props.history.push("/user/edit-profile")
                        }
                      >
                        <FormattedMessage
                          id="edit_profile"
                          defaultMessage="Edit Profile"
                        />
                      </EditPrBTN>
                    ) : (
                      ``
                    )}
                  </ProSBX03>

                  <ProSBX04 className="desktop-block">
                    <span>#000000</span>{" "}
                    <p>
                      {profile
                        ? _compactAddress(profile.walletAddress)
                        : "xyz...."}{" "}
                    </p>
                    <button
                      title="Copied"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          profile ? profile.walletAddress : "xyz...."
                        );
                      }}
                    >
                      <img src={CopyICO} alt="" />
                    </button>
                  </ProSBX04>
                </ProSBX02>
              </ProMBX01>
            </ProMBannerBX>

            <Gs.Container>
              <HomeTabs>
                <Tabs>
                  {profile.role.roleName === "CREATOR" ? (
                    <>
                      <TabList>
                        <Tab>
                          {" "}
                          <FormattedMessage
                            id="created"
                            defaultMessage="Created"
                          />{" "}
                        </Tab>
                        <Tab>
                          <FormattedMessage
                            id="collected"
                            defaultMessage="Collected"
                          />{" "}
                        </Tab>
                        <Tab>
                          <FormattedMessage
                            id="collections"
                            defaultMessage="Collections"
                          />{" "}
                        </Tab>
                        <Tab>
                          <FormattedMessage id="liked" defaultMessage="Liked" />
                        </Tab>
                      </TabList>

                      <TabPanel>
                        {" "}
                        <Created profile={false} />{" "}
                      </TabPanel>
                      <TabPanel>
                        {" "}
                        <Collected role="creator" profile={false} />{" "}
                      </TabPanel>
                      <TabPanel>
                        {" "}
                        <Collection profile={false} />{" "}
                      </TabPanel>
                      <TabPanel>
                        {" "}
                        <Liked profile={false} />{" "}
                      </TabPanel>
                    </>
                  ) : (
                    <>
                      <TabList>
                        <Tab><FormattedMessage
                          id="collected"
                          defaultMessage="Collected"
                        />{" "}
                        </Tab>
                        <Tab><FormattedMessage
                          id="collections"
                          defaultMessage="Collections"
                        />{" "}
                        </Tab>
                        <Tab><FormattedMessage id="liked" defaultMessage="Liked" /></Tab>
                      </TabList>

                      <TabPanel>
                        {" "}
                        <Collected role="collector" profile={false} />{" "}
                      </TabPanel>
                      <TabPanel>
                        {" "}
                        <Collection profile={false} />{" "}
                      </TabPanel>
                      <TabPanel>
                        {" "}
                        <Liked profile={false} />{" "}
                      </TabPanel>
                    </>
                  )}
                </Tabs>
              </HomeTabs>
            </Gs.Container>
          </>
        ) : (
          <LoaderBX>
            {" "}
            <img src={LoaderGif} alt="" />{" "}
          </LoaderBX>
        )}
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
    margin-bottom: 250px;
    height:180px;
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
const EditPrBTN = styled.div`
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
  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }
  ${Media.md} {
    margin: initial;
  }
  ${Media.sm} {
    font-size: 16px;
    margin: 40px auto 0px;
    width: max-content;
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
  padding: 6px 12px 6px 105px;
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
    getUserProfile: (id) => dispatch(actions.getUserProfile(id)),
    getIsFollow: (id) => dispatch(actions.getIsFollow(id)),
    followToggler: (id) => dispatch(actions.followToggler(id)),
    clearUserProfile: () =>
      dispatch({ type: "FETCHED_USER_PROFILE", data: null }),
  };
};
const mapStateToProps = (state) => {
  return {
    profile: state.fetchUserProfile,
    status: state.fetchIsFollow,
    web3Data: state.fetchWeb3Data,
    authData: state.fetchAuthData,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(CreatorProfile);
