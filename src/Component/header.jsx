import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import loadable from "@loadable/component";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Media from "../Theme/media-breackpoint";
import Collapse from "@kunukn/react-collapse";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { actions } from "../actions";
import LogoImg from "../Assets/images/logo.svg";
import NotifiIcon from "../Assets/images/notification.svg";
import UserIcon from "../Assets/images/user-img.jpg";
import RightArrow from "../Assets/images/rightArrow.svg";
import DisconnectICO from "../Assets/images/icon-disconnect.svg";
import { web3, walletConnectProvider } from "../web3";
import IconMenuOpen from "../Assets/images/icon-set-menu.svg";
import IconMenuClose from "../Assets/images/icon-set-close.svg";
import LogoImgWhite from "../Assets/images/logo-white.svg";
import IconMenuOpenWhite from "../Assets/images/icon-set-menu-white.svg";
import IconMenuCloseWhite from "../Assets/images/icon-set-close-white.svg";
import NotifiIconWhite from "../Assets/images/notification-white.svg";
import { Scrollbars } from "react-custom-scrollbars";

const Language = loadable(() => import("./lang.switch"));
const Login = loadable(() => import("./Modals/login"));
const BecomeCreator = loadable(() => import("./Modals/become-creator"));
const Notifications = loadable(() =>
  import("../Component/header/notification")
);

