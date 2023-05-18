import React, { useEffect, useState, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Collapse from '@kunukn/react-collapse';
import { FormattedMessage } from 'react-intl';
import Media from '../Theme/media-breackpoint';
import styled from 'styled-components';

import CloseBTN01 from '../Assets/images/closeBTN01.svg';
import FiltICON from '../Assets/images/filterICO.svg';
import UserIcon from '../Assets/images/userIcon.png';
import { web3 } from '../web3';

function CustomScrollbars(props) {
  return (
    <Scrollbars
      renderTrackVertical={(props) => (
        <div {...props} className='track-vertical' />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className='thumb-vertical' />
      )}
      renderView={(props) => <div {...props} className='view' />}
      autoHide
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}

function SelectEdition(props) {
  const [totalEditions, setTotalEditions] = useState([]);
  const [filterPopup, setFilterPopup] = useState([]);
  const [editions, setEditions] = useState([]);
  const [filter, setFilter] = useState([]);
  const [tab, setTab] = useState('All');
  const wrapperRef = useRef(null);
  const { NFTDetails, web3Data } = props;

  const toggle = (index) => {
    let tVal = filterPopup === index ? '' : index;
    setFilterPopup(tVal);
  };

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
        if (filterPopup === 1) toggle(1);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, filterPopup, toggle]);

  useEffect(() => {
    const tabEditions = () => {
      let saleEditions = totalEditions
        .filter((edition) => (tab === 'Sale' ? edition.isOpenForSale : edition))
        .map((edition) => edition);
      setEditions(saleEditions); // set the filtered editions
    };
    tabEditions(); // filter the tab editions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    const filterEditions = () => {
      let saleEditions = [];
      if (filter === 'AUCTION')
        saleEditions = totalEditions
          .filter((edition) => edition.saleState === 'AUCTION')
          .map((edition) => edition);
      if (filter === 'BUY')
        saleEditions = totalEditions
          .filter((edition) => edition.saleState === 'BUY')
          .map((edition) => edition);
      if (filter === 'SOLD')
        saleEditions = totalEditions
          .filter((edition) => edition.saleState === 'SOLD')
          .map((edition) => edition);
      if (filter === 'OFFER')
        saleEditions = totalEditions
          .filter((edition) => edition.saleState === 'OFFER')
          .map((edition) => edition);
      if (filter.length === 0) saleEditions = totalEditions;
      setEditions(saleEditions); // set the filtered editions
    };
    filterEditions(); // filter the editons
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    const createEditionData = () => {
      let editionsData = [];
      if (NFTDetails)
        for (let i = 0; i < NFTDetails.edition; i++) {
          const soldEdition = NFTDetails.editions.find(
            ({ edition }) => edition === i + 1
          );
          if (soldEdition) {
            editionsData.push({
              number: Number(soldEdition.edition),
              isOwner:
                web3Data.accounts[0] ===
                web3.utils.toChecksumAddress(soldEdition.walletAddress),
              ownerId: soldEdition.ownerId,
              isOpenForSale: soldEdition.isOpenForSale,
              saleState: soldEdition.saleType.type
                ? soldEdition.saleType.type
                : 'SOLD',
              price: soldEdition.isOpenForSale
                ? soldEdition.saleType.price
                : soldEdition.price,
              isBurned: soldEdition.isBurned,
            });
          } else {
            editionsData.push({
              number: i + 1,
              isOwner: NFTDetails?.ownerId.id === props.authData?.data?.id,
              ownerId: NFTDetails?.ownerId,
              isOpenForSale: true,
              saleState:
                NFTDetails?.saleState === 'AUCTION'
                  ? NFTDetails?.auctionEndDate > new Date().getTime() / 1000
                    ? 'AUCTION'
                    : 'BUY'
                  : 'BUY',
              price: NFTDetails.price,
              isBurned: false,
            });
          }
        }
      setTotalEditions(editionsData); // set the total editions
      setEditions(editionsData); // set the editions
    };
    createEditionData(); // fetch the editions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NFTDetails, web3Data]);

  const changeHandler = (action, { target: { checked, value } }) => {
    if (checked) setFilter(action);
    else setFilter([]);
  };

  return (
    <>
      <BlackWrap>
        <WhiteBX0D2>
          <CloseBTN className='ani-1' onClick={() => props.toggle(10)}>
            <img src={CloseBTN01} alt='' />
          </CloseBTN>

          <Htitle>
            <FormattedMessage
              id='select_edition'
              defaultMessage='Select Edition'
            />
          </Htitle>

          <FilterMBX>
            <FilterLbx>
              <button
                className={tab === 'All' ? `active` : ``}
                onClick={() => setTab('All')}
              >
                <FormattedMessage id='all' defaultMessage='All' />
              </button>
              <button
                className={tab === 'Sale' ? `active` : ``}
                onClick={() => setTab('Sale')}
              >
                <FormattedMessage id='for_sale' defaultMessage='For Sale' />
              </button>
            </FilterLbx>
            <FilterBAR onClick={() => toggle(1)} ref={wrapperRef}>
              <FilterICO>
                <img src={FiltICON} alt='' />
              </FilterICO>
              <FormattedMessage id='filter' defaultMessage='Filter' />
              <Collapse
                isOpen={filterPopup === 1}
                className={
                  'app__collapse collapse-css-transition  ' +
                  (filterPopup === 1 ? 'collapse-active' : '')
                }
              >
                <DDContainer>
                  {NFTDetails?.auctionEndDate > new Date().getTime() / 1000 ? (
                    <div className='md-checkbox'>
                      <input
                        type='checkbox'
                        id='vehicle1'
                        name='vehicle1'
                        checked={filter.includes('AUCTION') ? true : false}
                        onChange={(e) => changeHandler('AUCTION', e)}
                      />
                      <label htmlFor='vehicle1'>
                        <FormattedMessage
                          id='live_acution'
                          defaultMessage='Live auction'
                        />
                      </label>
                    </div>
                  ) : (
                    <div className='md-checkbox'>
                      <input
                        type='checkbox'
                        id='vehicle2'
                        name='vehicle1'
                        checked={filter.includes('OFFER') ? true : false}
                        onChange={(e) => changeHandler('OFFER', e)}
                      />
                      <label htmlFor='vehicle2'>
                        <FormattedMessage
                          id='accept_offers'
                          defaultMessage='Accept offers'
                        />
                      </label>
                    </div>
                  )}

                  {NFTDetails?.auctionEndDate > new Date().getTime() / 1000 ? (
                    ``
                  ) : (
                    <>
                      <div className='md-checkbox'>
                        <input
                          type='checkbox'
                          id='vehicle3'
                          name='vehicle1'
                          checked={filter.includes('BUY') ? true : false}
                          onChange={(e) => changeHandler('BUY', e)}
                        />
                        <label htmlFor='vehicle3'>
                          <FormattedMessage
                            id='buy_now'
                            defaultMessage='Buy now'
                          />
                        </label>
                      </div>
                      <div className='md-checkbox'>
                        <input
                          type='checkbox'
                          id='vehicle4'
                          name='vehicle1'
                          checked={filter.includes('SOLD') ? true : false}
                          onChange={(e) => changeHandler('SOLD', e)}
                        />
                        <label htmlFor='vehicle4'>Sold</label>
                      </div>
                    </>
                  )}
                </DDContainer>
              </Collapse>
            </FilterBAR>
          </FilterMBX>
          <CustomScrollbars
            autoHide
            autoHideTimeout={1000}
            style={{ width: '100%', height: '400px', position: 'relative' }}
          >
            <EditionTable>
              <table>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id='edition' defaultMessage='EDITION' />
                    </th>
                    <th>
                      <FormattedMessage id='owner' defaultMessage='OWNER' />
                      {/* <span className="mobile-block">/PRICE</span> */}
                    </th>
                    <th className='text-center desktop-block'>
                      <FormattedMessage id='price' defaultMessage='PRICE' />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {editions.length !== 0
                    ? editions.map((edition, key) => {
                      return (
                        <tr key={key}>
                          <td>{edition.number}</td>
                          <td>
                            <FlexDiv className='JCFS'>
                              <div className='table-Img'>
                                <img
                                  src={
                                    edition.ownerId.profile
                                      ? edition.ownerId.profile
                                      : UserIcon
                                  }
                                  alt=''
                                />
                              </div>
                              <div className='eduerprice'>
                                {edition.ownerId.username
                                  ? `@${edition.ownerId.username}`
                                  : edition.ownerId.name}
                                <div className='mobile-block'>
                                  {+edition.price < 0.001
                                    ? +edition.price
                                      .toFixed(5)
                                      .toLocaleString()
                                    : Number(edition.price).toLocaleString(
                                      undefined,
                                      4
                                    )}{' '}
                                  BNB
                                </div>
                              </div>
                            </FlexDiv>
                          </td>
                          <td className='text-center desktop-block'>
                            {parseFloat(+(edition.price).toFixed(5))}{' '}
                            {/* {Number(edition.price)
                              .toFixed(10)
                              .replace(
                                /([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,
                                '$1'
                              )}{' '} */}
                            BNB
                          </td>
                          <td>
                            <CustomRadio1>
                              <label className='radio-container'>
                                {edition.isBurned ? (
                                  <FormattedMessage
                                    id='burned'
                                    defaultMessage='Burned'
                                  />
                                ) : (
                                  <FormattedMessage
                                    id='select'
                                    defaultMessage='Select'
                                  />
                                )}
                                <input
                                  type='radio'
                                  name='category'
                                  value='art'
                                  disabled={edition.isBurned}
                                  onClick={() => {
                                    props.setEditionnumber(edition.number);
                                    props.toggle(10);
                                  }}
                                />
                                <span className='checkmark'></span>
                              </label>
                            </CustomRadio1>
                          </td>
                        </tr>
                      );
                    })
                    : <FormattedMessage id="no_result_found" defaultMessage="No result found" />}
                </tbody>
              </table>
            </EditionTable>
          </CustomScrollbars>
        </WhiteBX0D2>
      </BlackWrap>
    </>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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
const WhiteBX0D2 = styled(FlexDiv)`
  width: 100%;
  position: relative;
  max-width: 720px;
  margin: 0 15px;
  min-height: 491px;
  padding: 50px 50px 0px 50px;
  background-color: #fff;
  border-radius: 30px;
  justify-content: flex-start;
  align-content: center;
  ${Media.xs} {
    padding: 50px 25px;
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
  ${Media.xs} {
    right: 15px;
    top: 15px;
  }
`;

const Htitle = styled.div`
  font-size: 22px;
  letter-spacing: -0.55px;
  color: #000;
  font-weight: 600;
  margin: 0px 0px 20px;
  width: 100%;
`;

const FilterLbx = styled(FlexDiv)`
  width: 45%;
  justify-content: flex-start;
  ${Media.sm} {
    width: 100%;
    margin: 0px 0px 10px;
  }
  button {
    display: inline-block;
    padding: 10px 25px;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    border-radius: 15px;
    background-color: #eef2f7;
    margin-right: 8px;

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

const FilterICO = styled(FlexDiv)`
  width: 21px;
  height: 21px;
  position: absolute;
  left: 11px;
  top: 9px;
`;
const FilterBAR = styled(FlexDiv)`
  width: 100%;
  max-width: 220px;
  justify-content: flex-start;
  position: relative;
  background-color: #eef2f7;
  border-radius: 15px;
  border: 0px;
  outline: none;
  height: 38px;
  padding: 3px 3px 3px 40px;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  border: 1px solid transparent;
  &.active,
  &:hover {
    background-color: #fff;
    border: 1px solid #00babc;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  }
  ${Media.sm} {
    max-width: 100%;
  }
`;

const DDContainer = styled(FlexDiv)`
  position: absolute;
  background-color: #fff;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  top: calc(100% + 7px);
  width: 100%;
  left: 0;
  overflow: hidden;
  z-index: 100;

  .md-checkbox:hover {
    background-color: #d9f5f5;
  }
`;

const FilterMBX = styled(FlexDiv)`
  width: 100%;
  justify-content: space-between;
  ${Media.sm} {
    display: block;
  }
`;
const EditionTable = styled.div`
  width: 100%;
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 25px;
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .eduerprice {
      .mobile-block {
        width: 100%;
      }
    }
    ${Media.sm} {
      border-spacing: 10px 25px;
    }
    .mobile-block {
      display: none;
      ${Media.sm} {
        display: block;
      }
    }
    .desktop-block {
      ${Media.sm} {
        display: none;
      }
    }
    thead {
      padding-bottom: 30px;
      th {
        color: rgb(0 0 0 / 30%);
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        text-align: left;
        span.mobile-block {
          display: inline-block;
        }
        ${Media.sm} {
          font-size: 10px;
        }
      }
    }
    tbody {
      td {
        color: #000;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.9px;
        ${Media.sm} {
          font-size: 12px;
        }
        .JCFS {
          justify-content: flex-start;
          ${Media.sm} {
            flex-wrap: initial;
          }
        }
        .table-Img {
          width: 32px;
          height: 32px;
          min-width:32px;
          border-radius: 50%;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
        }
      }
    }
  }
`;

const CustomRadio1 = styled(FlexDiv)`
  justify-content: flex-end;
  .radio-container {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    padding: 13px 32px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: -0.9px;
    color: #000;
    img {
      margin-right: 5px;
    }
    ${Media.sm} {
      padding: 6px 20px;
      font-size: 10px;
    }
  }
  .radio-container input {
    position: absolute;
    left: 0;
    opacity: 0;
    cursor: pointer;
    margin: 0px;
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 44px;
    width: 100%;
    background-color: transparent;
    border-radius: 15px;
    border: 1px solid #000;
    ${Media.sm} {
      height: 33px;
      border-radius: 12px;
    }
  }
  .radio-container input:checked ~ .checkmark {
    background-color: rgb(0 0 0 / 30%);
    border-color: rgb(0 0 0 / 30%);
  }
`;

export default SelectEdition;
