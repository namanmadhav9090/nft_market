import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from "react-autosuggest";
import { services } from "../services";
import { FormattedMessage } from 'react-intl';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }
  if (value.length >= 3) {
    const coCreator = await services.get(`user/searchCreator/${value}`, true);
    if (coCreator.data?.status) {
      const coCreators = coCreator.data.data;

      const regex = new RegExp("^" + escapedValue, "i");
      return coCreators.filter((creator) => regex.test(creator.username));
    } else return [];
  } else return [];
}

function renderSuggestion(suggestion) {
  // return <div style={{ padding: "10px", backgroundColor: "#fff", boxShadow: "0px 3px 5px 2px #ccc", display: "inline-block" }}>{suggestion.username}</div>
  return <div>{suggestion.username}</div>;
}

class Autosuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.username?this.props.username:"",
      suggestions: [],
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.username !== this.props.username) {
      this.setState({value: this.props.username});
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    let newSuggestion = await getSuggestions(value);
    this.props.setError(undefined, newSuggestion.length === 0, true);
    this.setState({
      suggestions: newSuggestion,
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };
  getSuggestionValue(suggestion) {
    this.props.setSuggestionValue(suggestion);
    return suggestion.username;
  }

  render() {
    const { value, suggestions } = this.state;
    const { lng } = this.props;
    const inputProps = {
      value,
      name: "coCreatorUserName",
      placeholder: lng === 'en' ? 'Type something…': 'Bir şey yazın…',
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={(e) => this.getSuggestionValue(e)}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lng: state.fetchLanguage,
  };
};
export default connect(mapStateToProps, null)(Autosuggestion);