function CustomScrollbars(props) {
  return (
    <Scrollbars
      renderTrackVertical={(props) => (
        <div {...props} className="track-vertical" />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical" />
      )}
      renderView={(props) => <div {...props} className="notification-view" />}
      autoHide
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}

class Header extends Component {
  constructor(props) {
    super(props);
   
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      isOpen1: false,
      isOpen2: false,
      isOpen3: false,
      isOpen4: false,
      web3Data: {
        isLoggedIn: false,
        accounts: [],
      },
      solsData:{
         isLogin: false,
         account: [],
      },
      loader: false,
      error: { isError: false, msg: "" },
      userDetails: null,
      accountBalance: 0,
      compactUserAddress: "00000000000",
      // networkError: false
    };
  }
  static async getDerivedStateFromProps(nextProps, prevState) {
    let { solData } = nextProps;
    let { web3Data } = nextProps;
    let { getSolana,getWeb3 } = nextProps;
    // getWeb3();
    // console.log(web3Data);
    // console.log(solData);
    if (web3Data !== prevState.web3Data) return { web3Data: web3Data };
  }
  async componentDidUpdate(prevProps, prevState) {
    let { web3Data, authData, solData } = this.props;
    // console.log(solData.isLogin)
    // console.log(authData);
    const { solsData } = prevState;
    // console.log(solsData);
    // console.log(web3Data);
    console.log(solData);

    if(solData.isLogin !== solsData.isLogin){
      this.setState({solsData : solData});
      this.props.generateSolNonce(solData.account);
    }
    if (web3Data.accounts[0] !== prevProps.web3Data.accounts[0]) {
      if (web3Data.accounts[0] !== localStorage.getItem("userAddress"))
        localStorage.setItem("userAddress", "");
      else if (localStorage.getItem("avangartAuthToken"))
        this.props.getUserDetails();
      this.setState({ web3Data: web3Data }, () => {
        if (web3Data.accounts[0]) {
          this.checkMetamaskLock(); // check metamaks is logged in
          this.fetchTokenBalance(web3Data);
        }
      });
    }

    //  //solana userdetails
    //  if (solsData.account !== prevProps.solData.account) {
    //   if (solsData.account !== localStorage.getItem("userAddress"))
    //     localStorage.setItem("userAddress", "");
    //   else if (localStorage.getItem("avangartAuthToken"))
    //     this.props.getUserDetails();
    //   this.setState({ solsData: solData });
    // }

    if (web3Data.isLoggedIn !== prevProps.web3Data.isLoggedIn) {
      this.setState({ web3Data: web3Data });
    }
    if (authData !== prevProps.authData) {
      if (authData) {
        this.setState({ userDetails: authData.data });
      }
    }
  }

  checkMetamaskLock = () => {
    const checker = setInterval(() => {
      web3.eth.getAccounts().then((resp) => {
        if (!resp[0]) {
          this.disconnect(); // metaMask is locked disconnect the user
          clearInterval(checker);
        }
      });
    }, 1000);
  };

  async componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    let { web3Data } = this.props;
    let { solData } = this.props;
    if (!web3Data.accounts[0]) {
      this.props.getWeb3();
    } else {
      this.setState({ web3Data: web3Data }, () => {
        if (web3Data.accounts[0]) {
          this.fetchTokenBalance(web3Data);
        }
      });
    }

    if (window.web3) {
      const chainID = await web3.eth.getChainId();
      if (chainID !== 56 && chainID !== "0x38") {
        // this.setState({ networkError: true }) // ask user to switch to the BSC Network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Binance Smart Chain',
              nativeCurrency: {
                name: 'Binance Chain Token',
                symbol: 'BNB',
                decimals: 18
              },
              rpcUrls: ['https://bsc-dataseed2.binance.org/'],
            },
          ],
        });
        const changeRequest = window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
        });
      } else {
        // this.setState({ networkError: false })
      }

      window.ethereum.on("accountsChanged", (accounts) => {
        // metamask user address changed
        if (
          accounts.length > 0 &&
          this.state.web3Data.isLoggedIn &&
          accounts[0] !== this.state.web3Data.accounts[0]
        ) {
          this.props.clearNonce();
          this.props.authLogout();
          this.props.web3Logout(accounts);
          this.setState({ isOpen4: true });
        }
      });
      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        // if (chainId !== 56 && chainId !== "0x38") {
        //   const changeRequest = window.ethereum.request({
        //     method: "wallet_switchEthereumChain",
        //     params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
        //   });
        // }
      });
    }
    walletConnectProvider.on("accountsChanged", (accounts) => {
      // walletConnect user address changed
      if (
        accounts.length > 0 &&
        this.state.web3Data.isLoggedIn &&
        accounts[0] !== this.state.web3Data.accounts[0]
      ) {
        this.props.clearNonce();
        this.props.authLogout();
        this.props.web3Logout(accounts);
        this.setState({ isOpen4: true });
      }
    });
  }

  handleClickOutside(event) {
    if (
      this.wrapperRef &&
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      if (this.state.isOpen3) {
        this.setState({ isOpen3: false });
      }
      if (this.state.isOpen2) {
        this.setState({ isOpen2: false });
      }
    }
  }
  async fetchTokenBalance(web3Data) {
    const accountBalance = Number(
      web3.utils.fromWei(await web3.eth.getBalance(web3Data.accounts[0]))
    ).toLocaleString(undefined, 2);
    const newAddress = web3Data.accounts[0];
    const compactUserAddress = newAddress
      ? newAddress.substring(0, 5) +
      "...." +
      newAddress.substring(newAddress.length - 5, newAddress.length)
      : "00000000000";

    this.setState({ accountBalance, compactUserAddress });
  }

  checkRole = (user) => {
    if (user.role.roleName === "COLLECTOR") {
      return <BecomeCreator />;
    } else if (user.role.roleName === "CREATOR" && user.status === "APPROVED") {
      return (
        <Link to="/user/nftminting">
          <AvBTN02 className="colorBTN">
            <FormattedMessage id="create" defaultMessage="Create" />
          </AvBTN02>
        </Link>
      );
    } else if (user.role.roleName === "CREATOR" && user.status !== "APPROVED") {
      return (
        <AvBTN02 className="grayBTN">
          <FormattedMessage id="waitlist" defaultMessage="Waitlist" />
        </AvBTN02>
      );
    }
  };

  disconnect = () => {
    localStorage.clear();
    this.props.clearNonce();
    this.props.authLogout();
    this.props.web3Logout([]);
    this.props.history.push("/");
  };

  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };

  render() {
    const { web3Data, userDetails, accountBalance, compactUserAddress,solsData,
      // networkError
    } =
      this.state;
    //  console.log(web3Data);
    //  console.log(!solsData.isLogin);   //intially true
    //  console.log(userDetails);
      const sol = {
        isLogin : false
      }
    const value = this.props.location.pathname;
    const parts = value.split("/");
    const useGradient =
      parts[1] === "creator" || parts[2] === "profile"
        ? "gradient-header"
        : null;
    return (
      <>
        {/* {networkError &&
          <BlackWrap>
            <WhiteBX01>
              <WGTitle>
                <FormattedMessage id="network_warning" defaultMessage="Please switch to a supported network: BSC" />
              </WGTitle>
            </WhiteBX01>
          </BlackWrap>
        } */}
        <HeadMBX className={useGradient}>
          <HeadMBX02>
            <HeadSbx01 className="mobile-logo">
              <Logo>
                <Link to="/" className="avangart-Logo">
                  {/* <img src={LogoImg} alt="" /> */}
                </Link>
              </Logo>
            </HeadSbx01>

            <HeadSbx01>
              <MobileMenu>
                {web3Data.isLoggedIn ? (
                  <NotificationBX onClick={() => this.toggle(3)}>
                    <button className="noti-button-outer">
                      {/* <img src={NotifiIcon} alt="" /> */}
                      <span className="Notifi-Icon"></span>
                      <span className="RedDot"></span>
                    </button>

                    <Collapse
                      isOpen={this.state.isOpen3}
                      className={
                        "app__collapse collapse-css-transition  " +
                        (this.state.isOpen3 ? "collapse-active" : "")
                      }
                    >
                      <DDContainer className="ver3">
                        <CustomScrollbars
                          autoHide
                          autoHideTimeout={1000}
                          style={{
                            width: "100%",
                            height: "500px",
                            position: "relative",
                          }}
                        >
                          <Notifications />
                        </CustomScrollbars>
                      </DDContainer>
                    </Collapse>
                  </NotificationBX>
                ) : (
                  ``
                )}

                <Bars
                  onClick={() => this.toggle(11)}
                  className={
                    this.state.isOpen11 ? "menu-active" : "menu-deactive"
                  }
                />
              </MobileMenu>
              <MobileSidebar>
                <Collapse
                  id="mobile-block"
                  isOpen={this.state.isOpen11}
                  className={
                    "app__collapse " +
                    (this.state.isOpen11 ? "collapse-active" : "")
                  }
                >
                  <MobInner>
                    <div className="mobile-links">
                      {web3Data.isLoggedIn ? (
                        <NavLink
                          to="/user/profile"
                          exact
                          activeClassName="active"
                          onClick={() => this.toggle(11)}
                        >
                          <FormattedMessage
                            id="profile"
                            defaultMessage="Profile"
                          />
                        </NavLink>
                      ) : (
                        ``
                      )}
                      <NavLink
                        to="/marketplace"
                        exact
                        activeClassName="active"
                        onClick={() => this.toggle(11)}
                      >
                        <FormattedMessage
                          id="marketplace"
                          defaultMessage="Marketplace"
                        />
                      </NavLink>
                      <NavLink
                        to="/collections"
                        exact
                        activeClassName="active"
                        onClick={() => this.toggle(11)}
                      >
                        <FormattedMessage
                          id="collections"
                          defaultMessage="Collections"
                        />
                      </NavLink>
                      <NavLink
                        to="/creators"
                        exact
                        activeClassName="active"
                        onClick={() => this.toggle(11)}
                      >
                        <FormattedMessage
                          id="creators"
                          defaultMessage="Creators"
                        />
                      </NavLink>
                      <NavLink
                        to="/how-to-use"
                        exact
                        activeClassName="active"
                        onClick={() => this.toggle(11)}
                      >
                        <FormattedMessage
                          id="how_to_use?"
                          defaultMessage="How to use?"
                        />
                      </NavLink>
                      <NavLink
                        to="/"
                        exact
                        activeClassName="active"
                        onClick={() => this.toggle(12)}
                      >
                        <FormattedMessage id="more" defaultMessage="More" />
                      </NavLink>
                    </div>
                    <Collapse
                      isOpen={this.state.isOpen12}
                      className={
                        "app__collapse " +
                        (this.state.isOpen12 ? "collapse-active" : "")
                      }
                    >
                      <Moremenu>
                        <div className="more-parts">
                          <NavLink
                            to={{ pathname: "https://medium.com/@Carny.io" }}
                            target="_blank"
                          >
                            Carny Blog
                          </NavLink>
                          <NavLink
                            to="/faq"
                            onClick={() => {
                              this.toggle(12);
                              this.toggle(11);
                            }}
                          >
                            <FormattedMessage id="faq" defaultMessage="FAQ" />
                          </NavLink>
                          <NavLink
                            to="mailto:admin@carny.io"
                            onClick={() => {
                              this.toggle(12);
                              this.toggle(11);
                            }}
                          >
                            <FormattedMessage
                              id="support"
                              defaultMessage="Support"
                            />
                          </NavLink>
                        </div>
                        <div className="more-parts">
                          <NavLink
                            to="/legal"
                            onClick={() => {
                              this.toggle(12);
                              this.toggle(11);
                            }}
                          >
                            <FormattedMessage
                              id="term_of_service"
                              defaultMessage="Terms of Service"
                            />
                          </NavLink>
                          <NavLink
                            to="/legal"
                            onClick={() => {
                              this.toggle(12);
                              this.toggle(11);
                            }}
                          >
                            <FormattedMessage
                              id="privacy_policy"
                              defaultMessage="Privacy Policy"
                            />
                          </NavLink>
                          <NavLink
                            to="/legal"
                            onClick={() => {
                              this.toggle(12);
                              this.toggle(11);
                            }}
                          >
                            <FormattedMessage
                              id="cookie_policy"
                              defaultMessage="Cookie Policy"
                            />
                          </NavLink>
                        </div>
                      </Moremenu>
                    </Collapse>
                    {/* {!solsData.isLogin ? (
                        <>
                    
                        <Language header={true} />
                        <div className="mobile-login-btn">
                          <AvBTN01 onClick={() => this.toggle(4)}>
                            <FormattedMessage
                              id="signup"
                              defaultMessage="signup"
                            />
                            
                          </AvBTN01>
                        </div>
                      </>
                    ):(
                      <>
                         <BecomeCreator />
                      </>
                    )
                  } */}

                    {!web3Data.isLoggedIn ? (
                      <>
                    
                        <Language header={true} />
                        <div className="mobile-login-btn">
                          <AvBTN01 onClick={() => this.toggle(4)}>
                            <FormattedMessage
                              id="login"
                              defaultMessage="Login"
                            />
                            
                          </AvBTN01>
                        </div>
                        
                      </>
                    ) : (
                      <>
                        <Language header={true} />
                        <div className="mobile-login-btn">
                          {userDetails ? this.checkRole(userDetails) : ""}
                          {/* <BecomeCreator /> */}
                        </div>
                        <Mobiledisconnect
                          onClick={() => {
                            this.disconnect();
                            this.toggle(11);
                          }}
                        >
                          <FormattedMessage
                            id="disconnect"
                            defaultMessage="Disconnect"
                          />
                        </Mobiledisconnect>
                      </>
                    )}
                    
                    {/* {!solsData.isLogin ? (
                      <>
                    
                        <Language header={true} />
                        <div className="mobile-login-btn">
                          <AvBTN01 onClick={() => this.toggle(4)}>
                            <FormattedMessage
                              id="login"
                              defaultMessage="Login"
                            />
                            
                          </AvBTN01>
                        </div>
                      </>
                    ) : (
                      <>
                       <BecomeCreator />
                      </>
                    )} */}
                    <FooterrightLinks>
                      <Link
                        to={{ pathname: "https://www.instagram.com/carny.io/" }}
                        target="_blank"
                      >
                        Instagram
                      </Link>
                      <Link
                        to={{ pathname: "https://twitter.com/carny_io" }}
                        target="_blank"
                      >
                        Twitter
                      </Link>
                      <Link
                        to={{
                          pathname: "https://discord.com/invite/SkPAgNz4",
                        }}
                        target="_blank"
                      >
                        Discord
                      </Link>
                    </FooterrightLinks>
                  </MobInner>
                </Collapse>
              </MobileSidebar>

              <nav className="desktop-menu">
                <NavLink to="/marketplace" exact activeClassName="active">
                  <FormattedMessage
                    id="marketplace"
                    defaultMessage="Marketplace"
                  />
                </NavLink>
                <NavLink to="/creators" exact activeClassName="active">
                  <FormattedMessage id="creators" defaultMessage="Creators" />
                </NavLink>
                <NavLink to="/how-to-use" exact activeClassName="active">
                  <FormattedMessage
                    id="how_to_use?"
                    defaultMessage="How to use?"
                  />
                </NavLink>
              </nav>
            </HeadSbx01>

            {/* without Login  */}
            {!web3Data.isLoggedIn ? (
              <HeadSbx01 className="desktop-menu">
                <AvBTN01 onClick={() => this.setState({ isOpen4: true })}>
                  <FormattedMessage id="login" defaultMessage="login" />
                </AvBTN01>
                <Language header={true} />
              </HeadSbx01>
            ) : (
              <HeadSbx01 className="desktop-menu" ref={this.wrapperRef}>
                {userDetails ? this.checkRole(userDetails) : ""}

                <NotificationBX onClick={() => this.toggle(3)}>
                  <button className="active noti-button-outer">
                    {/* <img src={NotifiIcon} alt="" /> */}
                    <span className="Notifi-Icon"></span>
                    <span className="RedDot"></span>
                  </button>

                  <Collapse
                    isOpen={this.state.isOpen3}
                    className={
                      "app__collapse collapse-css-transition  " +
                      (this.state.isOpen3 ? "collapse-active" : "")
                    }
                  >
                    <DDContainer className="ver3">
                      <CustomScrollbars
                        autoHide
                        autoHideTimeout={1000}
                        style={{
                          width: "100%",
                          height: "265px",
                          position: "relative",
                        }}
                      >
                        <Notifications />
                      </CustomScrollbars>
                    </DDContainer>
                  </Collapse>
                </NotificationBX>
                <AccountBX className="ph-bg" onClick={() => this.toggle(2)}>
                  <span>
                    {accountBalance} BNB
                    <span>{compactUserAddress}</span>
                  </span>
                  <i>
                    <img
                      src={
                        userDetails
                          ? userDetails.profile
                            ? userDetails.profile
                            : UserIcon
                          : UserIcon
                      }
                      alt=""
                    />
                  </i>
                  <Collapse
                    isOpen={this.state.isOpen2}
                    className={
                      "app__collapse collapse-css-transition  " +
                      (this.state.isOpen2 ? "collapse-active" : "")
                    }
                    ref={this.wrapperRef}
                  >
                    <DDContainer className="ver2">
                      <DDBtnbar02>
                        <button
                          onClick={() =>
                            this.props.history.push("/user/profile")
                          }
                        >
                          <i>
                            <img
                              src={
                                userDetails
                                  ? userDetails.profile
                                    ? userDetails.profile
                                    : UserIcon
                                  : UserIcon
                              }
                              alt=""
                            />
                          </i>
                          <FormattedMessage
                            id="view_your_profile"
                            defaultMessage="View your profile"
                          />
                          <span>
                            <img src={RightArrow} alt="" />
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            this.disconnect();
                          }}
                        >
                          <i>
                            <img src={DisconnectICO} alt="" />
                          </i>
                          <FormattedMessage
                            id="disconnect"
                            defaultMessage="Disconnect"
                          />
                          {/* <span>
                            
                            <img src={RightArrow} alt="" />
                          </span> */}
                        </button>
                      </DDBtnbar02>
                    </DDContainer>
                  </Collapse>
                </AccountBX>
              </HeadSbx01>
            )}
          </HeadMBX02>
        </HeadMBX>

        {this.state.isOpen4 ? <Login toggle={this.toggle} /> : ``}
      </>
    );
  }

  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };
}
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeadMBX = styled(FlexDiv)`
  width: 100%;
  min-height: 100px;
  position: absolute;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  ${Media.md} {
    min-height: 80px;
  }
  &.gradient-header {
    background-color: transparent;
    box-shadow: none;
    .avangart-Logo {
      background: url(${LogoImgWhite}) no-repeat;
      background-size: contain;
    }
    .desktop-menu a {
      color: #fff;
      :hover {
        :after {
          background-color: #fff;
        }
      }
      .active {
        :after {
          background-color: #fff;
        }
      }
    }
    .ph-bg {
      background-color: transparent;
      span {
        color: #fff;
        span {
          color: rgb(255 255 255 / 30%);
        }
      }
    }
    .menu-active {
      background: url(${IconMenuCloseWhite}) no-repeat;
    }
    .menu-deactive {
      background: url(${IconMenuOpenWhite}) no-repeat;
    }
    .noti-button-outer {
      ${Media.md} {
        background-color: transparent;
      }
      .Notifi-Icon {
        ${Media.md} {
          background: url(${NotifiIconWhite}) no-repeat;
        }
      }
    }
  }
`;
const HeadMBX02 = styled(FlexDiv)`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  ${Media.lg} {
    margin: 0 15px;
    justify-content: flex-start;
  }
`;
const HeadSbx01 = styled(FlexDiv)`
  width: 33.33%;
  justify-content: flex-start;
  &.mobile-logo {
    ${Media.md} {
      width: auto;
    }
  }
  &.desktop-menu,
  .desktop-menu {
    ${Media.md} {
      display: none;
    }
  }
  ${Media.lg} {
    width: 28.33%;
  }
  &:nth-child(2) {
    justify-content: center;
    & nav:hover {
      a:not(:hover) {
        opacity: 0.3;
      }
    }
    a {
      color: #000;
      font-size: 16px;
      font-weight: 600;
      padding: 0 20px;
      line-height: 25px;
      position: relative;
      ${Media.lg} {
        font-size: 15px;
        padding: 0 15px;
      }
      :hover,
      &.active {
        :after {
          content: "";
          left: 20px;
          right: 20px;
          height: 2px;
          background-color: #000;
          display: block;
          position: absolute;
          bottom: -3px;
        }
      }
    }
    ${Media.lg} {
      width: 33.33%;
    }
  }
  &:nth-child(3) {
    justify-content: flex-end;
    ${Media.lg} {
      width: 38.33%;
    }
  }
`;
const Logo = styled(FlexDiv)`
  .avangart-Logo {
    background: url(${LogoImg}) no-repeat;
    background-size: contain;
    width: 100px;
    height: 37px;
    ${Media.md} {
      width: 100px;
      height: 37px;
    }
  }
`;

