import SearchResults from './SearchResults';
import { FetchServices } from '../../services/FetchServices';

class SearchComponent extends SearchResults {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (!this.shouldMakeApiCall()) {
      if (this.state.list.length) {
        //Clear the results.
        this.setState({ list: [] });
      }
      return;
    }

    if (this.props.toRefresh) {
      if (this.props.fetchUrl != prevProps.fetchUrl) {
        this.refresh(new FetchServices(this.props.fetchUrl));
      } else {
        this.refresh();
      }
    }
  }

  shouldMakeApiCall() {
    if (this.props.shouldMakeApiCall) {
      return this.props.shouldMakeApiCall();
    }
    return true; // Default behaviour.
  }
}

export default SearchComponent;
