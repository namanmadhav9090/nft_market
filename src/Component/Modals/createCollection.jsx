import React, { useContext } from "react";
import { useState } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { actions } from "../../actions";
import CloseBTN01 from "../../Assets/images/closeBTN01.svg";
import { connect } from "react-redux";
import { useEffect } from "react";
import { services } from "../../services";
import ipfs from '../../config/ipfs';
import { Context } from '../../Component/wrapper';
import Media from "./../../Theme/media-breackpoint";
import { capitalizeFirstLetter } from "../../helper/functions";
import { Scrollbars } from "react-custom-scrollbars";

function CustomScrollbars(props) {
  return (
    <Scrollbars
      renderTrackVertical={(props) => (
        <div {...props} className="track-vertical" />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical" />
      )}
      renderView={(props) => <div {...props} className="view" />}
      autoHide
      style={props.style}
    >
      {props.children}
    </Scrollbars>
  );
}

function CreateCollection(props) {

  let myFormRef; // collection form refrensh
  const context = useContext(Context);
  const [collectionAdded, setCollectionAdded] = useState(false);
  const [loading, setLoader] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const [params, setParams] = useState({ name: null, description: null, logo: null, category: [] })
  const [error, setError] = useState({ name: false, description: false, logo: false, category: false })
  const msg1 = {
    0: <FormattedMessage id="collection_added" />,
    1: <FormattedMessage id="collection_added_detail" />,
  };
  const [msg, setMsg] = useState(msg1);
  // const msg2 ={0:"Addition Failed!", 1:}

  useEffect(() => {
    const { categoryList } = props;
    if (!categoryList) props.getCategoryList(); // get the category list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    if (props.newCollection && props.newCollection.status) {
      props.getCollectionList();
      setCollectionAdded(true);
      setMsg(msg1);
    } else if (props.newCollection && !props.newCollection.status) {
      setCollectionAdded(true);
      setMsg({ 0: <FormattedMessage id="collection_failed" />, 1: props.newCollection.message });
    } else {
      setCollectionAdded(false);
    }
    clearData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.newCollection]);

  const checkErrors = () => {
    let haveError = true;
    let errors = { name: false, description: false, logo: false, category: false }
    if (!params.name) { errors.name = true; haveError = false }
    if (!params.description) { errors.description = true; haveError = false }
    if (!params.logo) { errors.logo = true; haveError = false }
    if (params.category.length === 0) { errors.category = true; haveError = false }
    if (params.category.length > 2) { errors.category = true; haveError = false }
    setError(errors)
    return haveError
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const checked = checkErrors();
    if (checked) {
      setLoader(true); // start loader
      let ipfsHash = await ipfs.add(buffer, { // get buffer IPFS hash
        pin: true, progress: (bytes) => {
          // console.log("File upload progress ", Math.floor(bytes * 100 / (params.logo.size)))
        }
      })
      const obj = {
        name: params.name,
        description: params.description,
        logo: ipfsHash.path,
        category: params.category
      }
      props.createCollection(obj); // create collection
    }
  };

  const clearData = () => {
    myFormRef.reset(); // clear the form
    setLoader(false); // stop loader
    setParams({ name: null, description: null, logo: null, category: [] }); // clear the params
    setError({ name: false, description: false, logo: false, category: false }); // clear the error
  }

  const formChange = (e) => {
    const colObj = params;
    const { name, value } = e.target;
    if (name === "category") {
      const category = colObj.category;
      const exists = category.includes(value);
      if (exists) {
        const index = category.indexOf(value);
        if (index > -1) {
          category.splice(index, 1);
        }
      } else if(params.category.length < 2){
        category.push(e.target.value);
      }
      setParams({ ...params, category: category })
    } else if (name === "logo") {
      let file = e.target.files[0];
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => convertToBuffer(reader)
      setParams({ ...params, [name]: e.target.files[0] })
    } else {
      setParams({ ...params, [name]: value })
    }
  }

  const convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS`
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    setBuffer(buffer);
  };

  return (
    <>
      <BlackWrap>
        {collectionAdded ? (
          <>
            <WhiteBX01>
              {" "}
              <WGTitle>{msg[0]}</WGTitle>
              <WGdescText>{msg[1]}</WGdescText>
              <WGBtn
                onClick={() => { setCollectionAdded(false); props.toggle(2); }}
              >
                OK
              </WGBtn>
            </WhiteBX01>
          </>
        ) : (
          <WhiteBX01>

            <form onSubmit={(e) => onFormSubmit(e)}
              onChange={(e) => formChange(e)}
              ref={(e) => myFormRef = e}
            >
              <>

                <CloseBTN className="ani-1" onClick={(e) => {
                  e.preventDefault();
                  clearData();
                  props.toggle(2);
                }}
                >
                  <img src={CloseBTN01} alt="" />
                </CloseBTN>
                <CustomScrollbars
                  autoHide
                  autoHideTimeout={1000}
                  style={{ width: "100%", height: "418px", position: "relative" }}
                >
                  <CCTitle>
                    <FormattedMessage id="create_collection_form" defaultMessage="Create Collection" />
                  </CCTitle>

                  <NFTForm>
                    <div className="label-line">
                        <label>
                          <FormattedMessage id="collection_name_form" defaultMessage="Collection Name" />
                        </label>
                    </div>
                    <FormattedMessage
                        id="type_something"
                        defaultMessage="Type something…"
                      >
                        {(placeholder) => (
                          <input
                            type="text"
                            name="name"
                            className={error.name ? `error` : ``}
                            placeholder={placeholder}
                          />
                      )}
                    </FormattedMessage>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                        <label>
                          <FormattedMessage id="about_collection_form" defaultMessage="About Collection" />
                      </label>
                      </div>
                      <FormattedMessage
                          id="type_something"
                          defaultMessage="Type something…"
                        >
                        {(placeholder) => (
                          <textarea name="description" className={error.description ? `error` : ``} defaultValue={placeholder}></textarea>
                        )}
                      </FormattedMessage>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                        <label>
                          <FormattedMessage id="category" defaultMessage="Category" />
                      </label>
                        <p className={error.category ? `error` : ``}>
                          <FormattedMessage id="category_label" defaultMessage="Choose category for listing your NFT. You can choose up to 2." />
                      </p>
                    </div>
                    <CustomCheckbox1>
                      {props.categoryList?.map((category, key) => (
                        <label className="checkbox-container" key={key}>
                          <img src={category.image} alt="" />
                          {capitalizeFirstLetter(context.locale === 'tr' ? category.categoryName.tu : category.categoryName.en)}
                          <input
                            type="checkbox"
                            name="category"
                            value={category._id}
                            onChange={(event) => {
                              if (params.category.length > 1) {
                                event.target.checked = false;
                              }
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                      ))}
                    </CustomCheckbox1>
                  </NFTForm>
                  <NFTForm>
                    <div className="label-line">
                        <label>
                          <FormattedMessage id="collection_cover_form" defaultMessage="Collection Cover Image" />
                      </label>
                      <FlexDiv className="JCSB">
                          <p>
                            <FormattedMessage id="collection_cover_label" defaultMessage="Upload PNG, JPEG, GIF, WEBP" />
                          </p>
                        {/* <p>
                          <b>Max 30 mb.</b>
                        </p> */}
                      </FlexDiv>
                    </div>
                    <FileuploadBox className={error.logo ? `error` : ``} >
                      <label className="custom-file-upload">
                        <input type="file" name="logo"
                          accept="image/*"
                        // accept="image/png, image/gif, image/jpeg"
                        />
                          
                          <FormattedMessage id="choose" defaultMessage="Choose" />
                      </label>
                    </FileuploadBox>
                  </NFTForm>
                  <CreateItemButton >
                      <button type="submit" disabled={loading ? true : false} >{loading ? `loading..` : 
                    <FormattedMessage id="collection_create" defaultMessage="Create" />}</button>
                  </CreateItemButton>
                </CustomScrollbars>
              </>
            </form>

          </WhiteBX01>
        )}
      </BlackWrap>
    </>
  );
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
  form{
    width:100%;
    // .view{
    //   width:100%;
    //   overflow-x:hidden !important;
    //   overflow-y:auto !important;
    // }
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
const WGTitle = styled.div`
  color: #000000;
  font-size: 24px;
  line-height:28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;
