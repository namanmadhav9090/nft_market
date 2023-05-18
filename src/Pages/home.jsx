import React from 'react';
import loadable from '@loadable/component'
import { connect } from 'react-redux';
import { instanceOf } from 'prop-types';
import LazyLoad from "react-lazyload";
import { withCookies, Cookies } from 'react-cookie';
import Gs from '../Theme/globalStyles';

import { actions } from '../actions';
import { expiryTime } from '../config';
import styled from "styled-components";

const Banner = loadable(() => import('../Component/home/banner'))
const TopNFT = loadable(() => import('../Component/home/topNFT'))
const HallOfFrame = loadable(() => import('../Component/home/hall.frame'))
const Collections = loadable(() => import('../Component/home/collection'))
const Info = loadable(() => import('../Component/home/info'))
const HallOfFrameInfo = loadable(() => import('../Component/home/hall.frame.info'))


class Home extends React.Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            loading: false,
            dashboard: cookies.get('dashboard') || null,
        }
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        const { dashboard, cookies } = this.props;
        if (!this.state.dashboard && !dashboard) {
            this.props.getDashboard() // fetch dashboard config
        } else {
            this.props.setDashboard(cookies.get('dashboard'))
        }
    }

    componentDidUpdate() {
        const { dashboard, cookies } = this.props
        if (dashboard && !cookies.get('dashboard')) {
            this.setCookie(dashboard) // set dashboard data in cookie
        }
    }

    setCookie = (dashboard) => {
        const { cookies } = this.props;
        const expire = new Date(Date.now() + (expiryTime * 60 * 60 * 1000)) // cookie will expire after 12 hours
        cookies.set('dashboard', dashboard, { path: '/', expires: expire });
    }


    render() {
        return (
            <Gs.MainSection className="mt-0">
                <LazyLoad>
                    {this.props.dashboard ?
                        this.props.dashboard.map((data, index) => {
                            if (data.name === 'Banner' && data.isActive) {
                                return <Banner key={index} />
                            } else if (data.name === 'Top Nft' && data.isActive) {
                                return <TopNFT key={index} />
                            } else if (data.name === 'Hall Of Frame' && data.isActive) {
                                return <HallOfFrame key={index} />
                            } else if (data.name === 'Hall Of Frame' && !data.isActive) {
                                return <HallOfFrameInfo key={index} />
                            } else if (data.name === 'Collections' && data.isActive) {
                                return <Collections key={index} />
                            } else if (data.name === 'Info' && data.isActive) {
                                return <Info key={index} />
                            } else {
                                return ''
                            }
                        })
                        : 'loading'}
                </LazyLoad>
            </Gs.MainSection>
        )
    }
}

Gs.MainSection = styled(Gs.MainSection)`
  &.mt-0{
    margin-top:0px;
  }
`;

const mapDipatchToProps = (dispatch) => {
    return {
        getDashboard: () => dispatch(actions.fetchDashboardConfig()),
        setDashboard: (data) => dispatch({ type: 'FETCHED_DASHBOARD', data: data })
    }
}

const mapStateToProps = (state) => {
    return {
        dashboard: state.fetchDashboard,
    }
}

export default withCookies(connect(mapStateToProps, mapDipatchToProps)(Home));