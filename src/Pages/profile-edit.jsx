import React, { Component } from "react";
import styled from "styled-components";
import Gs from "../Theme/globalStyles";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { HashLink as Link } from "react-router-hash-link";
import { withRouter } from "react-router";
import Sticky from "react-sticky-el";

import DDdownA from "../Assets/images/dd-down-arrow.svg";
import CICON01 from "../Assets/images/peSocICO-01.svg";
import CICON02 from "../Assets/images/peSocICO-02.svg";
import CICON03 from "../Assets/images/peSocICO-03.svg";
import CICON04 from "../Assets/images/peSocICO-04.svg";
import CICON05 from "../Assets/images/peSocICO-05.svg";
import CICON06 from "../Assets/images/peSocICO-06.svg";
import LoaderGif from "../Assets/images/loading.gif";
import SuccessPopup from "../Component/Modals/sucessPopup";

import { actions } from "../actions";
import { client_id, redirect_url } from "../config";
import Media from "../Theme/media-breackpoint";
import Scrollspy from "react-scrollspy";

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: null,
      loading: false,
      updated: false,
      userObj: null,
      formChange: false,
      oauth_token: null,
    };
  }

  async componentDidMount() {
    const { profile } = this.props;
    if (!profile) {
      this.props.getProfile(); // fetch profile
    } else {
      this.setState({ userObj: profile });
    }
    let Query = new URLSearchParams(this.props.location.search);
    if (Query.get("oauth_token") && Query.get("oauth_verifier")) {
      this.props.verifyByTwitter(
        Query.get("oauth_token"),
        Query.get("oauth_verifier")
      ); // verify via twitter
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let {
      profile,
      updated,
      error,
      verified_by_insta,
      access_token,
      verified_by_twitter,
    } = this.props;
    if (profile !== prevProps.profile) {
      this.setState({ userObj: profile }); // store props into state
    }
    if (updated !== prevProps.updated) {
      this.profileUpdated(updated); // profile updated
    }
    if (verified_by_insta !== prevProps.verified_by_insta) {
      this.profileUpdated(updated); // verified by instagram
    }
    if (verified_by_twitter !== prevProps.verified_by_twitter) {
      this.profileUpdated(updated); // verified by twitter
    }
    if (access_token !== prevProps.access_token) {
      // console.log('access_token ? ', access_token)
      window.open(access_token.redirect_uri, "_self");
    }
    if (error !== prevProps.error) {
      if (error) {
        this.setState({ errors: error, loading: false }); // set api error into state
        this.props.clearErrors(); // clear the error
      }
    }
  }

  formChange = (e) => {
    const { userObj, formChange } = this.state;
    if (
      e.target.name === "website" ||
      e.target.name === "instagarm" ||
      e.target.name === "facebook" ||
      e.target.name === "github" ||
      e.target.name === "twitter" ||
      e.target.name === "discord" ||
      e.target.name === "youtube" ||
      e.target.name === "twitch" ||
      e.target.name === "tiktok" ||
      e.target.name === "snapchat"
    ) {
      if (userObj.portfolio) {
        this.setState({
          formChange: true,
          userObj: {
            ...userObj,
            portfolio: {
              ...userObj.portfolio,
              [e.target.name]: {
                ...userObj.portfolio[e.target.name],
                url: e.target.value,
              },
            },
          },
        });
      } else {
        this.setState({
          formChange: true,
          userObj: {
            ...userObj,
            portfolio: { [e.target.name]: e.target.value },
          },
        });
      }
    } else {
      this.setState({
        formChange: true,
        userObj: { ...userObj, [e.target.name]: e.target.value },
      });
    }
  };

  formSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
      updated: false,
      formChange: false,
    }); // start the loader
    const { userObj } = this.state;
    let params = {
      name: userObj.name,
      username: userObj.username,
      email: userObj.email,
      bio: userObj.bio,
      portfolio: userObj.portfolio,
    };
    this.props.setProfile(params); // update the user profile
    this.setState({ errors: null });
  };

  profileUpdated = (data) => {
    this.props.getProfile(); // fetch profile
    this.setState({ loading: false, updated: true }); // stop loader
  };

  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };

  onInstagramSuccess = (code) => {
    this.props.sendInstaCode(code);
    this.setState({ loading: true });
  };

  onInstagramFailure = (params) => {
    // console.log('onInstagramFailure ? ', params)
  };

  render() {
    const { profile } = this.props;
    const { loading, updated, formChange, errors } = this.state;

    function pointSelect(curr) {
      let hash = window.location.hash.substr(1);
      if (hash === curr) return "active";
      else return "inactive";
    }

    return (
      <Gs.MainSection>
        {loading ? (
          <>
            <BlackWrap>
              <WhiteBX01>
                <OnbTitle01 className="v2">
                  Please wait profile is updating
                </OnbTitle01>
                <LoaderBX>
                  <img src={LoaderGif} alt="" />
                </LoaderBX>
              </WhiteBX01>
            </BlackWrap>
          </>
        ) : (
          ""
        )}

        {updated ? (
          <SuccessPopup
            message={<FormattedMessage id="profile_updated" />}
            url="/user/profile"
          />
        ) : (
          ""
        )}

        <div style={{ minHeight: "100vh", width: "100%" }}>
          <Gs.Container>
            <NFTminting>
              <Gs.W200px>
                <Sticky>
                  <NFTLeft>
                    <Scrollspy
                      items={[
                        "accountSettings",
                        "biography",
                        // 'verifyProfile',
                        "socialLink",
                      ]}
                      currentClassName="active"
                    >
                      <Link
                        className={pointSelect("accountSettings")}
                        to="#accountSettings"
                        smooth={true}
                      >
                        <FormattedMessage
                          id="account_settings"
                          defaultMessage="Account Settings"
                        />
                      </Link>
                      <Link
                        className={pointSelect("biography")}
                        to="#biography"
                        smooth={true}
                      >
                        <FormattedMessage
                          id="about_you"
                          defaultMessage="About You"
                        />
                      </Link>
                      {/* <Link
                        className={pointSelect('verifyProfile')}
                        to='#verifyProfile'
                        smooth={true}
                      >
                        Verify Profile
                      </Link> */}
                      <Link
                        className={pointSelect("socialLink")}
                        to="#socialLink"
                        smooth={true}
                      >
                        <FormattedMessage
                          id="social_links"
                          defaultMessage="Social Links"
                        />
                      </Link>
                    </Scrollspy>
                  </NFTLeft>

                  <BackBTN01
                    onClick={() => this.props.history.push("/user/profile")}
                  >
                    <FormattedMessage
                      id="back_to_profile"
                      defaultMessage="Back to Profile"
                    />
                  </BackBTN01>
                </Sticky>
              </Gs.W200px>
              <Gs.W880px className="displayflex">
                {errors ? (
                  <Gs.W605px>
                    <NFTMiddle>
                      <AlertNote>
                        <p>{errors}</p>
                      </AlertNote>
                    </NFTMiddle>
                  </Gs.W605px>
                ) : (
                  ``
                )}

                <Gs.W605px>
                  <NFTMiddle>
                    <form
                      onChange={(e) => this.formChange(e)}
                      onSubmit={(e) => this.formSubmit(e)}
                    >
                      <div id="accountSettings">
                        <NFTtitle>
                          <h4>
                            <FormattedMessage
                              id="account_settings"
                              defaultMessage="Account Settings"
                            />
                          </h4>
                          <p className="mb-30">
                            <FormattedMessage
                              id="edit_profile_form_lable"
                              defaultMessage="People visiting your profile will see the following info"
                            />
                          </p>
                        </NFTtitle>
                        <NFTForm>
                          <div className="label-line">
                            <label>
                              <FormattedMessage
                                id="form_name"
                                defaultMessage="Name"
                              />
                            </label>
                          </div>
                          <FormattedMessage
                            id="type_something"
                            defaultMessage="Type something…"
                          >
                            {(placeholder) => (
                              <input
                                type="text"
                                required
                                name="name"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                defaultValue={
                                  profile ? (profile.name ? profile.name : "") : ""
                                }
                                placeholder={placeholder}
                              />
                            )}
                          </FormattedMessage>
                        </NFTForm>
                        <NFTForm>
                          <div className="label-line">
                            <label>
                              <FormattedMessage
                                id="form_username"
                                defaultMessage="Username"
                              />
                            </label>
                          </div>
                          <div className="iLeft">
                            <i>@</i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="text"
                                  required
                                  name="username"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.username
                                        ? profile.username
                                        : ""
                                      : ""
                                  }
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                          {/* <div className="iLeft errorinput">
                                                    <i>@</i>
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        placeholder="Type something…"
                                                        defaultValue={profile?profile.username:''}
                                                    />
                                                    <p className="error">it’s taken</p>
                                                </div>  */}
                        </NFTForm>
                        <NFTForm>
                          <div className="label-line">
                            <label>
                              <FormattedMessage
                                id="email"
                                defaultMessage="Email"
                              />
                            </label>
                            <FlexDiv className="JCSB">
                              <p>
                                <FormattedMessage
                                  id="form_email_lable"
                                  defaultMessage="Your e-mail adress will not be shown on your profile"
                                />
                              </p>
                            </FlexDiv>
                          </div>
                          <FormattedMessage
                            id="type_something"
                            defaultMessage="Type something…"
                          >
                            {(placeholder) => (
                              <input
                                type="text"
                                required
                                name="email"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                defaultValue={
                                  profile
                                    ? profile.email
                                      ? profile.email
                                      : ""
                                    : ""
                                }
                                placeholder={placeholder}
                              />
                            )}
                          </FormattedMessage>
                        </NFTForm>
                      </div>

                      <div id="biography">
                        <NFTtitle>
                          <h4 className="mt-30">
                            <FormattedMessage
                              id="about_you"
                              defaultMessage="About You"
                            />
                          </h4>
                          <p className="mb-30">
                            <FormattedMessage
                              id="form_about_you_lable"
                              defaultMessage="Write a little bit about yourself"
                            />
                          </p>
                        </NFTtitle>
                        <NFTForm>
                        <FormattedMessage
                            id="type_something"
                            defaultMessage="Type something…"
                          >
                            {(placeholder) => (
                              <textarea
                                type="textarea"
                                name="bio"
                                placeholder="0"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                                defaultValue={
                                  profile ? (profile.bio ? profile.bio : "") : ""
                                }
                                placeholder={placeholder}
                              />
                            )}
                          </FormattedMessage>
                        </NFTForm>
                      </div>
                      {/* <div id='verifyProfile'>
                        <NFTtitle>
                          <h4 className='mt-30'>
                            <FormattedMessage
                              id='verify_profile'
                              defaultMessage='Verify your profile'
                            />
                          </h4>
                          <p className='mb-30'>
                            <FormattedMessage
                              id='verify_profile_label'
                              defaultMessage='Show us how authentic your profile is'
                            />
                          </p>
                        </NFTtitle>
                        <NFTForm>
                          <CustomCheckbox1>
                            <label className='checkbox-container'>
                              <img src={CICON01} alt='' />
                              <FormattedMessage
                                id='verify_twitter'
                                defaultMessage='Verify via Twitter'
                              />
                              <input
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    this.setState({ loading: true });
                                    this.props.getTwitterAccessToken();
                                  }
                                }}
                                checked={profile?.portfolio.twitter.isVerified}
                                type='checkbox'
                                name=''
                                value='twitter'
                              />
                              <span className='checkmark v2'></span>
                            </label>
                            <label className='checkbox-container'>
                              {!profile?.portfolio.instagarm.isVerified ? (
                                <InstagramLogin
                                  cssClass='background: none;'
                                  clientId={client_id}
                                  buttonText='Login'
                                  redirectUri={redirect_url}
                                  scope={['user_profile']}
                                  onSuccess={this.onInstagramSuccess}
                                  onFailure={this.onInstagramFailure}
                                >
                                  <img src={CICON02} alt='' />
                                  <FormattedMessage
                                    id='verify_instagram'
                                    defaultMessage='Verify via Instagram'
                                  />
                                  <input
                                    type='checkbox'
                                    checked={
                                      profile?.portfolio.instagarm.isVerified
                                    }
                                    name=''
                                    value='intagram'
                                  />
                                  <span className='checkmark v2'></span>
                                </InstagramLogin>
                              ) : (
                                <>
                                  <img src={CICON02} alt='' />
                                  <FormattedMessage
                                    id='verify_instagram'
                                    defaultMessage='Verify via Instagram'
                                  />
                                  <input
                                    type='checkbox'
                                    checked={
                                      profile?.portfolio.instagarm.isVerified
                                    }
                                    name=''
                                    value='intagram'
                                  />
                                  <span className='checkmark v2'></span>
                                </>
                              )}
                            </label>
                          </CustomCheckbox1>
                        </NFTForm>
                      </div> */}
                      <div id="socialLink">
                        <NFTtitle>
                          <h4 className="mt-30">
                            <FormattedMessage
                              id="social_links"
                              defaultMessage="Social Links"
                            />
                          </h4>
                          <p className="mb-30">
                            <FormattedMessage
                              id="social_links_label"
                              defaultMessage="Add your social media links for people to follow"
                            />
                          </p>
                        </NFTtitle>

                        <NFTForm>
                          <div className="label-line">
                            <label>
                              <FormattedMessage
                                id="website"
                                defaultMessage="Website"
                              />
                            </label>
                          </div>
                          <div className="iLeft">
                            <i>
                              <img src={CICON03} alt="" />
                            </i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="url"
                                  name="website"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.portfolio?.website
                                        ? profile.portfolio.website.url
                                        : ""
                                      : ""
                                  }
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                        </NFTForm>
                        <NFTForm>
                          <div className="label-line">
                            <label>Twitter</label>
                          </div>
                          <div className="iLeft">
                            <i>
                              <img src={CICON01} alt="" />
                            </i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="url"
                                  name="twitter"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.portfolio?.twitter
                                        ? profile.portfolio.twitter.url
                                        : ""
                                      : ""
                                  }
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                        </NFTForm>
                        <NFTForm>
                          <div className="label-line">
                            <label>Instagram</label>
                          </div>
                          <div className="iLeft">
                            <i>
                              <img src={CICON02} alt="" />
                            </i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="url"
                                  name="instagarm"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.portfolio?.instagarm
                                        ? profile.portfolio.instagarm.url
                                        : ""
                                      : ""
                                  }
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                        </NFTForm>

                        <NFTForm>
                          <div className="label-line">
                            <label>Discord</label>
                          </div>
                          <div className="iLeft">
                            <i>
                              <img src={CICON04} alt="" />
                            </i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="url"
                                  name="discord"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.portfolio?.discord
                                        ? profile.portfolio.discord.url
                                        : ""
                                      : ""
                                  }
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                        </NFTForm>
                        <NFTForm>
                          <div className="label-line">
                            <label>
                              <FormattedMessage
                                id="youtube"
                                defaultMessage="YouTube"
                              />
                            </label>
                          </div>
                          <div className="iLeft">
                            <i>
                              <img src={CICON05} alt="" />
                            </i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="url"
                                  name="youtube"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.portfolio?.youtube
                                        ? profile.portfolio.youtube.url
                                        : ""
                                      : ""
                                  }
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                        </NFTForm>
                        <NFTForm>
                          <div className="label-line">
                            <label>Facebook</label>
                          </div>
                          <div className="iLeft">
                            <i>
                              <img src={CICON06} alt="" />
                            </i>
                            <FormattedMessage
                              id="type_something"
                              defaultMessage="Type something…"
                            >
                              {(placeholder) => (
                                <input
                                  type="url"
                                  name="facebook"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                    }
                                  }}
                                  defaultValue={
                                    profile
                                      ? profile.portfolio?.facebook
                                        ? profile.portfolio.facebook.url
                                        : ""
                                      : ""
                                  } 
                                  placeholder={placeholder}
                                />
                              )}
                            </FormattedMessage>
                          </div>
                        </NFTForm>
                      </div>
                      <CreateItemButton>
                        <button
                          type="submit"
                          disabled={!formChange ? true : false}
                        >
                          <FormattedMessage
                            id="profile_update_button_label"
                            defaultMessage="Save Changes"
                          />
                        </button>
                      </CreateItemButton>
                    </form>
                  </NFTMiddle>
                </Gs.W605px>
              </Gs.W880px>
            </NFTminting>
          </Gs.Container>
        </div>
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
  .JCSB {
    justify-content: space-between;
  }