const AvBTN01 = styled.button`
  padding: 9px 40px;
  color: #fff;
  background-color: #000;
  border-radius: 15px;
  :hover {
    background-color: #d121d6;
    -webkit-box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
    box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
  }
`;

const LanBTN = styled(FlexDiv)`
  margin-left: 30px;
  position: relative;
  button {
    font-size: 12px;
    font-weight: 600;
    color: #000;
  }
`;
const AvBTN02 = styled.button`
  padding: 11px 23px;
  font-size: 12px;
  color: #fff;
  background-color: #000;
  border-radius: 15px;
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
`;

const NotificationBX = styled(FlexDiv)`
  margin-left: 8px;
  position: relative;
  .Notifi-Icon {
    background-image: url(${NotifiIcon});
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
  }
  & > button {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    &.noti-button-outer {
      padding: 0px;
    }
    &.active,
    :hover {
      border: 1px solid #d6dde5;
      -webkit-box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
      box-shadow: 1px 8px 10px 1px rgba(0, 0, 0, 0.08);
      border: 1px solid #eef2f7;
      background-color: #ffffff;
      span.RedDot {
        display: block;
      }
    }
    span.RedDot {
      width: 12px;
      height: 12px;
      border-radius: 8px;
      display: block;
      position: absolute;
      right: -2px;
      top: -2px;
      background-color: #ff2a44;
      display: none;
    }
  }
`;
const AccountBX = styled(FlexDiv)`
  margin-left: 8px;
  position: relative;
  border: solid 1px transparent;
  width: 170px;
  justify-content: flex-end;
  background-color: #fff;
  padding: 8px 10px;
  border-radius: 20px;
  z-index: 101;
  cursor: pointer;
  ${Media.lg} {
    padding: 8px 10px;
  }
  &:hover {
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    border: solid 1px #eef2f7;
  }

  & i {
    width: 50px;
    height: 50px;
    border-radius: 30px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  & span {
    font-size: 14px;
    font-weight: 600;
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
const DDContainer = styled(FlexDiv)`
  position: absolute;
  background-color: #fff;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  top: calc(100% + 30px);
  width: 200px;
  left: 50%;
  transform: translateX(-50%);
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
    ${Media.md} {
      transform: none;
      left: auto;
      right: -49px;
      width: 100vw;
      top: calc(100% + 21px);
      box-shadow: none;
      border-radius: 0px;
      justify-content: flex-start;
    }
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
const DDBtnbar02 = styled(FlexDiv)`
  width: 100%;
  button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 58px;
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

const ABC = styled(FlexDiv)`
  align-items: flex-start;
  justify-content: flex-start;
