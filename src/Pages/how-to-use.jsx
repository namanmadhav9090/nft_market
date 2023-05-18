import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";
import React, { Component } from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import Gs from "../Theme/globalStyles";
import { Link } from "react-router-dom";
import Collapse from "@kunukn/react-collapse";
import { FormattedMessage } from "react-intl";
import Media from '../Theme/media-breackpoint';

import NFT2 from "../Assets/images/how-to-use.jpg"
import Cshape from "../Assets/images/combined-shape.svg";

class HowToUse extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      tabPanel: 'all',
      searched: false,
      filter: [],
      page: 1,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Gs.MainSection>
        <Gs.Container>
          {/* <HUtopButtons>
            <button className="active">For Creators</button>
            <button>For Collectors</button>
          </HUtopButtons> */}
          <HowToMain>
            <HowtoRow>
              <Howtoleft>
                <h3><FormattedMessage id="how_to_use_lable_01" /></h3>
                <p><FormattedMessage id="how_to_use_text01_1" /></p>
                <p><FormattedMessage id="how_to_use_text01_2" /></p>
              </Howtoleft>
              <Howtoright>
                <Link to='/how-to-use'>
                  <img src={NFT2} alt="" />
                  <div className="overlay">
                      <p>
                        <FormattedMessage id="comming_soon" defaultMessage="Coming Soon" />
                      </p>
                  </div>
                </Link>
              </Howtoright>
            </HowtoRow>
            <HowtoRow>
              <Howtoleft>
                <h3><FormattedMessage id="how_to_use_lable_02" /></h3>
                <p><FormattedMessage id="how_to_use_text02_1" /></p>
                <p><FormattedMessage id="how_to_use_text02_2" /></p>
              </Howtoleft>
              <Howtoright>
                <Link to='/how-to-use'>
                  <img src={NFT2} alt="" />
                  <div className="overlay">
                      <p>
                        <FormattedMessage id="comming_soon" defaultMessage="Coming Soon" />
                      </p>
                  </div>
                </Link>
              </Howtoright>
            </HowtoRow>
            <HowtoRow>
              <Howtoleft>
                <h3><FormattedMessage id="how_to_use_lable_03" /></h3>
                <p><FormattedMessage id="how_to_use_text03_1" /></p>
                <p><FormattedMessage id="how_to_use_text03_2" /></p>
              </Howtoleft>
              <Howtoright>
                <Link to='/how-to-use'>
                  <img src={NFT2} alt="" />
                  <div className="overlay">
                      <p>
                        <FormattedMessage id="comming_soon" defaultMessage="Coming Soon" />
                      </p>
                  </div>
                </Link>
              </Howtoright>
            </HowtoRow>
            <HowtoRow>
              <Howtoleft>
                <h3><FormattedMessage id="how_to_use_lable_04" /></h3>
                <p><FormattedMessage id="how_to_use_text04_1" /></p>
                <p><FormattedMessage id="how_to_use_text04_2" /></p>
              </Howtoleft>
              <Howtoright>
                <Link to='/how-to-use'>
                  <img src={NFT2} alt="" />
                  <div className="overlay">
                      <p>
                        <FormattedMessage id="comming_soon" defaultMessage="Coming Soon" />
                      </p>
                  </div>
                </Link>
              </Howtoright>
            </HowtoRow>
            <HowtoRow>
              <Howtoleft>
                <h3><FormattedMessage id="how_to_use_lable_05" /></h3>
                <p><FormattedMessage id="how_to_use_text05_1" /></p>
                <p><FormattedMessage id="how_to_use_text05_2" /></p>
                <p><FormattedMessage id="how_to_use_text05_3" /></p>
              </Howtoleft>
              <Howtoright>
                <Link to='/how-to-use'>
                  <img src={NFT2} alt="" />
                  <div className="overlay">
                      <p>
                        <FormattedMessage id="comming_soon" defaultMessage="Coming Soon" />
                      </p>
                  </div>
                </Link>
              </Howtoright>
            </HowtoRow>
            <HowtoRow>
              <Howtoleft>
                <h3><FormattedMessage id="how_to_use_lable_06" /></h3>
                <p><FormattedMessage id="how_to_use_text06_1" /></p>
                <p><FormattedMessage id="how_to_use_text06_2" /></p>
              </Howtoleft>
              <Howtoright>
                <Link to='/how-to-use'>
                  <img src={NFT2} alt="" />
                  <div className="overlay">
                      <p>
                        <FormattedMessage id="comming_soon" defaultMessage="Coming Soon" />
                      </p>
                  </div>
                </Link>
              </Howtoright>
            </HowtoRow>
          </HowToMain>
          <HUbottombuttons>
            <button
              onClick={() => this.props.history.push("/faq")}
            ><FormattedMessage id="faq" defaultMessage="FAQ" /></button>
            {/* <button>   */}
            <a href="mailto:admin@carny.io">
              <FormattedMessage id="support" defaultMessage="Support" />
            </a>
            {/* </button> */}
          </HUbottombuttons>
        </Gs.Container>
      </Gs.MainSection>
    );
  }
  toggle = (index) => {
    let collapse = "isOpen" + index;
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
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const HowToMain = styled.div`
  margin-top:60px;
`;

const HUtopButtons = styled(FlexDiv)`
  margin:60px 0px 30px;
  justify-content:flex-start;
  button{
    padding:10px 60px;
    background-color:#eef2f7;
    border-radius:15px;
    margin:0px 10px 10px 0px;
    font-size:14px;
    line-height:22px;
    color:#000;
    letter-spacing:-0.2px;
    font-weight:500;
    :hover, &.active{
      background-color:#00babc; color:#fff;
    }
    ${Media.sm} {
      padding:10px 40px;
      margin:0px 5px 5px 0px;
      width: calc(50% - 5px);
    }
    ${Media.xs} {
      padding:10px 30px;
      margin:0px 5px 5px 0px;
    }
  }
`;
const HUbottombuttons = styled.div`
  margin:50px 0px 120px;
  justify-content:flex-start;
  button, a{
    display:block;
    width:190px;
    height:44px;
    background-color:transparent;
    border:1px solid #000;
    border-radius:15px;
    margin:0px 0px 10px 0px;
    font-size:14px;
    line-height:42px;
    color:#000;
    letter-spacing:-0.5px;
    font-weight:500;
    text-align:center;
    :hover{
      background-color:#000; color:#fff;
    }
    ${Media.sm} {
      margin:0px auto 10px;
    }
  }
  ${Media.sm} {
    justify-content:center;
    margin:0px 0px 100px;
  }
`;

const HowtoRow = styled(FlexDiv)`
  margin-bottom:30px;
`;
const Howtoleft = styled.div`
  max-width:785px;
  width:100%;
  h3{
    font-size:24px; letter-spacing:-1.07px; font-weight:bold; color:#000; margin:0px 0px 20px; line-height:normal;
  }
  p{
    font-size:16px; line-height:24px; letter-spacing:-0.8px; color:#000; margin:0px 0px 30px;
    :last-child{margin:0px;}
  }
  ${Media.lg} {
    max-width:680px;
  }
  ${Media.md} {
    max-width:70%;
  }
  ${Media.sm} {
    max-width:100%;
  }
`;
const Howtoright = styled.div`
  max-width:255px;
  max-height:255px;
  width:100%;
  margin:0 auto;
  position:relative;
  border-radius:10px;
  overflow:hidden;
  ${Media.lg} {
    max-width:220px;
    max-height:220px;
  }
  ${Media.md} {
    max-width:25%;
    max-height:100%;
    height:190px;
    margin:0px 0px 0px auto;
  }
  ${Media.sm} {
    max-width:255px;
    max-height:255px;
    height:auto;
    margin:30px auto;
  }
  img{
    width:100%; height:100%; object-fit:cover; 
  }
  .overlay
  {
    background-color:rgb(0 0 0 / 30%);
    border-radius:10px;
    position:absolute;
    top:0px;
    left:0px;
    height:100%;
    width:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    p{
      font-size:20px; letter-spacing:-0.75px; font-weight:bold; color:#fff; text-shadow:0px 2px 5px rgb(0 0 0 / 30%); margin:0px;
      position:absolute; top:20px; left:20px;
    }
  }
`;

export default withRouter(HowToUse);
