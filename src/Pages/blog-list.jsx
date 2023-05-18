import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Gs from "../Theme/globalStyles";
import { Link } from "react-router-dom";
import Collapse from "@kunukn/react-collapse";
import Media from "../Theme/media-breackpoint";

import SerICON from '../Assets/images/searchICO.svg';
import NFT2 from "../Assets/images/nft1.jpg";
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
class BlogList extends Component {

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

  render() {
    return (
      <Gs.MainSection>
        <Gs.Container>
          <BlogListtitle>Carny Blog</BlogListtitle>
          <FilterMBX>
            <FilterLbx>
              <CustomScrollbars
                autoHide
                autoHideTimeout={1000}
                style={{ width: "100%", height: "70px", position: "relative" }}
              >
                <button className="active" id="all">All</button>
                <button className="">Art</button>
                <button className="">Celebrity</button>
                <button className="">Sport</button>
              </CustomScrollbars>
            </FilterLbx>
            <FilterRbx>
              <FilterInputBX>
                <input placeholder='Search' />
                <SearchICO>
                  <img src={SerICON} alt='' />
                </SearchICO>
              </FilterInputBX>
            </FilterRbx>
          </FilterMBX>
          <NFTfourbox>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
            <Gs.W25V2>
              <Gs.TenpxGutter>
                <Link to='/'>
                  <div className="NFT-home-box">
                    <ImgOuter>
                      <img src={NFT2} alt="" />
                    </ImgOuter>
                    <div className="NFT-home-box-inner">
                      <h4>
                        Content name / title dolor lorem ipsum sit adipiscing
                      </h4>
                      <p>Lorem ipsum dolor sit amet, consectetur ascing elit. Phasellus at dui imperdiet, eleifend lacus gravida, accumsan arcu.</p>
                      <p className="date">13.07.2021</p>
                    </div>
                  </div>
                </Link>
              </Gs.TenpxGutter>
            </Gs.W25V2>
          </NFTfourbox>
        </Gs.Container>
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
`;
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;
const BlogListtitle = styled.div`
  font-size:32px; letter-spacing:-1.52px; font-weight:700; color:#000; margin:60px 0px 20px;
  ${Media.sm}{
    font-size:24px;
  }
`;

const FilterMBX = styled(FlexDiv)`
  width: 100%;
  justify-content: space-between;
  max-width: 1080px;
  margin: 30px auto 20px;
  ${Media.lg}{
    max-width:100%;
  }
  ${Media.md}{
    margin:0px auto 20px;
  }
`;

const FilterLbx = styled(FlexDiv)`
  width:45%; justify-content: flex-start;
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
    margin:0px 6px 0px 0px;
    &.active {
      background-color: #00babc;
      color: #fff;
    }
    :hover {
      background-color: #00babc;
      color: #fff;
      box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
    }
    :last-child
    {
      margin:0px;
    }
    ${Media.sm}{
      padding: 10px 19px;
    }
  }
  ${Media.md}{
    width:100%;
  }
`;
const FilterRbx = styled(FlexDiv)`
  width: 55%;
  justify-content: flex-end;
  ${Media.md}{
    width:100%;
    justify-content: flex-start;
    margin-top:20px;
  }
`;
const FilterInputBX = styled(FlexDiv)`
  width: 100%;
  max-width: 220px;
  position: relative;
  margin-right: 9px;
  input {
    background-color: #eef2f7;
    font-size: 14px;
    border-radius: 15px;
    border: 1px solid transparent;
    outline: none;
    height: 38px;
    width: 100%;
    padding: 3px 3px 3px 40px;
    :focus {
      background-color: #fff;
      border: 1px solid #00babc;
      box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
    }
  }
  ${Media.md}{
    max-width:100%;
    margin-right:0px;
  }
`;
const SearchICO = styled(FlexDiv)`
  width: 21px;
  height: 21px;
  position: absolute;
  left: 11px;
  top: 9px;
`;
const ImgOuter = styled.div`
  width:100%;
  height:255px;
  border-top-left-radius:10px;
  border-top-right-radius:10px;
  overflow:hidden;
  img {
    width: 100%;
    height:100%;
    object-fit:cover;
  }
`;

const NFTfourbox = styled(FlexDiv)`
  justify-content:flex-start;
  margin: 0px -10px 120px;
  .row {
    margin: 0px -10px;
  }
  a{
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
          min-height:44px;
        }
        p{
          margin: 0px 0px 20px;
          font-size: 12px;
          color: #000000;
          line-height: 16px;
          letter-spacing: -0.3px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 3;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          min-height:48px;
          &.date{
            font-weight:600; color:#8e9194; margin:0px; min-height:auto;
          }
        }
      }
      :hover{
        box-shadow:0 10px 10px 0 rgb(0 0 0 / 20%);
      }
    }
  }
 
`;

export default BlogList;