`;

const NFTminting = styled(FlexDiv)`
  align-items: flex-start;
  position: relative;
  margin: 60px 0px;
  .sticky {
    top: 20px !important;
  }
  .displayflex {
    display: flex;
    flex-wrap: wrap;
  }
`;

const NFTLeft = styled.div`
  margin: 0px 10px;
  ul {
    padding-left: 0px;
    margin: 0px;
  }
  .active {
    color: #000000;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.8px;
    margin: 0px 0px 15px;
    border-bottom: 3px solid #000;
    padding-bottom: 5px;
    display: inline-block;
  }
  a {
    display: block;
    margin: 0px 0px 22px;
    font-size: 18px;
    color: rgb(0 0 0 / 30%);
    font-weight: 600;
    letter-spacing: -0.8px;
    :hover {
      color: rgb(0 0 0 / 60%);
    }
    &.AdminLink {
      color: rgb(0 186 188 / 30%);
      :hover {
        color: rgb(0 186 188 / 60%);
      }
    }
  }
`;

const NFTRight = styled.div`
  margin: 0px 10px;
`;

const NFTtitle = styled.div`
  h4 {
    color: #000000;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -1.07px;
    margin: 0px 0px 9px;
    &.mt-30 {
      margin-top: 30px;
      ${Media.sm} {
        margin-top: 10px;
      }
    }
    &.text-till-blue {
      color: #00babc;
    }
  }
  p {
    color: #000000;
    font-size: 16px;
    letter-spacing: -0.8px;
    margin: 0px 0px 20px;
    &.mb-30 {
      margin-bottom: 30px;
    }
  }
