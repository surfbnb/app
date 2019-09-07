import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import { FetchServices } from '../../services/FetchServices';

/**
 *
 * @param {FlatList component } ListComponent
 * @param {Boolen} scrollDetectNext
 * Note :- scrollDetectNext send as true , its mandatory to onMomentumScrollBeginCallback on onMomentumScrollBegin
 * from flatlist otherwise pagination won't work
 *
 * * Flatlist by defaults handles refresh , pagination ,
 * * call pagination only on scroll and stop pagination when nextpagepayload is over
 *
 * Unhandled need to check if on Pull to refresh subsequtent next page request is going when scrollDetectNext flag is true
 * Will have to implement onEndReachedCalledDuringMomentum mechanism there as
 */

function flatlistHOC(ListComponent, options) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        list: this.props.list || [],
        refreshing: false,
        loadingNext: false
      };
      this.onEndReachedCalledDuringMomentum = options && !!options.scrollDetectNext;
      this.flatListHocRef = null;
    }

    componentDidMount() {
      if (this.props.fetchUrl) {
        if (this.shouldMakeApiCall()) {
          this.initList(new FetchServices(this.props.fetchUrl));
        } else {
          // Clear all results if you encounter a bug.
        }
      }
    }

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

    componentWillUnmount() {
      this.beforeNext = () => {};
      this.onNext = () => {};
      this.onNextError = () => {};
      this.beforeRefresh = () => {};
      this.onRefresh = () => {};
      this.onRefreshError = () => {};
    }

    initList(fetchServices) {
      this.refresh(fetchServices);
    }

    refresh = (fetchServices) => {
      if (this.state.refreshing) return;
      if (fetchServices) {
        this.fetchServices = fetchServices;
      } else {
        this.fetchServices = this.fetchServices && this.fetchServices.clone();
      }
      if (!this.fetchServices) return;
      this.beforeRefresh();
      this.fetchServices
        .refresh()
        .then((res) => {
          this.onRefresh(res);
        })
        .catch((error) => {
          this.onRefreshError(error);
        });
    };

    beforeRefresh() {
      this.props.beforeRefresh && this.props.beforeRefresh();
      if (this.props.toRefresh && (options && options.silentRefresh)) return;
      this.setState({ refreshing: true });
    }

    onRefresh(res) {
      this.props.onRefresh && this.props.onRefresh(res);
      this.setState({
        refreshing: false,
        list:
          options && options.keyPath ? this.fetchServices.getIDList(options.keyPath) : this.fetchServices.getIDList()
      });
    }

    onRefreshError(error) {
      this.props.onRefreshError && this.props.onRefreshError(error);
      this.setState({ refreshing: false });
    }

    /**
     * getNext monitors for 4 different checkpoints
     * 1. It wont call next page if allready fetching data of previous page
     * 2. Wont next page when pull to refresh is done
     * 3. Will stop pagination if next page payload is not present
     * 4. Will start pagination only after scroll detect (Optional)
     */
    getNext = () => {
      if (
        this.state.loadingNext ||
        this.state.refreshing ||
        !this.fetchServices.hasNextPage ||
        this.onEndReachedCalledDuringMomentum
      )
        return;
      this.beforeNext();
      this.fetchServices
        .fetch()
        .then((res) => {
          this.onNext(res);
        })
        .catch((error) => {
          this.onNextError(error);
        });
    };

    beforeNext() {
      if (options && options.scrollDetectNext) {
        this.onEndReachedCalledDuringMomentum = true;
      }
      this.props.beforeNext && this.props.beforeNext();
      this.setState({ loadingNext: true });
    }

    onNext(res) {
      this.props.onNext && this.props.onNext(res);
      this.setState({
        loadingNext: false,
        list:
          options && options.keyPath ? this.fetchServices.getIDList(options.keyPath) : this.fetchServices.getIDList()
      });
    }

    onNextError(error) {
      this.props.onNextError && this.props.onNextError(error);
      this.setState({ loadingNext: false });
    }

    renderFooter = () => {
      if (!this.state.loadingNext) return null;
      return <ActivityIndicator />;
    };

    onMomentumScrollBeginCallback = () => {
      this.onEndReachedCalledDuringMomentum = false;
    };

    render() {
      return (
        <ListComponent
          ref={(ref) => (this.flatListHocRef = ref)}
          list={this.state.list}
          getNext={this.getNext}
          refresh={this.refresh}
          refreshing={this.state.refreshing}
          renderFooter={this.renderFooter}
          onMomentumScrollBeginCallback={this.onMomentumScrollBeginCallback}
          {...this.props}
        />
      );
    }
  };
}

export default flatlistHOC;
