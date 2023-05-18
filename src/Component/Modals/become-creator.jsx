import styled from "styled-components";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import CloseBTN01 from "../../Assets/images/closeBTN01.svg";

import { actions } from "../../actions";
import { Context } from '../../Component/wrapper';
import { services } from "../../services";
import Media from "./../../Theme/media-breackpoint";
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

class BecomeCreator extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      isOpen2: false,
      isOpen3: false,
      isOpen4: false,
      loading: false,
      category: [],
      becomeCreator: false,
      errors: { name: false, email: false, bio: false, category: false },
    };
  }

  async componentDidMount() {
    const { categories } = this.props;
    if (!categories) {
      this.props.getCategories(); // fetch categories config
    }
  }

  onFormChange = (event) => {
    if (event.target.name === "category") {
      if (event.target.checked && (this.state.category.length < 2)) {
        this.setState({ category: [...this.state.category, event.target.value] })
      }
      else this.setState({ category: this.state.category.filter(id => id !== event.target.value) })
    } else this.setState({ [event.target.name]: event.target.value })
  }

  onFormSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      bio,
      instagram,
      website,
      category,
      twitter,
    } = this.state;
    const userObj = {
      name: name,
      email: email,
      bio: bio,
      portfolio: {
        instagarm: { url: instagram },
        website: { url: website },
        twitter: { url: twitter },
      },
      isCreator: true,
      category: category,
    };
    this.setState({ loading: true }); // start loading
    this.updateUser(userObj);
  };

  updateUser = async (obj) => {
    this.setState({ loading: false }); // stop loading
    const request = services.put(`user/update`, obj);
    request
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        if (response.status === 200) {
          this.setState({
            isOpen1: false,
            isOpen2: false,
            isOpen3: false,
            becomeCreator: true,
            errors: { name: false, email: false, bio: false },
            category: [],
          });
        }
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401 || e.response.status === 403) {
            localStorage.removeItem("avangartAuthToken");
          }
          // other error code (404, 500, etc): no need to log out
        }
      });
  };

  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };

  clickHandler = (e) => {
    e.preventDefault();
    if (!this.state.becomeCreator) {
      this.setState({ isOpen1: true });
    }
  }

  nextButtonHandler = (type) => {
    let {
      name,
      email,
      bio,
      category,
    } = this.state
    if (type) {
      let errors = { ...this.state.errors, name: false, email: false, bio: false }
      if (!name) errors.name = true
      if (!email) errors.email = true;
      if (!bio) errors.bio = true
      if (!/.+@.+\.[A-Za-z]+$/.test(email)) errors.email = true;
      if (!errors.name && !errors.email && !errors.bio) this.setState({ isOpen2: true })
      this.setState({ errors: errors })
    } else {
      let errors = { ...this.state.errors, category: false }
      if (category.length === 0) errors.category = true
      if (category.length !== 0) this.setState({ isOpen3: true })
      this.setState({ errors: errors })
    }
  }

  render() {
    const { categories } = this.props;
    const {
      isOpen1,
      isOpen2,
      isOpen3,
      loading,
      becomeCreator,
      isOpen4,
      errors,
    } = this.state;

    const { isProfile, isFooter } = this.props;
    let context = this.context;
    return (
      <>

        <AvBTN02 className={becomeCreator ? isFooter ? `` : `grayBTN` : isProfile ? `ani-1 borderBTN` : ``}
          onClick={(e) => this.clickHandler(e)}>
          {!becomeCreator ?
            isProfile ?
              <FormattedMessage id="apply" defaultMessage="Apply" />
              : <FormattedMessage id="become_a_creator" defaultMessage="Become a Creator" />
            : <FormattedMessage id="waitlist" defaultMessage="Waitlist" />}
        </AvBTN02>

        <form onChange={this.onFormChange} onSubmit={this.onFormSubmit}>
          {isOpen1 ? (
            <BlackWrap>
              <WhiteBX02>
                <CloseBTN
                  className="ani-1"
                  onClick={() => {
                    this.setState({ isOpen1: false });
                  }}
                >
                  <img src={CloseBTN01} alt="" />
                </CloseBTN>

                <BACLeft>
                  <BACLtitle>
                    <FormattedMessage id="who_are_you?" defaultMessage="Who are you?" />
                  </BACLtitle>
                  <BACLdesc>
                    <FormattedMessage id="who_are_you_label" defaultMessage="Tell us about yourself to join notable artists and creators" />
                  </BACLdesc>
                  <BACLlist>
                    <Link className="active" to="/">
                      01
                    </Link>
                    <Link to="/">02</Link>
                    <Link to="/">03</Link>
                  </BACLlist>
                </BACLeft>
                <BACRight>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="form_name" defaultMessage="Name" />
                        <sup>*</sup>
                      </label>
                    </div>
                    <FormattedMessage
                      id="type_something"
                      defaultMessage="Type something…"
                    >
                      {(placeholder) => (
                        <input
                          className={errors.name ? `error` : ``}
                          type="text"
                          placeholder={placeholder}
                          name="name"
                        />)}
                    </FormattedMessage>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="form_email" defaultMessage="Email" />
                        <sup>*</sup>
                      </label>
                    </div>
                     <FormattedMessage
                        id="type_something"
                        defaultMessage="Type something…"
                      >
                        {(placeholder) => (
                          <input
                            className={errors.email ? `error` : ``}
                            type="text"
                            placeholder={placeholder}
                            name="email"
                          />
                        )}
                      </FormattedMessage>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="tell_about_us" defaultMessage="Tell us about yourself" />
                        <sup>*</sup>
                      </label>
                    </div>
                    <FormattedMessage
                        id="type_something"
                        defaultMessage="Type something…"
                      >
                      {(placeholder) => (
                          <textarea
                            placeholder={placeholder}
                            className={errors.bio ? `error` : ``}
                            name="bio">
                          </textarea>
                        )}
                      </FormattedMessage>
                  </NFTForm>
                  <CreateItemButton>
                    <button
                      type="button"
                      onClick={() => {
                        this.nextButtonHandler(true)
                      }}
                    >
                      <FormattedMessage id="next" defaultMessage="Next" />
                    </button>
                  </CreateItemButton>
                </BACRight>
              </WhiteBX02>
            </BlackWrap>
          ) : (
            ""
          )}


          {isOpen2 ? (
            <BlackWrap>
              <WhiteBX02>
                <CloseBTN
                  className="ani-1"
                  onClick={() => {
                    this.setState({ isOpen2: false, isOpen1: false });
                  }}
                >
                  <img src={CloseBTN01} alt="" />
                </CloseBTN>

                <BACLeft>
                  <BACLtitle>
                    <FormattedMessage id="whats_your_style?" defaultMessage="What's your style?" />
                  </BACLtitle>
                  <BACLdesc>
                    <FormattedMessage id="whats_your_style_label" defaultMessage="Your profile will be displayed under selected NFT categories if your creator status is approved" />
                  </BACLdesc>
                  <BACLlist>
                    <Link to="/">01</Link>
                    <Link className="active" to="/">
                      02
                    </Link>
                    <Link to="/">03</Link>
                  </BACLlist>
                </BACLeft>
                <BACRight>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="nft_category" defaultMessage="NFT Category" />
                      </label>
                      <p>
                        <FormattedMessage id="nft_category_label" defaultMessage="You can choose two categories at most" />
                      </p>
                      {errors.category ?
                        <p className="error-text">Please select at least one category</p>
                        : ``}
                    </div>
                    <CustomScrollbars
                      autoHide
                      autoHideTimeout={1000}
                      style={{
                        width: '100%',
                        height: '233px',
                        position: 'relative',
                      }}
                    >
                      <CustomCheckbox1>
                        {categories
                          ? categories.map((category, index) => {
                            return (
                              <label className="checkbox-container">
                                <img
                                  src={category.image}
                                  alt=""
                                  style={{
                                    maxWidth: "32px",
                                    maxHeight: "32px",
                                  }}
                                />
                                {context.locale === 'tr' ? category.categoryName.tu : category.categoryName.en}
                                <input
                                  type="checkbox"
                                  name="category"
                                  className="single-checkbox"
                                  value={category.id}
                                  onChange={(event) => {
                                    if (this.state.category.length > 1) {
                                      event.target.checked = false;
                                    }
                                  }}
                                />
                                <span className="checkmark"></span>
                              </label>
                            );
                          })
                          : ""}
                      </CustomCheckbox1>
                    </CustomScrollbars>
                  </NFTForm>
                  <CreateItemButton>
                    <button
                      type="button"
                      onClick={() => {
                        this.setState({ isOpen1: true, isOpen2: false });
                      }}
                    >
                      <FormattedMessage id="previous" defaultMessage="Previous" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        this.nextButtonHandler(false)
                      }}
                    >
                      <FormattedMessage id="next" defaultMessage="Next" />
                    </button>
                  </CreateItemButton>
                </BACRight>
              </WhiteBX02>
            </BlackWrap>
          ) : (
            ""
          )}

          {isOpen3 ? (
            <BlackWrap>
              <WhiteBX02>
                <CloseBTN
                  className="ani-1"
                  onClick={() => {
                    this.setState({
                      isOpen3: false,
                      isOpen2: false,
                      isOpen1: false,
                    });
                  }}
                >
                  <img src={CloseBTN01} alt="" />
                </CloseBTN>
                <BACLeft>
                  <BACLtitle>
                    <FormattedMessage id='promote_yourself' defaultMessage='Promote yourself!' />
                  </BACLtitle>
                  <BACLdesc>
                    <FormattedMessage id="promote_yourself_lable" defaultMessage="Let us know about your portfolio and social links, which will drastically increase your chance of becoming a creator." />
                  </BACLdesc>
                  <BACLlist>
                    <Link to="/">01</Link>
                    <Link to="/">02</Link>
                    <Link className="active" to="/">
                      03
                    </Link>
                  </BACLlist>
                </BACLeft>
                <BACRight>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="portfolio_website" defaultMessage="Portfolio website" />
                      </label>
                    </div>
                    <FormattedMessage
                        id="type_something"
                        defaultMessage="Type something…"
                      >
                        {(placeholder) => (
                          <input
                            type="text"
                            name="website"
                            placeholder={placeholder}
                          />
                        )}
                      </FormattedMessage>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="instagram_account" defaultMessage="Instagram account" />
                      </label>
                    </div>
                    <FormattedMessage
                        id="type_something"
                        defaultMessage="Type something…"
                      >
                        {(placeholder) => (
                          <input
                            type="text"
                            name="instagram"
                            placeholder={placeholder}
                          />
                        )}
                    </FormattedMessage>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                      <label>
                        <FormattedMessage id="twitter_account" defaultMessage="Twitter account" />
                      </label>
                    </div>
                    <FormattedMessage
                        id="type_something"
                        defaultMessage="Type something…"
                      >
                        {(placeholder) => (
                          <input
                            type="text"
                            name="twitter"
                            placeholder={placeholder}
                          />
                        )}
                    </FormattedMessage>
                  </NFTForm>
                  <CreateItemButton>
                    <button
                      type="button"
                      onClick={() => {
                        this.setState({ isOpen2: true, isOpen3: false });
                      }}
                    >
                      <FormattedMessage id="previous" defaultMessage="Previous" />
                    </button>
                    <button type="submit" disabled={loading}>
                      {loading ? "loading.." : <FormattedMessage id="submit" defaultMessage="Submit" />}
                    </button>
                  </CreateItemButton>
                </BACRight>
              </WhiteBX02>
            </BlackWrap>
          ) : (
            ""
          )}
        </form>

        {!isOpen4 && becomeCreator ? (
          <>
            <BlackWrap>
              <WhiteBX01>
                <CloseBTN className="ani-1" onClick={() => this.toggle(4)}>
                  {" "}
                  <img src={CloseBTN01} alt="" />{" "}
                </CloseBTN>

                <TokenBox>
                  <WGTitle>
                    <FormattedMessage id="we_got_submission" defaultMessage="We got your Submission!" />
                  </WGTitle>
                  <p>
                    <FormattedMessage id="submission_label_1" defaultMessage="Result of your application will be delivered over email. Applications are handled in badges, so it can take some time to go over yours. Thanks for your patience." />
                  </p>
                  <p>
                    <FormattedMessage id="submission_label_2" defaultMessage="If you have a concern about your form being submitted correctly, you can contact us." />
                  </p>
                  <button onClick={() => {
                    this.props.getUserDetails(); //update the user details  
                    this.toggle(4)
                  }
                  }>
                    <FormattedMessage id="ok" defaultMessage="OK" />
                  </button>
                </TokenBox>
              </WhiteBX01>
            </BlackWrap>
          </>
        ) : (
          ""
        )}
      </>
    );
  }
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const BlackWrap = styled(FlexDiv)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1011;
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
const CloseBTN = styled.button`
  width: 20px !important;
  height: 20px !important;
  position: absolute;
  right: 20px;
  top: 27px;
  padding: 0;
  margin: 0px;
  z-index: 9;
  :hover {
    transform: rotate(90deg);
  }
 
  ${Media.xs}{
    right: 15px;
    top: 15px;
  }
`;
const TokenBox = styled(FlexDiv)`
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
  button {
    height: 100%;
    width: 60%;
    color: #000000;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.5px;
    padding: 13px 35px;
    border-radius: 15px;
    border: 1px solid #000000;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
`;
const TokenLeft = styled.div`
  p {
    color: #000000;
    font-size: 16px;
    letter-spacing: -0.8px;
    font-weight: 600;
    margin: 0px;
    &.small {
      color: rgb(0 0 0 / 23%);
      margin: 0px;
      font-size: 12px;
      letter-spacing: -0.6px;
    }
  }
`;