`;

const NFTfourbox = styled(FlexDiv)`
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
        min-height: 44px;
      }
    }
  }
`;

Gs.W25V2 = styled(Gs.W25V2)`
  ${NFTfourbox}.nftnift & {
    width: 100%;
  }
`;

Gs.TenpxGutter = styled(Gs.TenpxGutter)`
  ${NFTfourbox}.nftnift & {
    margin: 0px;
  }
`;

Gs.W605px = styled(Gs.W605px)`
  ${NFTminting} & {
    ${Media.lg} {
      max-width: 100%;
    }
  }
`;
const NFTMiddle = styled.div`
  margin: 0px 40px;
  ${Media.lg} {
    margin: 0px 15px;
  }
  ${Media.sm} {
    margin: 0px;
  }
`;

const NFTForm = styled.div`
  position: relative;
  .label-line {
    margin: 0px 0px 6px;
    label {
      font-size: 16px;
      color: #8e9194;
      letter-spacing: -0.8px;
      font-weight: 600;
    }
    span {
      color: #8e9194;
      font-size: 12px;
      letter-spacing: -0.6px;
      margin-left: 6px;
    }
    p {
      color: #8e9194;
      font-size: 14px;
      letter-spacing: -0.7px;
      font-weight: 300;
      margin: 0px;
    }
  }
  input,
  select {
    width: 100%;
    height: 54px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.9px;
    margin: 0px 0px 30px;
    ::placeholder {
      color: #000;
      opacity: 20%;
    }
  }
  textarea {
    width: 100%;
    height: 110px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.9px;
    margin: 0px 0px 30px;
    ::placeholder {
      color: #000;
      opacity: 20%;
    }
  }
  .iLeft {
    position: relative;
    i {
      position: absolute;
      left: 15px;
      top: 16px;
      font-size: 18px;
      color: #000;
      font-weight: bold;
      img {
        position: relative;
        left: -7px;
        top: -4px;
      }
    }
    input {
      padding-left: 45px;
    }
  }
  .iRight {
    position: relative;
    i {
      position: absolute;
      right: 15px;
      top: 17px;
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }
    input {
      padding-right: 45px;
    }
  }
  .errorinput {
    position: relative;
    input {
      border-color: #ff2a44;
    }
    p.error {
      color: #ff2a44;
      font-size: 12px;
      letter-spacing: -0.6px;
      font-weight: 600;
      margin: 0px;
      position: absolute;
      top: 18px;
      right: 15px;
    }
  }
