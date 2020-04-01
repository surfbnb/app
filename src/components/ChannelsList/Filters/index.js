import React, { PureComponent } from 'react';
import { ScrollView , Text } from "react-native";
import { withNavigation } from 'react-navigation';
import multipleClickHandler from '../../../services/MultipleClickHandler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import inlineStyles from "./styles";

class Filters extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
        selectedFilter : this.props.getCurrentFilter()
    }
  }

  componentWillUnmount() {
   this.__setState = () => {};
  }

  __setState = (state) =>{
    if(!state) return;
    this.setState(state);
  }

  onFilter = (filter) => {
    if(!filter) return;
    this.props.onChange(filter);
    this.setState({selectedFilter : filter});
  }

  getFilterBtnStyle = (filter={}) => {
    if( filter.id  ==  this.state.selectedFilter.id){
     return inlineStyles.filterBtnSelected
    }else{
      return inlineStyles.filterBtn
    }
  }

  getFilterBtnTextStyle = (filter={}) => {
    if( filter.id  ==  this.state.selectedFilter.id){
      return inlineStyles.filterBtnSelectedText
    }else{
      return inlineStyles.filterBtnText
    }
  }

  getFiltersMarkup = () => {
   return Object.keys(this.props.filters).map((filter) => {
     const currentFilter = this.props.filters[filter];
      return  <TouchableOpacity style={[inlineStyles.btnStyle , this.getFilterBtnStyle(currentFilter)]}
                  key={filter}
                  onPress={multipleClickHandler(() => {this.onFilter(currentFilter);})}>
                  <Text style={[inlineStyles.textStyle , this.getFilterBtnTextStyle(currentFilter)]}>{currentFilter["text"]}</Text>
              </TouchableOpacity>
    });
  }

  onNew = () => {
    this.props.navigation.push('CreateCommunitiesScreen');
  }

  getCreateNewChannelBtn = () => {
    return  <TouchableOpacity style={[inlineStyles.btnStyle ,inlineStyles.createNewBtn]}
                key="createNew"
                onPress={multipleClickHandler(() => {this.onNew();})}>
                <Text style={[inlineStyles.textStyle , inlineStyles.createNewBtnText]}>+ NEW</Text>
            </TouchableOpacity>
  }

  render(){
    return(
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 10}}>
          {this.getFiltersMarkup()}
          {this.getCreateNewChannelBtn()}
      </ScrollView>
    );
  }

}

Filters.defaultProps ={
  getCurrentFilter: () => {
    return {}
  },
  onChange: () => { }
}

export default withNavigation(Filters);
