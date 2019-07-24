import React,{PureComponent} from 'react';
import {View, Text, Modal, Image, TouchableOpacity} from 'react-native';

import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';


export default class AllowAccessModal extends PureComponent {
  constructor( props ){
    super( props );
    this.state={
      modalVisible : props.modalVisibility
    }
  }

  setModalVisibility(visibleVal){
    this.setState({
      modalVisible:visibleVal
    })
  }


  render(){
    return(
     <Modal
       animationType="slide"
       transparent={false}
       visible={this.state.modalVisible}
       onRequestClose={()=>{this.setModalVisibility(false)}}>
       <View style={{flex:1}}>
         <View style={inlineStyles.allowAccessheader}>
             <TouchableOpacity
                onPress={()=>{this.setModalVisibility(false)}}
                style={inlineStyles.crossIconWrapper}>
               <Image style={inlineStyles.crossIconDimSkipFont} source={crossIcon}></Image>
             </TouchableOpacity>
             <Text style={inlineStyles.headerText}>{this.props.headerText}</Text>
         </View>
         <View style={inlineStyles.accessAllowContent}>
           <Image source={this.props.imageSrc} style={[inlineStyles.imageDimSkipFont,this.props.imageSrcStyle]} />
           <Text style={inlineStyles.accessTextDesc}>{this.props.accessTextDesc}</Text>
           <Text style={inlineStyles.accessText}>{this.props.accessText}</Text>
         </View>
       </View>
     </Modal>
    )
  }

}