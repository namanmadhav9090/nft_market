import React, { Component, useState } from "react";
import { FormattedMessage } from "react-intl";
import loadable from '@loadable/component';
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import Media from "./../Theme/media-breackpoint";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import { actions } from "../actions";
import LogoImg from "../Assets/images/logo-white.svg";

const Language = loadable(() => import('./lang.switch'))
const Login = loadable(() => import('./Modals/login'))
const BecomeCreator = loadable(() => import('../Component/Modals/become-creator'))


function Footer(props) {
  
  const { web3Data, authData: userDetails } = props;

  const checkRole = (user) => {
    if (user.role.roleName === "COLLECTOR") {
      return <BecomeCreator isFooter={true} />;
    } else if (user.role.roleName === "CREATOR" && user.status === "APPROVED") {
      return (
      <AvBTN01 className='createButton'>
          <Link to="/user/nftminting">
            <FormattedMessage id="create" defaultMessage="Create" />
          </Link>
        </AvBTN01>
      );
    } else if (user.role.roleName === "CREATOR" && user.status !== "APPROVED") {
      return <AvBTN01 className='createButton'>
        <FormattedMessage id="waitlist" defaultMessage="Waitlist" />
      </AvBTN01>;
    }
  };
  const toggle = (index) => {
    setIsOpen4(!isOpen4);
  };
  const [isOpen4, setIsOpen4] = useState(false);
  return (
    <>
      <FooterMBX>
        <FooterSbx01>
          <FooterSSbx01>
            <Link to="/">
              <img src={LogoImg} alt="" className="footer-logo" />
            </Link>
            <p>
              <FormattedMessage id="footer_text" />
            </p>

            <button onClick={() => props.history.push("/about")}>
              <FormattedMessage id="learn_more" defaultMessage="Learn More" />
            </button>
          </FooterSSbx01>
          <FooterSSbx02>
            <NavLink to="/marketplace">
              <FormattedMessage id="marketplace" defaultMessage="Marketplace" />
            </NavLink>
            <NavLink to="/collections">
              <FormattedMessage id="collections" defaultMessage="Collections" />
            </NavLink>
            <NavLink to="/creators">
              <FormattedMessage id="creators" defaultMessage="Creators" />
            </NavLink>
            {/* {!web3Data.isLoggedIn ?
              <NavLink to="">
                <FormattedMessage
                  id="become_a_creator"
                  defaultMessage="Become a Creator"
                />
                </NavLink>
            : ``} */}
          </FooterSSbx02>
          <FooterSSbx02>
            <NavLink to="/legal">
              <FormattedMessage
                id="term_of_service"
                defaultMessage="Terms of Service"
              />
            </NavLink>
            <NavLink to="/legal">
              <FormattedMessage
                id="privacy_policy"
                defaultMessage="Privacy Policy"
              />
            </NavLink>
            <NavLink to="/legal">
              <FormattedMessage
                id="cookie_policy"
                defaultMessage="Cookie Policy"
              />
            </NavLink>
          </FooterSSbx02>
          <FooterSSbx02>
            <NavLink to={{ pathname: "https://www.instagram.com/carny.io/" }} target="_blank">Instagram</NavLink>
            <NavLink to={{ pathname: "https://twitter.com/carny_io" }} target="_blank">Twitter</NavLink>
            <NavLink to={{ pathname: "https://discord.com/invite/SkPAgNz4" }} target="_blank">Discord</NavLink>
            <NavLink to={{ pathname: "https://medium.com/@Carny.io" }} target="_blank"><FormattedMessage
                id="blog"
                defaultMessage="Blog"
              /></NavLink>
          </FooterSSbx02>
          <FooterSSbx02>
            <NavLink to="/how-to-use"><FormattedMessage
                id="how_to_use?"
                defaultMessage="How to use"
              /></NavLink>
            <NavLink to="/faq"><FormattedMessage
                id="faq"
                defaultMessage="FAQ"
            /></NavLink>
            <a href="mailto:admin@carny.io">
              <FormattedMessage
                id="support"
                defaultMessage="Support"
              />
            </a>
            {/* <NavLink to="">
              <FormattedMessage
                id="support"
                defaultMessage="Support"
              /></NavLink> */}
          </FooterSSbx02>

          <FooterSSbx03>
            {!web3Data.isLoggedIn ? (
              <>
                <AvBTN01 onClick={() => toggle()}>
                  <FormattedMessage id="login" defaultMessage="Login" />
                </AvBTN01>
               
              </>
            ) : userDetails && userDetails.status === true ? (
              checkRole(userDetails.data)
            ) : (
              ""
            )}
            <Language header={false} />
          </FooterSSbx03>
        </FooterSbx01>
        <FooterBottom>
          <FooterSbx01 className="withborder">
            <p>© 2021</p>
            <FooterrightLinks>
              <Link to={{ pathname: "https://www.instagram.com/carny.io/" }} target="_blank">Instagram</Link>
              <Link to={{ pathname: "https://twitter.com/carny_io" }} target="_blank">Twitter</Link>
              <Link to={{ pathname: "https://discord.com/invite/SkPAgNz4" }} target="_blank">Discord</Link>
              <Link to={{ pathname: "https://medium.com/@Carny.io" }} target="_blank"><FormattedMessage
                  id="blog"
                  defaultMessage="Blog"
                /></Link>
            </FooterrightLinks>
          </FooterSbx01>
        </FooterBottom>
      </FooterMBX>
      {isOpen4?<Login toggle={toggle} />:``}
    </>
  );
}

