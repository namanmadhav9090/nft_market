import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import Gs from "../Theme/globalStyles";
import Collapsible from 'react-collapsible';
import Media from "../Theme/media-breackpoint";

import Blackcross from "../Assets/images/black-cross.svg";
import Bluecross from "../Assets/images/blue-cross.svg";
import { Scrollbars } from "react-custom-scrollbars";

function CustomScrollbars(props) {
  return (
    <Scrollbars
      renderTrackHorizontal={(props) => (
        <div {...props} className="track-horizontal" />
      )}
      renderThumbHorizontal={(props) => (
        <div {...props} className="thumb-horizontal" />
      )}
      renderView={(props) => <div {...props} className="view" />}
      autoHide
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}
const faq_en = require("../helper/faq/faq_en.json")
const faq_tr = require("../helper/faq/faq_tr.json")


class Faq extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabPanel: 0,
      list: [],
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { lang } = this.props;
    this.setState({ list: lang === 'en' ? faq_en.data : faq_tr.data })
  }

  componentDidUpdate(prevProps, prevState) {
    let { lang } = this.props;
    let { tabPanel, list } = this.state;
    if (tabPanel !== prevState.tabPanel) {
      if (tabPanel === 0) {
        list = lang === 'en' ? faq_en.data : faq_tr.data
      } else {
        list = lang === 'en'
          ? faq_en.data.filter(faq => faq.category === tabPanel).map(faq => faq)
          : faq_tr.data.filter(faq => faq.category === tabPanel).map(faq => faq)
      }
      this.setState({ list: list })
    }
    if (lang !== prevProps.lang) {
      if (tabPanel > 0) {
        this.setState({
          list: lang === 'en' ?
            faq_en.data.filter(faq => faq.category === tabPanel).map(faq => faq)
            : faq_tr.data.filter(faq => faq.category === tabPanel).map(faq => faq)
        })
      } else {
        this.setState({ list: lang === 'en' ? faq_en.data : faq_tr.data })
      }
    }
  }

  render() {
    const { list, tabPanel } = this.state
    return (
      <Gs.MainSection>
        <FaqContainer>
          <Faqtitle>
            <h2><FormattedMessage id="faq_label" defaultMessage="Frequently Asked Questions" /></h2>

            <FilterLbx>
              <CustomScrollbars
                autoHide
                autoHideTimeout={1000}
                style={{ width: "100%", height: "70px", position: "relative" }}
              >
                <button className={tabPanel === 0 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 0 })}>
                  <FormattedMessage id="all" defaultMessage="All" />
                </button>
                <button className={tabPanel === 1 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 1 })}>
                  <FormattedMessage id="getting_started" defaultMessage="Getting Started" />
                </button>
                <button className={tabPanel === 2 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 2 })}>
                  <FormattedMessage id="wallet_usage" defaultMessage="Wallet Usage" />
                </button>
                <button className={tabPanel === 3 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 3 })}>
                  <FormattedMessage id="buying_nfts" defaultMessage="Buying NFTs" />
                </button>
                <button className={tabPanel === 4 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 4 })}>
                  <FormattedMessage id="creating_nfts" defaultMessage="Creating NFTs" />
                </button>
                <button className={tabPanel === 5 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 5 })}>
                  <FormattedMessage id="becoming_creator" defaultMessage="Becoming a Creator" />
                </button>
                <button className={tabPanel === 6 ? `active` : ``}
                  onClick={() => this.setState({ tabPanel: 6 })}>
                  <FormattedMessage id="fees_&_commissions" defaultMessage="Fees & Commissions" />
                </button>
              </CustomScrollbars>
            </FilterLbx>

            <FaqAccordian>
              {list.length === 0 ?
                <FormattedMessage
                  id="no_result_found"
                  defaultMessage="No result found" />
                :
                list.map((faq, key) => {
                  return <Collapsible trigger={faq.question} key={key}>
                    <p>{faq.answer}</p>
                  </Collapsible>
                })
              }
            </FaqAccordian>
          </Faqtitle>
        </FaqContainer>
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

const FaqContainer = styled.div`
  margin:60px auto 80px; max-width:835px; width:100%;
  ${Media.md}{
    width:94%;
  }
`;

const Faqtitle = styled.div`
  h2{font-size:32px; letter-spacing:-1.52px; font-weight:700; margin:0px 0px 20px; color:#000; line-height:normal;
    ${Media.sm}{
      font-size:24px; letter-spacing:-1.14px;
    }
  }
`;
const FilterLbx = styled(FlexDiv)`
  justify-content: flex-start; 
  margin-bottom:40px; 
  .view{
    display:flex;
    align-items:center;
    padding-right:20px;
  }
  button {
    display: inline-block;
    padding: 10px 25px;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    border-radius: 15px;
    background-color: #eef2f7;
    margin:0px 8px 8px 0px;
    white-space:nowrap;
    &.active {
      background-color: #00babc;
      color: #fff;
    }
    :hover {
      background-color: #00babc;
      color: #fff;
      box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
    }
  }
`;

const FaqAccordian = styled.div`
  .Collapsible
  {
    margin:0px 0px 40px; 
  }
  .Collapsible__trigger
  { 
    font-size:20px; 
    letter-spacing:-0.89px; 
    font-weight:bold; 
    color:#000; 
    line-height:normal; 
    border-bottom:1px solid #ddd; 
    cursor:pointer; 
    padding:0px 17px 13px 0px; 
    display:block; 
    position:relative;
    :after
    {
      content:''; 
      width:14px; 
      height:14px; 
      position:absolute; 
      right:0px; 
      top:5px; 
      background:url(${Blackcross}); 
      background-size:contain;
    }
    ${Media.sm}{
      font-size:16px; letter-spacing:-0.71px;
    }
    &.is-open{
      color:#00babc; border-bottom:none;
      :after{ width:17px; height:17px; background:url(${Bluecross}); background-size:contain; }
      + .Collapsible__contentOuter
        {
          border-bottom:1px solid #00babc;
        }
      } 
      
    }
  }
  .Collapsible__contentInner{
    p{font-size:16px; color:#000; letter-spacing:-0.8px; line-height:normal;
      ${Media.sm}{
        font-size:14px; letter-spacing:-0.7px;
      }
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    lang: state.fetchLanguage,
  };
}

export default connect(mapStateToProps)(Faq);