const WhiteBX02 = styled.div`
  width: 100%;
  position: relative;
  max-width: 720px;
  margin: 0 15px;
  min-height: 518px;
  background-color: #fff;
  border-radius: 30px;
  display: flex;
  ${Media.sm}{
    display:block;
    max-height:500px;
    overflow-y:auto;
  }
`;

const BACLeft = styled.div`
  background-color: #eef2f7;
  padding: 60px 50px;
  max-width: 320px;
  width: 100%;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  ${Media.md}{
    text-align:left;
  }
  ${Media.sm}{
    max-width: 100%;
    border-top-right-radius: 30px;
    border-bottom-left-radius: 0px;
    padding:60px 25px 40px;
  }
`;

const BACLtitle = styled.div`
  color: #000;
  font-size: 22px;
  letter-spacing: -0.55px;
  margin: 0px 0px 15px;
  font-weight: bold;
  ${Media.sm}{
    font-size:24px;
  }
`;

const BACLdesc = styled.div`
  color: #000;
  font-size: 16px;
  letter-spacing: -0.8px;
  margin: 0px 0px 30px;
  ${Media.sm}{
    font-size: 14px;
  }
`;

const BACLlist = styled.div`
  a {
    color: rgb(0 0 0 / 20%) !important;
    font-size: 12px !important;
    font-weight: bold;
    letter-spacing: -0.6px !important;
    margin: 0px 20px 0px 0px !important;
    &.active {
      color: rgb(0 0 0 / 100%) !important;
    }
    ${Media.md}{
     padding:0px !important;
    }
  }
`;