const WGdescText = styled.div`
  color: #000000;
  font-size: 14px;
  letter-spacing: -0.7px;
  margin-bottom: 10px;
  text-align: center;
  width:100%;
`;

const WGBtn = styled.button`
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.7px;
  padding: 13px 86px;
  border-radius: 15px;
  border: 1px solid #000000;
  margin: 30px auto 0px;
  :hover {
    background-color: #000;
    color: #fff;
  }
`;

const FTTitle = styled.div`
  color: #000000;
  font-size: 24px;
  letter-spacing: -1px;
  margin-bottom: 25px;
  font-weight: 700;
`;

const TokenBox = styled(FlexDiv)`
  justify-content: space-between;
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
`;
const TokenLeft = styled.div`
  p {
    color: #000000;
    font-size: 16px;
    letter-spacing: -0.8px;
    font-weight: 600;
    margin: 0px;
    &.small {
      color: rgb(0 0 0 / 23%);
      margin: 0px;
      font-size: 12px;
      letter-spacing: -0.6px;
    }
  }
`;

const CCTitle = styled.div`
  color: #000000;
  font-size: 24px;
  letter-spacing: -1px;
  margin-bottom: 25px;
  font-weight: 700;
`;

const NFTForm = styled.div`
  position: relative;
  width: 100%;
  .label-line {
    margin: 0px 0px 6px;
    label {
      font-size: 12px;
      color: #8e9194;
      letter-spacing: -0.6px;
      font-weight: 600;
    }
    span {
      color: #8e9194;
      font-size: 12px;
      letter-spacing: -0.6px;
      margin-left: 6px;
    }
    p {
      color: #8e9194;
      font-size: 10px;
      letter-spacing: -0.7px;
      font-weight: light;
      margin: 0px;
      &.error {
        color: #e21d1d;
      }
    }
  }
  input {
    width: 100%;
    height: 54px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.8px;
    margin: 0px 0px 20px;
    ::placeholder {
      color: #000;
      opacity: 20%;
    }
    &.error {
      border: 1px solid #e21d1d;
    }
  }
  textarea {
    width: 100%;
    min-height: 82px;
    line-height: 24px;
    resize: none;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    letter-spacing: -0.8px;
    margin: 0px 0px 20px;
    &.error {
      border: 1px solid #e21d1d;
    }
  }
  .errorinput {
    position: relative;
    input {
      border-color: #ff2a44;
    }
    p.error {
      color: #ff2a44;
      font-size: 12px;
      letter-spacing: -0.6px;
      font-weight: 600;
      margin: 0px;
      position: absolute;
      top: 18px;
      right: 15px;
    }
  }
`;