// }
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const FooterMBX = styled.div`
  padding: 40px 15px;
  background-color: #2d2d2d;
  width: 100%;
`;
const FooterSbx01 = styled(FlexDiv)`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  align-items: flex-start;
  justify-content: flex-start;
  ${Media.sm}{
    justify-content: space-between;
  }
  &.withborder
  {
    border-top:1px solid #fff;
    margin:30px auto 0px;
    justify-content:space-between;
    padding:15px 0px 0px;
  }
`;
const FooterSSbx01 = styled(FlexDiv)`
  width: 36%;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  img.footer-logo{
    width:80px;
    height:34px;
    ${Media.sm}{
      width:66px;
      height:28px;
    }
  }
  ${Media.sm}{
    width:50%;
  }
  p {
    color: #fff;
    max-width: 320px;
    font-size: 12px;
    line-height: 22px;
    font-weight: 400;
    ${Media.sm}{
      font-size: 10px;
      line-height: 20px;
    }
  }
  button {
    color: #fff;
    background-color: transparent;
    border: 0;
    outline: none;
    padding: 0;
    font-size: 12px;
    text-decoration: underline;
    :hover {
      color: #d327ce;
    }
  }
`;

const FooterSSbx02 = styled(FlexDiv)`
  width: 12.2%;
  padding-right: 8px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 48px;
  a {
    font-size: 12px;
    font-weight: 400;
    color: #fff;
    margin-bottom: 8px;
    :hover {
      text-decoration: underline;
    }
  }
  ${Media.sm}{
    display:none;
  }
`;
const FooterSSbx03 = styled(FlexDiv)`
  width: 15.2%;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  padding-top: 48px;
  ${Media.sm}{
    width:50%;
    padding-top:0px;
  }
`;

const AvBTN01 = styled.button`
  padding: 9px 25px;
  color: #fff;
  background-color: #000;
  border-radius: 15px;
  font-size:14px;
  :hover {
    background-color: #d121d6;
    -webkit-box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
    box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
  }
  &.createButton{
    a{
      color:#fff;
    }
  }
  ${Media.md}{
    padding: 9px 20px;
  }
  ${Media.sm}{
    padding: 9px 15px;
  }
`;

const LanBTN = styled(FlexDiv)`
  margin-left: 30px;
  position: relative;
  margin-top: 50px;
  button {
    font-size: 12px;
    font-weight: 400;
    color: #fff;
  }
  ${Media.sm}{
    margin-top: 32px;
  }
`;
const DDContainer = styled(FlexDiv)`
  position: absolute;
  background-color: #fff;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  bottom: calc(100% + 5px);
  width: 200px;
  right: 0;
  overflow: hidden;
  z-index: 100;
  &.ver2 {
    width: 300px;
    left: auto;
    transform: translateX(0);
    right: 0;
    top: calc(100% + 20px);
    padding: 0;
  }
  &.ver3 {
    width: 300px;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 34px);
    padding: 0;
  }
`;
const DDBtnbar01 = styled(FlexDiv)`
  font-size: 16px;
  color: #b3b3b3;
  font-weight: 600;
  button {
    font-size: 16px;
    padding: 0 10px;
    margin: 0 6px;
    color: #b3b3b3;
    &.active {
      color: #000;
    }
    :hover {
      color: #000;
    }
  }
`;

const FooterBottom = styled.div`
  display:none;
  p
  {
    font-size:12px;
    color:#fff;
    letter-spacing:-0.6px;
    font-weight:500;
    margin:0px;
  }
  ${Media.sm}{
    display:block;
  }
`;

const FooterrightLinks = styled(FlexDiv)`
  a{
    font-size:12px;
    color:#fff;
    letter-spacing:-0.6px;
    font-weight:500;
    margin:0px 20px 0px 0px;
    :hover
    {
      color:#f40058;
    }
    :last-child
    {
      margin-right:0px;
    }
  }
`;


const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: () => dispatch(actions.getWeb3()),
    enableMetamask: () => dispatch(actions.enableMetamask()),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    authLogin: (nonce, signature) =>
      dispatch(actions.authLogin(nonce, signature)),
    authenticateUser: () => dispatch(actions.authenticateUser()),
    getUserDetails: () => dispatch(actions.getUserDetails()),
    authLogout: () => dispatch({ type: "AUTH_LOGIN", data: null }),
    web3Logout: () =>
      dispatch({
        type: "FETCH_WEB3_DATA",
        data: { isLoggedIn: false, accounts: [] },
      }),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.fetchWeb3Data,
    networkId: state.fetchNetworkId,
    isMetamaskEnabled: state.fetchMetamask,
    nonce: state.fetchNonce,
    authData: state.fetchAuthData,
  };
};
export default withRouter(connect(mapStateToProps, mapDipatchToProps)(Footer));
