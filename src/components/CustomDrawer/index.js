import React, { Component } from 'react';
import { Drawer } from 'native-base';

import CustomDrawerContent from '../CustomDrawerContent';

export default class CustomDrawer extends Component {
    constructor(props){
        super(props);
        this.drawer = null;
    }

    render(){
        return (
        <Drawer
            ref={(ref) => { this.drawer = ref; }}
            open={this.props.openDrawer}
            content={<CustomDrawerContent navigation={this.props.navigation} />}
            side={'right'} 
            onClose={this.props.onClose}
            type={'overlay'}>
                {this.props.children}
        </Drawer>
        );
    }
}