`;

const FileuploadBox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  border-radius: 10px;
  width: 100%;
  height: 100px;
  margin: 0px 0px 60px;
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
    cursor: pointer;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

const CreateItemButton = styled.div`
  margin: 50px 0px 80px;
  button {
    font-size: 14px;
    color: #fff;
    letter-spacing: -0.5px;
    padding: 13px 60px;
    cursor: pointer;
    border-radius: 15px;
    background-color: rgb(0 0 0 / 30%);
    :hover {
      background-color: #000;
    }
  }
  ${Media.sm} {
    margin: 30px 0px 40px;
    text-align: center;
  }
`;

const CustomRadio1 = styled(FlexDiv)`
  justify-content: flex-start;
  margin-bottom: 30px;
  .radio-container {
    display: flex;
    align-items: center;
    position: relative;
    height: 54px;
    width: calc(170px - 5px);
    margin-right: 10px;
    cursor: pointer;
    padding-left: 15px;
    line-height: 54px;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.9px;
    color: #000;
    img {
      margin-right: 5px;
    }
  }
  .radio-container input {
    position: absolute;
    left: 0;
    opacity: 0;
    cursor: pointer;
    margin: 0px;
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 54px;
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    border: 1px solid #dddddd;
  }
  .radio-container input:checked ~ .checkmark {
    border: 1px solid #00babc;
  }
