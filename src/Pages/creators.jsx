import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from "react-intl";
import Gs from '../Theme/globalStyles';
import { connect } from "react-redux";
import Collapse from '@kunukn/react-collapse'
import InfiniteScroll from 'react-infinite-scroll-component'

import { actions } from "../actions";
import { Context } from '../Component/wrapper';
import CreatorCard from "../Component/Cards/creatorCard";

import NftImg from '../Assets/images/nftBack.jpg';
import SerICON from '../Assets/images/searchICO.svg';
import FiltICON02 from '../Assets/images/sortICO.svg';
import LoaderGif from '../Assets/images/loading.gif'
import UserImg01 from '../Assets/images/userImg.png'

import Media from "./../Theme/media-breackpoint";
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

class Creators extends Component {

    static contextType = Context;
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            isOpen1: false,
            tabPanel: 'all',
            searched: false,
            ranked: false,
            page: 1,
            creators: [],
        }
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        document.addEventListener('mousedown', this.handleClickOutside);
        const { creators, categories } = this.props;
        if (!creators) {
            this.props.getCreators() // fetch creators
        } else {
            this.setState({ creators: creators })
        }
        if (!categories) {
            this.props.getCategories() // fetch categories
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { creators, moreCreators } = this.props;
        if (moreCreators !== prevProps.moreCreators) {
        this.setState({ creators: this.state.creators.concat(moreCreators) })
        }
        if (creators !== prevProps.creators) {
        this.setState({ creators: creators })
        }
    }

    handleClickOutside(event) {
        if (
            this.wrapperRef &&
            this.wrapperRef.current &&
            !this.wrapperRef.current.contains(event.target)
        ) {
            if (this.state.isOpen1) {
                this.setState({ isOpen1: false });
            }
        }
    }

    clearPreviousCreators = () => {
        this.props.clearCreators() // clear the previous creators
        this.props.clearMoreCreators() // clear the previous more creators
        this.props.clearPagination() // clear the previous pagination
    }

    onSearchKeyUp = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            this.clearPreviousCreators()
            this.setState({ page: 1 })
            this.props.getCreators({ 'search': e.target.value }) // fetch search creators
        }
    }

    setRank = (rank) => {
        this.clearPreviousCreators()
        this.setState({ page: 1 })
        this.props.getCreators({ 'rank': rank, tabPanel: 'all', page: 1 }) // fetch rank creators
    }

    onCategoryChange = (category) => {
        this.clearPreviousCreators()
        if (category === 'all') {
            this.props.getCreators() // fetch creators
        } else {
            this.props.getCreators({ 'category': [category] }) // fetch category creators
        }
        this.setState({ tabPanel: category, page: 1 })
    }

    fetchMore = () => {
        const { searched, ranked, tabPanel, page } = this.state
        this.setState({ page: page + 1 })
        let params = {
            'page': page + 1,
            'search': searched ? searched : null,
            'rank': ranked ? ranked : null,
            'category': tabPanel !== 'all' ? tabPanel : [],
        }
        this.props.getMoreCreators(params) // fetch more creators
    }

    render() {
        const { categories, pagination } = this.props;
        const { tabPanel, page, creators } = this.state;
        let context = this.context;
        return (
            <Gs.MainSection>
                <Gs.Container>
                    <FilterMBX>
                        <FilterLbx>
                            <CustomScrollbars
                                autoHide
                                autoHideTimeout={1000}
                                style={{ width: "100%", height: "70px", position: "relative" }}
                            >
                                <button className={tabPanel === 'all' ? 'active' : ''} id='all' onClick={() => { this.onCategoryChange('all') }}>
                                    <FormattedMessage id="all" defaultMessage="All" />
                                </button>
                                {categories ? categories.map((category, key) => {
                                    return <button id={category.id} key={key} className={tabPanel === category.id ? 'active' : ''} onClick={() => { this.onCategoryChange(category.id) }} >
                                        {context.locale === 'tr' ? category.categoryName.tu : category.categoryName.en}
                                    </button>
                                }) : ''}
                            </CustomScrollbars>
                        </FilterLbx>

                        <FilterRbx>
                            <FilterInputBX>
                                <FormattedMessage id="search" defaultMessage="Search">
                                    {placeholder =>
                                        <input
                                            placeholder={placeholder}
                                            onKeyUp={(e) => this.onSearchKeyUp(e)}
                                        />}
                                </FormattedMessage>
                                <SearchICO><img src={SerICON} alt="" /> </SearchICO>
                            </FilterInputBX>
                            <FilterBAR
                                onClick={() => this.toggle(1)}
                                className={(this.state.isOpen1 ? 'active' : '')}
                                ref={this.wrapperRef}
                            >
                                <FilterICO><img src={FiltICON02} alt="" /></FilterICO>
                                <FormattedMessage id="rank" defaultMessage="Rank" />
                                <Collapse isOpen={this.state.isOpen1} className={'app__collapse collapse-css-transition  ' + (this.state.isOpen1 ? 'collapse-active' : '')}>
                                    <DDContainer>
                                        <DDBTN01 onClick={() => { this.setRank('name') }}>
                                            <FormattedMessage id='by_username' defaultMessage='by Username' />
                                        </DDBTN01>
                                        <DDBTN01 onClick={() => { this.setRank('follower') }}>
                                            <FormattedMessage id='by_follower' defaultMessage='by Follower' />
                                        </DDBTN01>
                                    </DDContainer>
                                </Collapse>
                            </FilterBAR>
                        </FilterRbx>
                    </FilterMBX>


                    {creators ?
                        creators.length === 0 ?
                            <NoDataFound>
                                No <FormattedMessage id="creators" defaultMessage="Creators" /> Found
                            </NoDataFound>
                            :
                            <InfiniteScroll className="IScroll"
                                dataLength={creators.length}
                                next={this.fetchMore}
                                hasMore={pagination.pageNo < pagination.totalPages}
                                loader={<LoaderBX> <img src={LoaderGif} alt="" /> </LoaderBX>}
                            // endMessage={<p>You have seen it all.!</p>}
                            >

                                <CreatorMBX>
                                    {creators.map((creator, key) => {
                                        return <CreatorCard
                                            key={key}
                                            id={creator.id}
                                            cover={creator.cover}
                                            profile={creator.profile}
                                            name={creator.name}
                                            username={creator.username}
                                            bio={creator.bio}
                                            nftCreated={creator.nftCreated}
                                            followersCount={creator.followersCount}
                                            followingCount={creator.followingCount}
                                        />
                                    })}
                                </CreatorMBX>

                            </InfiniteScroll>
                        : <LoaderBX>
                            <img src={LoaderGif} alt="" />
                        </LoaderBX>}
                </Gs.Container>
            </Gs.MainSection>
        );
    }
    toggle = index => {
        let collapse = 'isOpen' + index;
        this.setState(prevState => ({ [collapse]: !prevState[collapse] }));
    };
}
// Common Style Div 
const FlexDiv = styled.div`
display: flex; align-items: center; justify-content:center; flex-wrap:wrap;
`;
const LoaderBX = styled(FlexDiv)`
  width:100%;  margin:50px auto;  
`
const FilterMBX = styled(FlexDiv)`
  width:100%; justify-content:space-between; max-width:1080px; margin:60px auto 0 auto;
  ${Media.lg}{
    max-width:100%;
  }
  ${Media.md}{
    margin:40px auto 0 auto;
  }
`
const FilterLbx = styled(FlexDiv)`
 width:55%; justify-content:flex-start;
 .view{
    display:flex;
    align-items:center;
    padding-right:20px;
  }
 button{display:inline-block;padding: 10px 25px; font-size:14px; font-weight:600; color:#000000; border-radius: 15px; background-color: #eef2f7; margin:0px 6px 0px 0px;  
  &.active{ background-color:#00babc; color:#fff; } 
  :hover{ background-color:#00babc; color:#fff; box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2); }
  :last-child{margin:0px;}
  ${Media.sm}{
    padding: 10px 19px;
  }
 } 
 ${Media.lg}{
    width:45%;
  }
 ${Media.md}{
    width:100%;
  }
`
const FilterRbx = styled(FlexDiv)`
 width:45%; justify-content:flex-end;
 ${Media.lg}{
    width:55%;
  }
 ${Media.md}{
    width:100%;
    justify-content: space-between;
    margin-top:15px;
  } 
`
const FilterInputBX = styled(FlexDiv)`
  width:100%; max-width:220px; position:relative; margin-right: 9px; 
  input{ background-color:#eef2f7; font-size:14px; border-radius:15px; border:1px solid transparent; outline:none; height:38px; width:100%; padding:3px 3px 3px 40px;
  :focus{background-color:#fff; border:1px solid #00babc; box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);}
  } 
  ${Media.md}{
    max-width:calc(50% - 5px);
  }
`
const SearchICO = styled(FlexDiv)`
  width:21px; height:21px; position:absolute; left: 11px;  top: 9px;
`
const FilterICO = styled(FlexDiv)`
  width:21px; height:21px; position:absolute; left: 11px;  top: 9px;
`
const FilterBAR = styled(FlexDiv)`
   width:100%; max-width:220px; justify-content:flex-start; position:relative; background-color:#eef2f7; border-radius:15px; border:0px; outline:none; height:38px;padding:3px 3px 3px 40px; font-size:14px; color:#000000;  cursor: pointer; border:1px solid transparent;  
  &.active, &:hover{ background-color:#fff; border:1px solid #00babc; box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2); }  
  ${Media.md}{
    max-width:calc(50% - 5px);
  }
`
const DDContainer = styled(FlexDiv)` 
    position:absolute; background-color:#fff; padding:15px; border-radius: 20px; box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2); top:calc(100% + 7px); width:100%; left:0;  overflow:hidden; z-index:100;   
  & .md-checkbox:hover{ background-color:#D9F5F5;} 
`
const CreatorMBX = styled(FlexDiv)`
 margin:10px -10px 40px -10px; justify-content:flex-start; align-items:flex-start; overflow:hidden;
 ${Media.md}{
    margin:40px -10px 40px -10px;
  }
`

const DDBTN01 = styled.button`
    font-size:12px; color:#000; padding:4px 12px; width:100%; text-align:left; margin:4px 0;

    :hover{ background-color:#D9F5F5;}
`

const NoDataFound = styled(FlexDiv)`
  width: 100%;
  text-align:center;
  font-size:16px;
  color:#000;
  margin:100px 0px;
`;


const mapDipatchToProps = (dispatch) => {
    return {
        getCreators: (params) => dispatch(actions.getCreators(params)),
        getCategories: () => dispatch(actions.fetchCategories()),
        getMoreCreators: (params) => dispatch(actions.getMoreCreators(params)),
        clearCreators: () => dispatch({ type: 'FETCHED_CREATORS', data: [] }),
        clearPagination: () => dispatch({ type: 'FETCHED_PAGINATION', data: [] }),
        clearMoreCreators: () => dispatch({ type: 'FETCHED_MORE_CREATORS', data: [] }),
    }
}

const mapStateToProps = (state) => {
    return {
        creators: state.fetchCreators,
        moreCreators: state.fetchMoreCreators,
        pagination: state.fetchPagination,
        categories: state.fetchCategory,
    }
}

export default connect(mapStateToProps, mapDipatchToProps)(Creators);