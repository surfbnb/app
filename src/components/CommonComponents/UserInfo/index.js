import React from 'react';
import { View, Image, Text, Linking} from 'react-native';
import { connect } from 'react-redux';

import profilePicture from '../../../assets/default_user_icon.png';
import Colors from '../../../theme/styles/Colors'
import TouchableButton from "../../../theme/components/TouchableButton";
import Theme from '../../../theme/styles';
import inlineStyle from './styles';
import pricer from "../../../services/Pricer";
import  CurrentUser from "../../../models/CurrentUser";
import reduxGetter from "../../../services/ReduxGetters";

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName( ownProps.userId ,state ),
    name: reduxGetter.getName( ownProps.userId , state ),
    bio: reduxGetter.getBio( ownProps.userId , state ),
    supporters : reduxGetter.getUserSupporters( ownProps.userId , state  ),
    supporting: reduxGetter.getUsersSupporting( ownProps.userId , state  ),
    btAmount: reduxGetter.getUsersBt( ownProps.userId , state  )
  }
}

class UserInfo extends React.PureComponent {
  constructor(props){
    super(props)
  }

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle();
    if(!priceOracle) return 0;
    btAmount = priceOracle.fromDecimal( btAmount );
    return priceOracle.btToFiat( btAmount  , 2) ;
  }

  onEdit = () => {
    this.props.onEdit && this.props.onEdit();
  }

  editButton(){
    if(  this.props.userId == CurrentUser.getUserId() ){
     return (
       <TouchableButton onPress={this.onEdit}
         TouchableStyles = {[Theme.Button.btnPinkSecondary,{width:100}]}
         TextStyles = {[Theme.Button.btnPinkSecondaryText]}
         text="Edit Profile"
       />
     ) ;
    }
  }

  render(){
    console.log("render------UserInfo");
    return(
      <View style={{margin:20}}>

        <View style={inlineStyle.infoHeaderWrapper}>
          <Image style={inlineStyle.profileImageSkipFont} source={ this.props.profilePicture || profilePicture}></Image>
          <Text style={inlineStyle.userName}>{this.props.userName}</Text>
        </View>
        {this.editButton()}

        <Text style={inlineStyle.bioSection}>{this.props.bio}</Text>
        <Text style={{color:Colors.summerSky}} onPress={()=>{Linking.openURL(this.props.link)}}>
          {this.props.link}
        </Text>

        <View style={inlineStyle.numericInfoWrapper}>
          <View style={{marginHorizontal:10}}>
            <Text style={inlineStyle.numericInfo}>{this.props.supporting || 0 }</Text>
            <Text>Supporting</Text>
          </View>
          <View style={{marginHorizontal:10}}>
            <Text style={inlineStyle.numericInfo}>{this.props.supporters || 0 }</Text>
            <Text>Supporters</Text>
          </View>
          <View style={{marginHorizontal:10}} >
            <Text style={inlineStyle.numericInfo}>${this.btToFiat(this.props.btAmount)}</Text>
            <Text>Raised</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps)(UserInfo) ;