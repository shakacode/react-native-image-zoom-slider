import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';

import ImageProgress from "react-native-image-progress";
import ViewTransformer from 'react-native-view-transformer';

const sameSource = (source, nextSource) => {
  if (source === nextSource) {
    return true;
  }
  if (source && nextSource) {
    if (source.uri && nextSource.uri) {
      return source.uri === nextSource.uri;
    }
  }
  return false;
}

export default class TransformableImage extends Component {

  static propTypes = {
    enableScale: PropTypes.bool,
    enableTranslate: PropTypes.bool,
    onViewTransformed: PropTypes.func,
    showLoading: PropTypes.bool,

    // for react-native-image-progress
    indicator: PropTypes.func,
    indicatorProps: PropTypes.object,
  };

  static defaultProps = {
    enableScale: true,
    enableTranslate: false,
    showLoading: false,
    indicator: ActivityIndicator,
  };

  state = {
    scale: 1,
    translateX: 0,
    translateY: 0,

    imageLoaded: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!sameSource(this.props.source, nextProps.source)) {
      //image source changed, clear last image's pixels info if any
      this.setState({pixels: undefined, keyAcumulator: this.state.keyAcumulator + 1})
      this.getImageSize(nextProps.source);
    }
  }

  onLoadStart = (event) => {
    this.props.onLoadStart && this.props.onLoadStart(event);
    this.state.imageLoaded = false  //solve (react-native 0.44.3 android) multiple update views
  }

  onLoad = (event) => {
    this.props.onLoad && this.props.onLoad(event);
    this.setState({ imageLoaded: true });
  }

  getViewTransformerInstance() {
    return this.refs['viewTransformer'];
  }

  render() {
    const showPreview = this.props.showLoading && !this.state.imageLoaded;
    const source = showPreview ? this.props.preview : this.props.source;

    return (
      <View
        style={{ 
          flex: 1,
        }}
        centerContent
        {...this.gestureResponder}
      >
        <ViewTransformer
          ref='viewTransformer'
          onViewTransformed={this.props.onViewTransformed}
          style={{
            flex: 1,
          }}
          maxScale={this.props.maxScale}
        >
          <ImageProgress
            indicator={this.props.indicator}
            indicatorProps={this.props.indicatorProps}
            source={{ uri: source }}
            style={[this.props.style, { 
              backgroundColor: 'transparent', 
            }]}
            resizeMode="contain"
            onLoadStart={this.onLoadStart}
            onLoad={this.onLoad}
            capInsets={{left: 0.1, top: 0.1, right: 0.1, bottom: 0.1}} //on iOS, use capInsets to avoid image downsampling
          />
        </ViewTransformer>
      </View>
    );
  }
}