import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { HashLink as Link } from "react-router-hash-link";
import styled from 'styled-components';
import LazyLoad from "react-lazyload";
import { motion } from "framer-motion";

import HeartIcon from '../../Assets/images/heart-icon.svg';
import StarIcon from '../../Assets/images/star-icon.svg';
import RoundIcon from '../../Assets/images/round-icon.svg';
import MobileAd from '../../Assets/images/mobile-adbanner.jpg';

import { actions } from '../../actions';
import { Context } from '../wrapper';
import { expiryTime } from '../../config';
import Media from "../../Theme/media-breackpoint";



class Info extends Component {

  static contextType = Context;
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      loading: false,
      infos: cookies.get('infos') || null,
    }
  }

  async componentDidMount() {
    const { infos, cookies } = this.props;
    if (!this.state.infos && !infos) {
      this.props.getInfo() // fetch info list
    } else {
      this.props.setInfos(cookies.get('infos'))
    }
  }

  componentDidUpdate() {
    const { infos, cookies } = this.props;
    if (infos && !cookies.get('infos')) {
      this.setCookie(infos) // set infos in cookie
    }
  }

  setCookie = (infos) => {
    const { cookies } = this.props;
    const expire = new Date(Date.now() + (expiryTime * 60 * 60 * 1000)) // cookie will expire after 12 hours
    cookies.set('infos', infos, { path: '/', expires: expire });
  }

  renderedInfo(info, index) {
    let context = this.context;
    let img = ''
    let mob_img = ''
    let button_text = ''
    if (context.locale === 'tr') {
      img = info.banner.tu
      mob_img = info.mobile.tu
      button_text = info.button_text.tu
    } else {
      img = info.banner.en
      mob_img = info.mobile.en
      button_text = info.button_text.en
    }
    return (
      <AdBanner2 key={index}>
        <Link to={info.url}>
          <motion.img
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            key={img}
            src={img}
            exit={{ opacity: 0 }}
            className="desk-img"
          />
          <img src={mob_img} className="mobile-img" alt="" />
        </Link>
        <Link to={info.button_url}>
          <button className="ani-1">{button_text}</button>
        </Link>
      </AdBanner2>
    )
  }

  render() {
    return (
      <HomeNFTs>
        <LazyLoad>
          {this.props.infos ?
            this.props.infos.map((banner, index) => this.renderedInfo(banner, index))
            : 'loading..'}
        </LazyLoad>
      </HomeNFTs>
    );
  }
}

// Common Style Div
const HomeNFTs = styled.div`
  width: 100%;
  .home-title {
    border-bottom: 1px solid #dddddd;
    text-align: left;
    margin-bottom: 30px;
    h3 {
      color: #000000;
      font-size: 32px;
      position: relative;
      line-height: 32px;
      margin: 0px 0px 15px;
      padding-left: 20px;
      letter-spacing: -1px;
      :before {
        content: '';
        position: absolute;
        left: 0px;
        top: 12px;
        width: 10px;
        height: 10px;
        background: url(${RoundIcon}) no-repeat;
      }
    }
  }
  .star-title {
    text-align: left;
    margin-bottom: 18px;
    h3 {
      color: #000000;
      font-size: 32px;
      position: relative;
      line-height: 32px;
      margin: 0px;
      padding-left: 20px;
      letter-spacing: -1px;
      :before {
        content: '';
        position: absolute;
        left: 0px;
        top: 12px;
        width: 12px;
        height: 12px;
        background: url(${StarIcon}) no-repeat;
      }
    }
  }
  .heart-title {
    border-bottom: 1px solid #dddddd;
    text-align: left;
    margin-bottom: 30px;
    h3 {
      color: #000000;
      font-size: 32px;
      position: relative;
      line-height: 32px;
      margin: 0px 0px 15px;
      padding-left: 20px;
      letter-spacing: -1px;
      :before {
        content: '';
        position: absolute;
        left: 0px;
        top: 12px;
        width: 12px;
        height: 11px;
        background: url(${HeartIcon}) no-repeat;
      }
    }
  }
`;
const AdBanner2 = styled.div`
  height:540px;
  width:100%;
  overflow:hidden;
  position:relative;
  // ${Media.md}{
  //   height:auto;
  // }
  ${Media.sm}{
    height:486px;
  }
  a{
    margin-bottom:-4px; display:block; width:100%; height:100%;
    img{width: 100%; height: 100%; object-fit: cover;
      // ${Media.md}{
      //   object-fit:contain;
      // }
      ${Media.sm}{
        object-fit:cover;
      }
      &.desk-img
      {
        ${Media.xs}{
          display:none;
        }
      }
      &.mobile-img
      {
        display:none;
        ${Media.xs}{
          display:block;
        }
      }
    }
  }
  button {
    position:absolute;
    bottom:50px;
    left:calc(50% - 95px);
    background-color: #f40058;
    color: #fff;
    font-size: 14px;
    letter-spacing: -0.5px;
    font-weight: 700;
    border-radius: 15px;
    width: 190px;
    height: 44px;
    :hover {
      background-color: #000;
      box-shadow: 2px 5px 10px 0px rgb(0 0 0 / 30%);
    }
    ${Media.md}{
      bottom:20px;
    }
    ${Media.sm}{
      bottom:70px;
    }
  }
`;
const mapDipatchToProps = (dispatch) => {
  return {
    getInfo: () => dispatch(actions.fetcInfo()),
    setInfos: (data) => dispatch({ type: 'FETCHED_INFO', data: data })
  }
}

const mapStateToProps = (state) => {
  return {
    infos: state.fetchDashboardInfo,
  }
}

export default withCookies(connect(mapStateToProps, mapDipatchToProps)(Info));
