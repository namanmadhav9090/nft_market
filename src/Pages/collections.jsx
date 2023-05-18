import "react-multi-carousel/lib/styles.css";
import "react-tabs/style/react-tabs.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import InfiniteScroll from 'react-infinite-scroll-component';
import Gs from "../Theme/globalStyles";
import { actions } from "../actions";
import { Context } from '../Component/wrapper';
import CollectionCard from "../Component/Cards/collectionCard";
import LoaderGif from "../Assets/images/loading.gif";
import SerICON from "../Assets/images/searchICO.svg";

import Media from '../Theme/media-breackpoint';
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

class Collection extends Component {

  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      tabPanel: 'all',
      searched: false,
      page: 1,
      collections: [],
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const { categories, collections } = this.props;
    if (!collections) {
      this.props.getCollections() // fetch collections
    } else {
      this.setState({ collections: collections })
    }
    if (!categories) {
      this.props.getCategories() // fetch categories
    }
  }

   async componentDidUpdate(prevProps, prevState) {
    const { collections, moreCollections } = this.props;
    if (moreCollections !== prevProps.moreCollections) {
      this.setState({ collections: this.state.collections.concat(moreCollections) })
    }
    if (collections !== prevProps.collections) {
      this.setState({ collections: collections })
    }
  }

  fetchMore = () => {
    const { searched, tabPanel, page } = this.state;
    this.setState({ page: page + 1 });
    let params = {
      page: page + 1,
      search: searched ? searched : null,
      category: tabPanel !== 'all' ? tabPanel : [],
    };
    this.props.getMoreCollections(params); // fetch more collections
  };

  clearPreviousCollections = () => {
    this.props.clearCollections(); // clear the previous collections
    this.props.clearMoreCollections(); // clear the previous more collections
    this.props.clearPagination(); // clear the previous pagination
  };

  onSearchKeyUp = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.clearPreviousCollections();
      this.setState({ page: 1 });
      this.props.getCollections({ search: e.target.value }); // fetch search collections
    }
  };

  onCategoryChange = (category) => {
    this.clearPreviousCollections();
    if (category === 'all') {
      this.props.getCollections(); // fetch collections
    } else {
      this.props.getCollections({ category: [category] }); // fetch filter collections
    }
    this.setState({ tabPanel: category, page: 1 });
  };

  render() {
    const { pagination, categories } = this.props;
    const { tabPanel, page, collections } = this.state;
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
                <button
                  className={tabPanel === 'all' ? 'active' : ''}
                  id='all'
                  onClick={() => {
                    this.onCategoryChange('all');
                  }}
                >
                  <FormattedMessage id="all" defaultMessage="All" />
                </button>
                {categories
                  ? categories.map((category, key) => {
                    return (
                      <button
                        id={category.id}
                        key={key}
                        className={tabPanel === category.id ? 'active' : ''}
                        onClick={() => {
                          this.onCategoryChange(category.id);
                        }}
                      >
                        {context.locale === 'tr' ? category.categoryName.tu : category.categoryName.en}
                      </button>
                    );
                  })
                  : ''}
              </CustomScrollbars>
            </FilterLbx>

            <FilterRbx>
              <FilterInputBX>
                <FormattedMessage id="search" defaultMessage="Search">
                  {placeholder=>
                    <input
                      placeholder={placeholder}
                      onKeyUp={(e) => this.onSearchKeyUp(e)}
                    />}
                </FormattedMessage>
                <SearchICO>
                  <img src={SerICON} alt="" />
                </SearchICO>
              </FilterInputBX>
            </FilterRbx>
          </FilterMBX>
          <CollectionBoxes>
            {collections ?
              collections.length === 0 ?
                <NoDataFound>
                  <FormattedMessage id="coll_empty" defaultMessage="No Collections Found" />
                </NoDataFound>
                :
                <InfiniteScroll
                  dataLength={collections.length}
                  next={this.fetchMore}
                  hasMore={pagination.pageNo < pagination.totalPages}
                  loader={
                    <LoaderBX>
                      {' '}
                      <img src={LoaderGif} alt='' />{' '}
                    </LoaderBX>
                  }
                // endMessage={<p>You have seen it all.!</p>}
                >
                  <CollectionBoxesInner>

                    {collections.map((collection, key) => (
                      <CollectionCard
                        key={key}
                        id={collection.id}
                        collImg={collection.logo}
                        collName={collection.name}
                        creatorName={collection.ownerId?.username}
                      />
                    ))}
                  </CollectionBoxesInner>
                </InfiniteScroll>
              : (<LoaderBX> {' '} <img src={LoaderGif} alt='' />{' '} </LoaderBX>)}
          </CollectionBoxes>
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
const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 50px auto;
`;

const NoDataFound = styled(FlexDiv)`
  width: 100%;
  text-align:center;
  font-size:16px;
  color:#000;
  margin:100px 0px;
`;

const FilterMBX = styled(FlexDiv)`
  width: 100%;
  justify-content: space-between;
  max-width: 1080px;
  margin: 50px auto 0 auto;
  ${Media.lg}{
    max-width:100%;
  }
  ${Media.md}{
    margin:40px auto 0 auto;
  }
`;

const FilterLbx = styled(FlexDiv)`
  width: 75%;
  justify-content: flex-start;
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
  ${Media.lg}{
    width:70%;
  }
  ${Media.md}{
    width:100%;
  }
`;
const FilterRbx = styled(FlexDiv)`
  width: 25%;
  justify-content: flex-end;
  ${Media.lg}{
    width:30%;
  }
  ${Media.md}{
    width:100%;
    justify-content: flex-start;
    margin-top:15px;
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

const CollectionBoxes = styled.div`
  margin:20px -10px 120px;
  ${Media.md}{
    margin:40px -10px 60px;
  }
`;

const CollectionBoxesInner = styled(FlexDiv)`
  justify-content:flex-start;
`;

const OneCollBox = styled.div`
  width:calc(25% - 20px);
  margin:0px 10px 20px 10px;
  position:relative;
  .CIbox
  {
    width: 100%;
    height: 255px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .collbox-desc
  {
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    background-color:rgb(0 0 0 / 70%);
    border-radius:10px;
    padding:20px 10px 0px 20px;
    opacity:0;
    :hover
    {
      opacity:1;
    }
    .coll-title
    {
      font-size:20px;
      color:#fff;
      letter-spacing:-0.75px;
      font-weight:700;
      margin:0px 0px 2px;
      text-transform:capitalize;
    }
    .creator-name
    {
      font-size:16px;
      color:rgb(255 255 255 / 50%);
      letter-spacing:-0.8px;
      font-weight:600;
      margin:0px;
    }
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getCollections: (params) => dispatch(actions.getCollections(params)),
    getCategories: () => dispatch(actions.fetchCategories()),
    getMoreCollections: (params) => dispatch(actions.getMoreCollections(params)),
    clearPagination: () => dispatch({ type: 'FETCHED_PAGINATION', data: [] }),
    clearMoreCollections: () => dispatch({ type: 'FETCHED_MORE_COLLECTIONS', data: [] }),
    clearCollections: () => dispatch({ type: 'FETCHED_COLLECTIONS', data: [] }),
  }
}
const mapStateToProps = (state) => {
  return {
    collections: state.fetchCollections,
    categories: state.fetchCategory,
    pagination: state.fetchPagination,
    moreCollections: state.fetchMoreCollections,
  }
}

export default connect(mapStateToProps, mapDipatchToProps)(Collection);
