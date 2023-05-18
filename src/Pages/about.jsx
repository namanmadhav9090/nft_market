import 'react-multi-carousel/lib/styles.css';
import 'react-tabs/style/react-tabs.css';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Gs from '../Theme/globalStyles';
import { FormattedMessage } from 'react-intl';
import Media from '../Theme/media-breackpoint';

import AboutMainBanner from '../Assets/images/about_us/about_main_banner.png';
import AboutMainBannerMobile from '../Assets/images/about_us/about_main_banner_mobile.png';
import NFT2 from '../Assets/images/nft1.jpg';
import AboutFeatureENG01 from '..//Assets/images/about_us/about_feature_ENG_01.png';
import AboutFeatureENG02 from '..//Assets/images/about_us/about_feature_ENG_02.png';
import AboutFeatureENG03 from '..//Assets/images/about_us/about_feature_ENG_03.png';
import AboutFeatureENG04 from '..//Assets/images/about_us/about_feature_ENG_04.png';
import AboutFeatureENG05 from '..//Assets/images/about_us/about_feature_ENG_05.png';
import AboutFeatureENG06 from '..//Assets/images/about_us/about_feature_ENG_06.png';
import AboutFeatureENG07 from '..//Assets/images/about_us/about_feature_ENG_07.png';
import AboutFeatureENG08 from '..//Assets/images/about_us/about_feature_ENG_08.png';

import AboutFeatureTR01 from '..//Assets/images/about_us/about_feature_TR_01.png';
import AboutFeatureTR02 from '..//Assets/images/about_us/about_feature_TR_02.png';
import AboutFeatureTR03 from '..//Assets/images/about_us/about_feature_TR_03.png';
import AboutFeatureTR04 from '..//Assets/images/about_us/about_feature_TR_04.png';
import AboutFeatureTR05 from '..//Assets/images/about_us/about_feature_TR_05.png';
import AboutFeatureTR06 from '..//Assets/images/about_us/about_feature_TR_06.png';
import AboutFeatureTR07 from '..//Assets/images/about_us/about_feature_TR_07.png';
import AboutFeatureTR08 from '..//Assets/images/about_us/about_feature_TR_08.png';

class About extends Component {
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

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let { lng } = this.props;

    return (
      <Gs.MainSection>
        <AboutMain>
          <h1>
            <FormattedMessage id='about_us_01' />
          </h1>
          <p className='desc'>
            <FormattedMessage id='about_us_02' />
          </p>
          <div className='about-banner'>
            <img src={AboutMainBanner} className="desk-img" alt='' />
            <img src={AboutMainBannerMobile} className="mobile-img" alt='' />
          </div>
        </AboutMain>
        <Gs.Container>
          <Aboutfourpart>
            <h3>
              <FormattedMessage id='about_us_03' />
            </h3>
            <p>
              <FormattedMessage id='about_us_04' />
            </p>
            <AboutboxImg>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG01} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR01} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG02} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR02} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG03} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR03} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG04} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR04} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
            </AboutboxImg>
          </Aboutfourpart>
          <Aboutfourpart className='mb-120'>
            <h3>
              <FormattedMessage id='about_us_05' />
            </h3>
            <p>
              <FormattedMessage id='about_us_06' />
            </p>
            <AboutboxImg>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG05} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR05} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG06} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR06} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG07} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR07} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
              <Gs.W25V2>
                <Gs.TenpxGutter>
                  <div className='ab-img-outer'>
                    {lng === 'en' && <img src={AboutFeatureENG08} alt='' />}
                    {lng === 'tr' && <img src={AboutFeatureTR08} alt='' />}
                  </div>
                </Gs.TenpxGutter>
              </Gs.W25V2>
            </AboutboxImg>
          </Aboutfourpart>
        </Gs.Container>
      </Gs.MainSection>
    );
  }
  toggle = (index) => {
    let collapse = 'isOpen' + index;
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
const AboutMain = styled.div`
  margin: 120px 20px 80px;
  text-align: center;
  h1 {
    font-size: 72px;
    color: #000000;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: -3.43px;
    margin: 0px auto 30px;
    max-width: 800px;
    width: 100%;
    ${Media.md} {
      font-size: 60px;
      line-height: 70px;
      letter-spacing: -2.43px;
    }
    ${Media.sm} {
      font-size: 38px;
      line-height: 50px;
      letter-spacing: -1.81px;
    }
  }
  p.desc {
    font-size: 24px;
    color: #000000;
    line-height: 38px;
    letter-spacing: -1px;
    margin: 0px auto 80px;
    max-width: 1080px;
    width: 100%;
    ${Media.sm} {
      margin: 0px auto 50px;
    }
  }
  p.small {
    font-size: 16px;
    color: #000000;
    line-height: 25px;
    letter-spacing: -0.8px;
    margin: 0px auto 80px;
    max-width: 1080px;
    width: 100%;
    ${Media.sm} {
      margin: 0px auto 50px;
    }
  }
  .about-banner {
    max-width: 1200px;
    height: 400px;
    width: 100%;
    margin: 0px auto 80px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
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
    ${Media.md} {
      height: auto;
    }
    ${Media.sm} {
      margin: 0px auto 50px;
      // height: 260px;
    }
  }
  ${Media.sm} {
    margin: 60px 20px 50px;
  }
`;

const Aboutfourpart = styled.div`
  text-align: center;
  margin-bottom: 80px;
  h3 {
    font-size: 24px;
    color: #000000;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -1.07px;
    margin: 0px auto 10px;
  }
  p {
    font-size: 16px;
    color: #000000;
    line-height: 25px;
    letter-spacing: -0.8px;
    margin: 0px auto 30px;
    max-width: 800px;
    width: 100%;
  }
  &.mb-120 {
    margin-bottom: 120px;
    ${Media.sm} {
      margin-bottom: 60px;
    }
  }
  ${Media.sm} {
    margin: 0px 10px 50px;
  }
`;

const AboutboxImg = styled(FlexDiv)`
  margin: 0px -10px;
  .ab-img-outer {
    width: 100%;
    height: 255px;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    ${Media.md} {
      height: 400px;
    }
    ${Media.sm} {
      height: 300px;
    }
    ${Media.xs} {
      height: 160px;
    }
  }
`;

Gs.W25V2 = styled(Gs.W25V2)`
  ${AboutboxImg} & {
    margin-bottom: 0px;
    ${Media.md} {
      width: 50%;
      margin-bottom: 20px;
    }
    ${Media.sm} {
      margin-bottom: 10px;
    }
  }
`;
Gs.TenpxGutter = styled(Gs.TenpxGutter)`
  ${AboutboxImg} & {
    ${Media.sm} {
      margin: 0px 5px;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    lng: state.fetchLanguage,
  };
};
export default connect(mapStateToProps, null)(About);
