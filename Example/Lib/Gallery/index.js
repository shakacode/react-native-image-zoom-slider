import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

import Image from '../Image';


export default class Gallery extends Component {

  static propTypes = {
    ...View.propTypes,
    images: PropTypes.arrayOf(PropTypes.shape({
      image: PropTypes.string.isRequired,
      preview: PropTypes.string,
    })),

    // initialPage: PropTypes.number,
    onPageSelected: PropTypes.func,
    onPageScroll: PropTypes.func,

    progress: PropTypes.element,
  };

  static defaultProps = {
    images: [],
  }

  state = {
    width,
    page: 0,
  };

  render() {

    const { images, style } = this.props;

    return (
      <View
        style={[style, {
          justifyContent: "space-between",
          alignItems: "stretch",
          flex: 1,
        }]}
        onLayout={this.onRootViewLayout}
      >
        <FlatList
          //{...this.props}
          ref={(c) => this.gallery = c}
          scrollEnabled
          renderItem={this.renderItem}
          keyExtractor={(item, key) => 'innerImage#' + key}
          data={images}
          getItemLayout={(data, index) => ({
            length: this.state.width,
            offset: this.state.width * index,
            index
          })}
          horizontal
          pagingEnabled
          onViewableItemsChanged={this.onViewableItemsChanged}
        />
      </View>
    );
  }

  onViewableItemsChanged = (info) => {
    // save page in state
    if(info.viewableItems && info.viewableItems.length) {
      const page = info.viewableItems[0].index;
      this.setState({ page });
      this.props.onPageSelected && this.props.onPageSelected(page);
    };
    this.props.onPageScroll && this.props.onPageScroll(info);
  }

  onRootViewLayout = (event) => {
    // scroll to the closest page 
    // when orientation has been changed
    const width = event.nativeEvent.layout.width;
    this.setState({ width }, () => {
      if (this.gallery) {
        this.gallery.scrollToIndex({ index: this.state.page, animated: false });
      }
    });
  }

  renderItem = ({ item, index, separators }) => {
    const { onPageSelected, onPageScroll, images, ...props} = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: this.state.width,
        }}
      >
        <Image
          style={{ 
            //height: null,
            //width: null,
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center", 
          }}
          showLoading
          preview={item.preview}
          source={item.image}
          {...props}
        />
      </View>
    );
  }
}