const BACRight = styled.div`
  padding: 60px 50px;
  width: 100%;
  position: relative;
  ${Media.md}{
    text-align:left;
  }
  ${Media.sm}{
    padding: 40px 25px;
  }
`;

const NFTForm = styled.div`
  position: relative;
  // .view{
  //   width:100%;
  // }
  .label-line {
    margin: 0px 0px 6px;
    label {
      font-size: 12px;
      color: #8e9194;
      font-weight: 600;
    }
    sup {
      top: -0.1em;
    }
    p {
      color: #8e9194;
      font-size: 12px;
      letter-spacing: -0.4px;
      font-weight: 300;
      margin: 0px;
    }
    p.error-text {
      color: #ff2a44;
      font-size: 12px;
      font-weight: 500;
      margin: 0px;
    }
  }
  input {
    width: 100%;
    height: 54px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    color: #000000;
    letter-spacing: -0.9px;
    margin: 0px 0px 15px;
    ::placeholder {
      color: #000;
      opacity: 20%;
    }
  }
  .error {
    border: 1px solid #ff2a44;
  }
  textarea {
    width: 100%;
    min-height: 109px;
    line-height: 24px;
    resize: none;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.8px;
    margin: 0px 0px 15px;
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

const CreateItemButton = styled.div`
  margin: 0px;
  position: absolute;
  right: 50px;
  left: auto;
  bottom: 60px;
  button {
    font-size: 14px;
    color: #000;
    letter-spacing: -0.5px;
    width: 100px !important;
    height: 44px !important;
    margin: 0px 0px 0px 5px;
    cursor: pointer;
    border-radius: 15px;
    border: 1px solid #000;
    :hover {
      background: linear-gradient(90deg, #d121d6, #febf11);
      color: #fff;
      border: none;
    }
  }
  ${Media.sm}{
    position:initial;
    margin: 20px auto 0px;
    text-align: right;
  }
`;

const CustomCheckbox1 = styled(FlexDiv)`
  justify-content: flex-start;
  // margin-bottom: 30px;
  .checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    height: 54px;
    width: 100%;
    margin: 0px 0px 5px 0px;
    cursor: pointer;
    padding-left: 15px;
    line-height: 54px;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.8px;
    color: #000;
    img {
      margin-right: 5px;
    }
  }
  .checkbox-container input {
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
  .checkbox-container input:checked ~ .checkmark {
    border: 1px solid #00babc;
  }
`;

const AvBTN02 = styled.button`
  padding: 11px 23px;
  font-size: 12px;
  color: #fff;
  background-color: #000;
  border-radius: 15px;
  ${Media.xs}{
    padding: 9px 15px;
  }
  :hover {
    background-color: #d121d6;
    -webkit-box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
    box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
  }
  &.grayBTN {
    background-color: #b2b2b2;
    :hover {
      background-color: #878787;
    }
  }
  &.colorBTN {
    background: #d121d6;
    background: -moz-linear-gradient(left, #d121d6 0%, #febf11 100%);
    background: -webkit-linear-gradient(left, #d121d6 0%, #febf11 100%);
    background: linear-gradient(to right, #d121d6 0%, #febf11 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d121d6', endColorstr='#febf11',GradientType=1 );
    color: #fff;
    :hover {
      filter: brightness(0.9);
    }
  }
  &.borderBTN{
    padding:13px 44px;
    font-size: 14px;
    color:#000;
    background-color:#fff;
    border:1px solid #000;
    letter-spacing:-0.5px;
    border-radius: 15px;
    :hover {
      background-color:#000; color:#fff;
      -webkit-box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
      box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
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
const WGTitle = styled.div`
  color: #000000;
  font-size: 24px;
  line-height:28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;
const WGdescText = styled.div`
  color: #000000;
  font-size: 14px;
  letter-spacing: -0.7px;
  margin-bottom: 10px;
  text-align: center;
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getCategories: () => dispatch(actions.fetchCategories()),
    getUserDetails: () => dispatch(actions.getUserDetails()),
  };
};

const mapStateToProps = (state) => {
  return {
    categories: state.fetchCategory,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(BecomeCreator);
