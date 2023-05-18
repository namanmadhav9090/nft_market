import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import CloseBTN01 from "../../Assets/images/closeBTN01.svg";
import Media from '../../Theme/media-breackpoint';
import { FormattedMessage } from "react-intl";


class SuccessPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
    };
  }

  toggle = (index) => {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  }

  render() {
    const { message, url } = this.props;
    const { isOpen1 } = this.state
    return (
      <>
        {!isOpen1 ?
          <BlackWrap>
            <WhiteBX01>
              <CloseBTN className="ani-1" onClick={() => this.toggle(1)}>
                {" "}
                <img src={CloseBTN01} alt="" />{" "}
              </CloseBTN>
              <TokenBox >
                <p >{message}</p>
                <button onClick={() => this.props.history.push(url)}>
                  <FormattedMessage id="view" defaultMessage="View" />
                </button>
              </TokenBox>
            </WhiteBX01>
          </BlackWrap>
          : ''}
      </>
    );
  }
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  .JCSB {
    justify-content: space-between;
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
  ${Media.xs}{
    right: 15px;
    top: 15px;
  }
`;
const TokenBox = styled(FlexDiv)`
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  button {
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
  p {
    text-align: center;
  }
`;

export default withRouter(SuccessPopup);