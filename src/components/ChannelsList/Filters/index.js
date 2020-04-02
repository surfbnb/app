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
   return this.props.filters.map((filter) => {
      return  <TouchableOpacity style={[inlineStyles.btnStyle , this.getFilterBtnStyle(filter)]}
                  key={filter.id}
                  onPress={multipleClickHandler(() => {this.onFilter(filter);})}>
                  <Text style={[inlineStyles.textStyle , this.getFilterBtnTextStyle(filter)]}>{filter["text"]}</Text>
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
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} bounces={false} contentContainerStyle={inlineStyles.wrapper}>
          {this.getFiltersMarkup()}
          {this.getCreateNewChannelBtn()}
      </ScrollView>
    );
  }

}

Filters.defaultProps ={
  filters: [],
  getCurrentFilter: () => {
    return {}
  },
  onChange: () => { }
}

export default withNavigation(Filters);
