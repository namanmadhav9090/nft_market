import React, { useContext, useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import Collapse from "@kunukn/react-collapse";

import { Context } from "./wrapper";
import Media from "../Theme/media-breackpoint";
import { connect } from "react-redux";
import { actions } from "../actions";

const Language = (props) => {
  const context = useContext(Context);
  const wrapperRef = useRef(null);
  const [toggle, setToggle] = useState(false);
  const header = props.header;

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        if (toggle) setToggle(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, toggle]);
  useEffect(() => {
    let lng = localStorage.getItem("avangartLanguage")
      ? localStorage.getItem("avangartLanguage")
      : "en";
    context.selectLanguage(lng);
    props.setLanguage(lng);
  }, []);

  const onClick = (lng) => {
    setToggle((toggle) => !toggle);
    context.selectLanguage(lng);
    localStorage.setItem("avangartLanguage", lng);
    props.setLanguage(lng);
  };

  const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  `;

  const LanBTN = styled(FlexDiv)`
    margin-left: 30px;
    position: relative;
    button {
      font-size: 12px;
      font-weight: 600;
      color: #000;
      &.Lang-text {
        ${Media.md} {
          display: none;
        }
      }
    }
    ${Media.md} {
      position: absolute;
      right: 60px;
      left: auto;
      top: 0px;
      .app__collapse {
        opacity: 1;
        overflow: visible !important;
        visibility: visible !important;
        height: auto !important;
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
    }
    ${Media.md} {
      box-shadow: none;
      width: max-content;
      padding: 0px;
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
      ${Media.md} {
        font-size: 18px;
      }
    }
  `;
  const LanBTNF = styled(FlexDiv)`
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
  const DDContainerF = styled(FlexDiv)`
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
  const DDBtnbar01F = styled(FlexDiv)`
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

  return (
    <>
      {header ? (
        <LanBTN ref={wrapperRef}>
          <button
            className="Lang-text"
            onClick={() => {
              setToggle((toggle) => !toggle);
            }}
          >
            <FormattedMessage id="language" defaultMessage="LANG" />
            <i className="fas fa-chevron-down"></i>
          </button>
          <Collapse
            isOpen={toggle}
            className={
              "app__collapse collapse-css-transition  " +
              (toggle ? "collapse-active" : "")
            }
          >
            <DDContainer>
              <DDBtnbar01>
                <button
                  className={context.locale.includes("en") ? "active" : ""}
                  onClick={() => onClick("en")}
                >
                  ENG
                </button>
                |{" "}
                <button
                  className={context.locale === "tr" ? "active" : ""}
                  onClick={() => onClick("tr")}
                >
                  TU
                </button>
              </DDBtnbar01>
            </DDContainer>
          </Collapse>
        </LanBTN>
      ) : (
        <LanBTNF ref={wrapperRef}>
          <button
            className="Lang-text"
            onClick={() => {
              setToggle((toggle) => !toggle);
            }}
          >
            <FormattedMessage id="language" defaultMessage="LANG" />
            <i className="fas fa-chevron-down"></i>
          </button>
          <Collapse
            isOpen={toggle}
            className={
              "app__collapse collapse-css-transition  " +
              (toggle ? "collapse-active" : "")
            }
          >
            <DDContainerF>
              <DDBtnbar01F>
                <button
                  className={context.locale.includes("en") ? "active" : ""}
                  onClick={() => onClick("en")}
                >
                  ENG
                </button>
                |{" "}
                <button
                  className={context.locale === "tr" ? "active" : ""}
                  onClick={() => onClick("tr")}
                >
                  TU
                </button>
              </DDBtnbar01F>
            </DDContainerF>
          </Collapse>
        </LanBTNF>
      )}
    </>
  );
};

const mapDipatchToProps = (dispatch) => {
  return {
    setLanguage: (lng) => dispatch(actions.setLanguage(lng)),
  };
};

export default connect(null, mapDipatchToProps)(Language);
