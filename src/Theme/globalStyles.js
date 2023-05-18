import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import Media from "../Theme/media-breackpoint";

var Gs = {};

Gs.GlobalStyle = createGlobalStyle`
body {  margin: 0; padding: 0;  font:400 16px/20px 'Sofia Pro', sans-serif;  background-color:#fff; color:#000; }
.myTip{ max-width:300px; font:400 14px/22px 'IBM Plex Mono', arial !important; color:#fff !important;} 
input{ outline:none;}
img{ max-width:100%; height:auto; }
button{  background:transparent; outline:none; border:0;}
.collapse-css-transition { transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.app__collapse{ visibility:hidden; opacity:0; height:0px; }
.app__collapse.collapse-active{ visibility:visible; opacity:1; height:auto; }
.mb-0{ margin-bottom:0 !important;}

.track-vertical{ width:19px !important; height:100%; display:block; position:absolute; right:-5px;}
.thumb-vertical{ width:6px !important; border-radius:30px; margin:5px; background-color:#ccc; }
.thumb-horizontal {
  background-color: #ccc;
  height: 6px !important;
  border-radius:30px;
  bottom:-10px;
}
.track-horizontal {
  width: 100%;
  left: 0px;
  bottom: 0px;
  height: 19px !important;
  
}
.react-autosuggest__suggestions-container{ background-color:#fff; border-radius:10px; position:absolute; z-index:99; width:100%; top:55px; left:0px; list-style-type:none;}
.react-autosuggest__suggestions-container--open{box-shadow:0px 2px 5px 1px #ccc;}
.react-autosuggest__suggestions-list{ list-style-type:none; padding:0px 15px;}
.react-autosuggest__suggestion{margin-bottom:5px; padding:5px 10px; cursor:pointer; border-radius:5px;}
.react-autosuggest__suggestion--highlighted{background-color:#eef2f7;}
.IScroll{overflow-x:hidden !important;}
`;
Gs.MainSection = styled.div`
  margin: 100px auto 0 auto;
  width: 100%;
  ${Media.md}{
    margin: 80px auto 0 auto;
  }
`;
Gs.Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1080px;
  ${Media.lg}{
    max-width:88%;
  }
  ${Media.md}{
    max-width:94%;
  }
`;
Gs.W25 = styled.div`
  width: 25%;
`;
Gs.W25V2 = styled.div`
  width: 25%;
  margin-bottom: 20px;
  ${Media.md}{
   width:33.33%;
  }
  ${Media.sm}{
    width:50%;
  }
  ${Media.xs}{
    width:295px;
    margin:0px auto 20px;
  }
`;
Gs.W20 = styled.div`
  width: 20%;
  ${Media.md}{
    width:25%;
  }
  ${Media.sm}{
    width:50%;
  }
  ${Media.xs}{
    width:295px;
    margin:0px auto;
  }
`;
Gs.W80 = styled.div`
  width: 80%;
  ${Media.sm}{
    width:100%;
  }
`;
Gs.W200px = styled.div`
  width: 100%;
  max-width: 200px;
  ${Media.md}{
    display:none;
  }
`;
Gs.W275px = styled.div`
  width: 100%;
  max-width: 275px;
  ${Media.lg}{
    max-width: 250px;
  }
  ${Media.md}{
    max-width: 35%;
  }
  ${Media.sm}{
    display:none;
  }
`;
Gs.W605px = styled.div`
  width: 100%;
  max-width: 605px;
  ${Media.lg}{
    max-width: 450px;
  }
  ${Media.md}{
    max-width: 65%;
  }
  ${Media.sm}{
    max-width: 100%;
  }
`;
Gs.W880px = styled.div`
  width: 100%;
  max-width: 880px;
  ${Media.lg}{
    max-width: 700px;
  }
  ${Media.md}{
    max-width: 100%;
  }
`;
Gs.TenpxGutter = styled.div`
  margin: 0px 10px;
`;

export default Gs;
