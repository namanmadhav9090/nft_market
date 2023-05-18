import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';

import Turkish from '../lang/tr.json';
import English from '../lang/en.json';

export const Context = React.createContext();
const local = navigator.language;


let lang;
if (local === 'tr') { // check browser language
   lang = Turkish;
}else {
   lang = English;
}

const Wrapper = (props) => {

   const [locale, setLocale] = useState(local);
   const [messages, setMessages] = useState(lang);
   
   function selectLanguage(newLocale) {
       setLocale(newLocale);
       if (newLocale === 'en') {
           setMessages(English);
       } else {
            setMessages(Turkish);
       }
   }

   return (
       <Context.Provider value = {{locale, selectLanguage}}>
           <IntlProvider messages={messages} locale={locale}>
               {props.children}
           </IntlProvider>
       </Context.Provider>
   );
}

export default Wrapper;