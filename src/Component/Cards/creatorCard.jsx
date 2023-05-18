import React from "react";
import styled from "styled-components";
import { HashLink as Link } from "react-router-hash-link";
import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";

import ProfielBack from "../../Assets/images/creator-back.jpg";
import UserIcon from "../../Assets/images/user-img.jpg";

import Media from "../../Theme/media-breackpoint";

function CreatorCard({
    id,
    cover,
    profile,
    name,
    username,
    bio,
    nftCreated,
    followersCount,
    followingCount
}) {
    return (
        <CreatSBX01>
            <Link to={`/creator/${id}`}>
                <ImgBannerBX>
                    <motion.img
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        key={cover ? cover : ProfielBack}
                        src={cover ? cover : ProfielBack}
                        exit={{ opacity: 0 }}
                    />
                </ImgBannerBX>
                <CreatSBX02>
                    <UserImg>
                        <motion.img
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            key={profile ? profile : UserIcon}
                            src={profile ? profile : UserIcon}
                            exit={{ opacity: 0 }}
                        />
                    </UserImg>
                    <CretrTitle01>
                        {name}
                        <span>@{username}</span>
                    </CretrTitle01>
                    <CretrText01>
                        {bio}
                    </CretrText01>

                    <CretrInfoMBX>
                        <CretrInfoSBX01> <FormattedMessage id="created" defaultMessage="Created" /> <span>{nftCreated}</span></CretrInfoSBX01>
                        <CretrInfoSBX01> <FormattedMessage id="followers" defaultMessage="Followers" /> <span>{followersCount}</span></CretrInfoSBX01>
                        <CretrInfoSBX01> <FormattedMessage id="following" defaultMessage="Following" /> <span>{followingCount}</span></CretrInfoSBX01>
                    </CretrInfoMBX>

                    <CretrBTN01><FormattedMessage id="see_creations" defaultMessage="See Creations" /></CretrBTN01>

                </CreatSBX02>
            </Link>
        </CreatSBX01>
    );
}

const FlexDiv = styled.div`
    display: flex; align-items: center; justify-content:center; flex-wrap:wrap;
`;

const CreatSBX01 = styled(FlexDiv)`
    width:calc(25% - 20px); margin:10px 10px 20px 10px;  border:1px solid #dddddd; border-radius:10px; justify-content:flex-start; align-items:flex-start; 
    a{ width:100%; border-radius:10px;
    :hover{ box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);}
    }
    ${Media.md}{
        width:calc(33.33% - 20px);
    }
    ${Media.sm}{
        width:calc(50% - 20px);
    }
    ${Media.xs}{
        width:295px;
        margin:0px auto 20px;
    }
`
const ImgBannerBX = styled(FlexDiv)`
 width:100%; height:100px; border-radius:10px 10px 0 0 ; overflow: hidden;
 ${Media.xs}{
    height:116px;
} 
 img{ width:100%; height:100%;  object-fit:cover;} 
`
const CreatSBX02 = styled(FlexDiv)`
    width:100%; padding:14px; flex-direction:column;
`
const UserImg = styled(FlexDiv)`
    width:72px; height:72px; border-radius:36px; overflow:hidden; border:solid 1px #eef2f7; margin-top: -50px; 
    img{ width:100%; height:100%; object-fit: cover;}
`
const CretrTitle01 = styled.div`
    display:block; font-size:18px; font-weight:600; color:#000; margin:10px 0 0 0; text-align:center;
    span{ display:block; text-align:center; font-size:12px; } 
`
const CretrText01 = styled.div`
    font-size:10px; 
    text-align:center; 
    line-height:1.6; 
    margin:10px 0 0 0; 
    min-height:48px; 
    color:#000;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
`
const CretrInfoMBX = styled(FlexDiv)`
    width:100%; max-width:225px; padding:12px; margin:32px 0 18px 0; border:1px solid #dddddd; border-radius: 10px;
`
const CretrInfoSBX01 = styled(FlexDiv)`
    width:33.33%; color:#8e9194; font-size:10px;
    span{ width:100%; font-weight:600; color:#000; font-size:16px; text-align:center}
`
const CretrBTN01 = styled.button`
    color:#000; border:1px solid #000; display: inline-block; padding:11px 26px; border-radius:15px; font-size:14px; font-weight:600; margin-bottom:15px; 
`

export default CreatorCard;
