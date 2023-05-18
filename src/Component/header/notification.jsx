import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';

import React, { Component } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { actions } from "../../actions";
import LoaderGif from '../../Assets/images/loading.gif';
import Media from "../../Theme/media-breackpoint";



class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.getNotifications() // fetch user notifications
  }

  render() {
    let { notifications, lng } = this.props;
    return (
      <>
        {notifications ?

          <NotificationSBX01>

            <Notificationtitle>
              <FormattedMessage id="notifications" defaultMessage="Notifications" />
            </Notificationtitle>
            {notifications.length > 0 ? notifications.map((notification) => {
              return <button
                key={notification.id}
                onClick={() => this.props.history.push(notification.route ? notification.route : '/')}>
                {lng === 'en' && notification.text.en}
                {lng === 'tr' && notification.text.tu}
              </button>
            }) :
              <button>
                <FormattedMessage
                  id="no_notifications"
                  defaultMessage="No Notifications Found"
                />
              </button>
            }

          </NotificationSBX01>

          : <LoaderBX>
            <img src={LoaderGif} alt="" />
          </LoaderBX>}
      </>
    )
  }
}

// Common Style Div 
const FlexDiv = styled.div`
    display: flex; align-items: center; justify-content:center; flex-wrap:wrap;
`;

const LoaderBX = styled(FlexDiv)`
  width:100%;  margin:50px auto;  
`

const NotificationSBX01 = styled(FlexDiv)`
  align-items: flex-start;
  justify-content: flex-start;
 
  button {
    width: 100%;
    height: auto;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    display: block;
    text-align: left;
    padding: 15px;
    border-bottom: 1px solid #eef2f7;
    // :last-child
    // {
    //   ${Media.md} {
    //     padding-bottom:40px;
    //   }
    // }
    span {
      font-size: 10px;
      font-weight: 400;
      display: block;
      width: 100%;
      margin-top: 5px;
    }
    :hover {
      background-color: #d9f5f5;
    }
    ${Media.md} {
      padding:20px 35px 20px 25px;
    }
  }
`;

const Notificationtitle = styled.div`
  font-size:24px;
  color:#000000;
  letter-spacing:-1.07px;
  font-weight:600;
  margin:20px 0px 20px;
  display:none;
  ${Media.md} {
    display:block;
    padding: 0px 25px;
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getNotifications: () => dispatch(actions.getNotifications()),
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.fetchNotifications,
    lng: state.fetchLanguage,
  }
}

export default withRouter(connect(mapStateToProps, mapDipatchToProps)(Notifications));