`;

const CloseBTN = styled.button`
  width: 20px;
  height: 20px;
  // position: absolute;
  // right: 20px;
  // top: 27px;
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

const MobileMenu = styled(FlexDiv)`
  display: none;
  ${Media.md} {
    display: flex;
    position: absolute;
    right: 15px;
  }
`;

const Bars = styled.div`
  color: #000;
  font-size: 20px;
  margin-left: 10px;
  background: url(${IconMenuOpen}) no-repeat;
  width: 24px;
  height: 24px;
  &.menu-active {
    background: url(${IconMenuClose}) no-repeat;
  }
`;

const MobileSidebar = styled.div`
  background-color: #fff;
  width: 100%;
  position: absolute;
  top: 80px;
  left: 0px;
  display: none;
  ${Media.md} {
    display: block;
  }
  .collapse-active#mobile-block {
    height: auto !important;
  }
`;

const MobInner = styled.div`
  width: 100%;
  padding: 30px 25px;
  .mobile-links {
    a {
      width: max-content;
      display: block;
      font-size: 18px;
      padding: 0px 0px 22px !important;
      :after {
        left: 0px !important;
        bottom: 18px !important;
        width: 100%;
        height: 3px !important;
      }
    }
    :hover {
      a:not(:hover) {
        opacity: 0.3;
      }
    }
  }
  .mobile-login-btn {
    margin-top: 80px;
    text-align: center;
    button {
      // padding: 12px 75px 15px;
      width: 200px;
      height: 50px;
      font-size: 18px;
      text-transform: capitalize;
    }
    a {
      :after {
        display: none !important;
      }
    }
  }
`;