const FileuploadBox = styled(FlexDiv)`
  border: 1px solid #dddddd;
  border-radius: 10px;
  width: 100%;
  height: 100px;
  margin: 0px 0px 30px;
  input {
    display: none;
  }
  .custom-file-upload {
    border: 1px solid #000000;
    border-radius: 15px;
    font-size: 14px;
    color: #000;
    letter-spacing: -0.5px;
    padding: 13px 28px;
    cursor: pointer;
    :hover {
      background-color: #000;
      color: #fff;
    }
  }
  &.error {
    border: 1px solid #e21d1d;
  }
`;

const CreateItemButton = styled.div`
  margin: 0px;
  width: 100%;
  text-align: center;
  button {
    font-size: 14px;
    color: #fff;
    letter-spacing: -0.5px;
    padding: 13px 60px;
    cursor: pointer;
    border-radius: 15px;
    background-color: rgb(0 0 0 / 30%);
    :hover {
      background-color: #000;
    }
  }
`;

const CustomCheckbox1 = styled(FlexDiv)`
  justify-content: flex-start;
  margin-bottom: 30px;
  .checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    height: 54px;
    width: calc(50% - 5px);
    margin:0px 5px 5px 0px;
    cursor: pointer;
    padding-left: 15px;
    line-height: 54px;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: -0.9px;
    color: #000;
    img {
      margin-right: 5px;
      width:25px;
    }
    :last-child
    {
      margin-right:0px;
    }
    ${Media.sm} {
      width: 100%;
      margin-right:0px;
    }
  }
  .checkbox-container input {
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
    height: 54px;
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    border: 1px solid #dddddd;
  }
  .checkbox-container input:checked ~ .checkmark {
    border: 1px solid #00babc;
  }
`;


const mapDipatchToProps = (dispatch) => {
  return {
    createCollection: (obj) => dispatch(actions.createCollection(obj)),
    getCollectionList: () => dispatch(actions.getCollectionList()),
    getCategoryList: () => dispatch(actions.getCategoryList()),
  };
};
const mapStateToProps = (state) => {
  return {
    newCollection: state.fetchNewCollection,
    categoryList: state.fetchCategoryList,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(CreateCollection);