`;

const CustomCheckbox1 = styled(FlexDiv)`
  justify-content: flex-start;
  margin-bottom: 30px;
  .checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    height: 54px;
    width: calc(257px - 5px);
    margin-right: 10px;
    cursor: pointer;
    padding-left: 15px;
    line-height: 54px;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.9px;
    color: #000;
    button {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0px;
      letter-spacing: -0.9px;
      font-weight: 700;
      :hover {
        background-color: transparent !important;
      }
    }
    img {
      margin-right: 5px;
    }
    ${Media.lg} {
      margin: 0px 10px 10px 0px;
    }
  }
  .checkbox-container input {
    position: absolute;
    left: 0;
    opacity: 0;
    cursor: pointer;
    margin: 0px;
  }
  .checkbox-container button:hover {
    background-color: #f7f7f7;
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 54px;
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    border: 1px solid #dddddd;
  }
  .checkmark.v2:hover {
    border: 1px solid #00babc;
  }
  .checkbox-container input:checked ~ .checkmark {
    border: 1px solid #00babc;
  }
`;

const CollectionSelect = styled(FlexDiv)`
  margin-bottom: 60px;
  position: relative;
  select {
    margin-bottom: 0px;
    -webkit-appearance: none;
    background: url(${DDdownA}) no-repeat 97% 55%;
    option {
      border-radius: 10px;
      box-shadow: 0 10px 20px 0 rgb(0 0 0 / 30%);
      margin: 30px;
    }
  }
  button {
    font-size: 14px;
    letter-spacing: -0.5px;
    color: #000;
    font-weight: 700;
    border-radius: 15px;
    border: 1px solid #000000;
    padding: 16px 20px;
    margin-left: 10px;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

const AccountBX = styled(FlexDiv)`
  position: absolute;
  top: 37px;
  right: 0px;
  width: auto;
  justify-content: flex-end;
  padding: 8px 10px;
  z-index: 101;
  cursor: pointer;
  & i {
    width: 50px;
    height: 50px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  & span {
    font-size: 18px;
    letter-spacing: -0.9px;
    font-weight: 700;
    color: #000;
    display: block;
    text-align: right;
    line-height: 16px;
    padding-right: 8px;
    span {
      font-size: 10px;
      color: #b3b3b3;
      width: 100%;
      padding-right: 0;
    }
  }
`;

const DDBtnbar02 = styled(FlexDiv)`
  width: 100%;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #eef2f7;
    & i {
      width: 34px;
      height: 34px;
      margin: 0 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    & span {
      margin-left: auto;
    }
    &:nth-last-child(01) {
      border-bottom: 0px;
    }
    &:hover {
      background-color: #d9f5f5;
    }
  }
`;

const DDContainer = styled(FlexDiv)`
  position: absolute;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  top: calc(100% + 30px);
  width: 200px;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  z-index: 100;
  &.ver2 {
    width: 150px;
    left: auto;
    transform: translateX(0);
    right: 0;
    top: calc(100% + 20px);
    padding: 0;
  }
`;

const BackBTN01 = styled.button`
  border: 1px solid #000000;
  border-radius: 10px;
  padding: 0 30px;
  height: 44px;
  margin: 60px 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 60px auto 0 auto;
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
const CloseBTN = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
  top: 27px;
  padding: 0;
  margin: 0px;
  :hover {
    transform: rotate(90deg);
  }
  ${Media.xs} {
    right: 15px;
    top: 15px;
  }
`;
const AlertNote = styled.div`
  background-color: #ffe5e9;
  border: 1px solid #ff2a44;
  border-radius: 10px;
  margin: 0px 0px 40px;
  padding: 17px 15px;
  p {
    margin: 0px;
    color: #000000;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.8px;
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(actions.getProfile()),
    setProfile: (params) => dispatch(actions.updateUserDetails(params)),
    clearErrors: () => dispatch({ type: "API_FAILED", data: null }),
    sendInstaCode: (code) => dispatch(actions.sendInstagramCode(code)),
    getTwitterAccessToken: () => dispatch(actions.getTwitterAccessToken()),
    verifyByTwitter: (token, verifier) =>
      dispatch(actions.verifyByTwitter(token, verifier)),
  };
};
const mapStateToProps = (state) => {
  return {
    profile: state.fetchProfile,
    updated: state.updateProfile,
    error: state.fetchResponseFailed,
    verified_by_insta: state.verified_by_instagram,
    access_token: state.fetch_twitter_access_token,
    verified_by_twitter: state.verified_by_twitter,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDipatchToProps)(ProfileEdit)
);
