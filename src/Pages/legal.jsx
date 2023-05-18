import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Gs from "../Theme/globalStyles";
import { HashLink as Link } from "react-router-hash-link";
import Sticky from "react-sticky-el";
import Media from "../Theme/media-breackpoint";
import Scrollspy from 'react-scrollspy';
import { FaFileDownload } from "react-icons/fa";


class Legal extends Component {

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
    let { lng } = this.props;
    return (
      <Gs.MainSection>
        <Gs.Container>
          <NFTminting>
            <Legalleft>
              <Sticky>
                <NFTLeft>
                  <Scrollspy items={['terms', 'privacy', 'cookie']} currentClassName="active">
                    <Link className="active"
                      to="#terms"
                      smooth={true}
                    >
                      <FormattedMessage
                        id="term_of_service"
                        defaultMessage="Terms of Service"
                      />
                    </Link>
                    <Link
                      to="#privacy"
                      smooth={true}
                    >
                      <FormattedMessage
                        id="privacy_policy"
                        defaultMessage="Privacy Policy"
                      />
                    </Link>
                    <Link
                      to="#cookie"
                      smooth={true}
                    >
                      <FormattedMessage
                        id="cookie_policy"
                        defaultMessage="Cookie Policy"
                      />
                    </Link>
                  </Scrollspy>
                </NFTLeft>
              </Sticky>
            </Legalleft>
            <Legalright>
              <div id="terms">
                <h3>
                  <FormattedMessage
                    id="term_of_service"
                    defaultMessage="Terms of Service"
                  />
                </h3>
                <p>
                  <FormattedMessage
                    id="term_service.01"
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="term_service.02"
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="term_service.03"
                  />
                </p>
                <p>
                  <LegalButton>
                    <Link to={`/legal/${lng === 'en' ? `Terms_of_Service_English.pdf` : `Terms_of_Service_Turkish.pdf`}`} target="_blank" download>
                      <FaFileDownload />
                      <FormattedMessage
                        id="policy.download"
                      />
                    </Link>
                  </LegalButton>
                </p>
              </div>
              <div id="privacy">
                <h3>
                  <FormattedMessage
                    id="privacy_policy"
                    defaultMessage="Privacy Policy"
                  />
                </h3>
                <p>
                  <FormattedMessage
                    id="privacy_policy.01"
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="privacy_policy.02"
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="privacy_policy.03"
                  />
                </p>
                <p>
                  <LegalButton>
                    <Link to={`/legal/${lng === 'en' ? `Privacy_Policy_English.pdf` : `Privacy_Policy_Turkish.pdf`}`} target="_blank" download>
                      <FaFileDownload />
                      <FormattedMessage
                        id="policy.download"
                      />
                    </Link>
                  </LegalButton>
                </p>
              </div>
              <div id="cookie">
                <h3>  
                  <FormattedMessage
                    id="cookie_policy"
                    defaultMessage="Cookie Policy"
                  />
                </h3>
                <p>
                  <FormattedMessage
                    id="cookie_policy.01"
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="cookie_policy.02"
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="cookie_policy.03"
                  />
                </p>
                <p>
                  <LegalButton>
                    <Link to={`/legal/${lng === 'en' ? `Cookie_Policy_English.pdf` : `Cookie_Policy_Turkish.pdf`}`} target="_blank" download>
                      <FaFileDownload />
                      <FormattedMessage
                        id="policy.download"
                      />
                    </Link>
                  </LegalButton>
                </p>
              </div>
            </Legalright>
          </NFTminting>
        </Gs.Container>
      </Gs.MainSection >
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
        ul{
          padding-left:0px;
          margin:0px;
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
const Legalleft = styled.div`
        max-width:240px;
        width:100%;
        ${Media.lg}{
          max-width:20%;
  }
        ${Media.md}{
          max-width:25%;
  }
        ${Media.sm}{
          display:none;
  }
        `;
const Legalright = styled.div`
        max-width:840px; width:100%;
        h3{font-size:24px; letter-spacing:-1.07px; font-weight:700; margin:0px 0px 15px; color:#000;}
        p{font-size:16px; letter-spacing:-0.8px; line-height:normal; margin:0px 0px 30px; color:#000;}
        ${Media.lg}{
          max-width:80%;
  }
        ${Media.md}{
          max-width:75%;
  }
        ${Media.sm}{
          max-width:100%;
  }
        `;

const LegalButton = styled.div`
  margin: 0px 0px 30px 0px;
  a{
    background-color: #000;
    border-radius: 15px;
    font-size: 14px;
    line-height: normal;
    color: #fff;
    letter-spacing: -0.5px;
    font-weight: 500;
    text-align: center;
    padding:15px 20px;
    display:inline-block;
    svg{
      margin-right:7px;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    lng: state.fetchLanguage,
  }
}

export default withRouter(connect(mapStateToProps)(Legal));