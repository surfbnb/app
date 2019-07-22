import React from 'react';
import { View, FlatList } from 'react-native';
import User from './User';
import flatlistHOC from "../CommonComponents/flatlistHOC";

const UserList = (props) => (
    <View style={{ flex: 1 }}>
        <FlatList
          data={props.list}
          onEndReached={() => props.getNext()}
          onRefresh={() => props.refresh()}
          keyExtractor={(item, index) => `id_${item}`}
          onEndReachedThreshold={0.5}
          refreshing={props.refreshing}
          ListFooterComponent={props.renderFooter}
          fetchUrl={'/users'}
          renderItem={({ item }) => {
            return <User id={item} />;
          }}
        />
    </View>
);

export default flatlistHOC( UserList );