const FooterrightLinks = styled(FlexDiv)`
  margin: 30px 0px 40px;
  a {
    font-size: 14px !important;
    letter-spacing: -0.6px !important;
    font-weight: 500 !important;
    :last-child {
      margin-right: 0px;
    }
  }
`;

const Mobiledisconnect = styled(FlexDiv)`
  margin: 15px 0px 0px;
  font-size: 14px !important;
  letter-spacing: -0.6px !important;
  font-weight: 500 !important;
  text-decoration: underline;
  :after {
    display: none !important;
  }
`;

const Moremenu = styled(FlexDiv)`
  .more-parts {
    width: 50%;
    a {
      font-size: 14px;
      letter-spacing: -0.62px;
      font-weight: 600;
      display: block;
      margin-bottom: 15px;
      :after {
        display: none !important;
      }
    }
  }
  :hover {
    a:not(:hover) {
      opacity: 0.3;
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
  ${Media.xs}{
    padding:50px 25px;
  }
  form{
    width:100%;
    // .view{
    //   width:100%;
    //   overflow-x:hidden !important;
    //   overflow-y:auto !important;
    // }
  }
`;
const WGTitle = styled.div`
  color: #000000;
  font-size: 20px;
  line-height:28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;


const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: () => dispatch(actions.getWeb3()),
    getSolana: () => dispatch(actions.getSolana()),
    enableMetamask: () => dispatch(actions.enableMetamask()),
    enablePhantom: () => dispatch(actions.enablePhantom()),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    generateSolNonce: (address) => dispatch(actions.generateSolNonce(address)),
    clearNonce: () => dispatch({ type: "GENERATE_NONCE", data: null }),
    authLogin: (nonce, signature) =>
      dispatch(actions.authLogin(nonce, signature)),
    authenticateUser: () => dispatch(actions.authenticateUser()),
    getUserDetails: () => dispatch(actions.getUserDetails()),
    authLogout: () => dispatch({ type: "AUTH_LOGIN", data: null }),
    web3Logout: (accounts) =>
      dispatch({
        type: "FETCH_WEB3_DATA",
        data: { isLoggedIn: false, accounts: accounts },
      }),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.fetchWeb3Data,
    solData: state.fetchSolData,
    networkId: state.fetchNetworkId,
    isMetamaskEnabled: state.fetchMetamask,
    nonce: state.fetchNonce,
    authData: state.fetchAuthData,
  };
};
export default withRouter(connect(mapStateToProps, mapDipatchToProps)(Header));
