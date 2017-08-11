import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ActivityIndicator,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';

import ImageProgress from "react-native-image-progress";

export default class TransformableImage extends Component {

  static propTypes = {
    enableTransform: PropTypes.bool,
    enableScale: PropTypes.bool,
    enableTranslate: PropTypes.bool,
    onViewTransformed: PropTypes.func,
    showLoading: PropTypes.bool,
    // for react-native-image-progress
    indicator: PropTypes.func,
    indicatorProps: PropTypes.object,
  };

  static defaultProps = {
    enableTransform: true,
    enableScale: true,
    enableTranslate: false,
    showLoading: false,
    indicator: ActivityIndicator,
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,

      imageLoaded: false,
      pixels: undefined,
      keyAcumulator: 1
    };
  }


  resetZoomScale = () => {
    const { width, height } = this.state;
    this.zoomRef.scrollTo({x: 0, y: 0, animated: true});
    this.scrollResponderRef.scrollResponderZoomTo({ 
			x: 0,
			y: 0,
			width,
			height,
			animated: false,
    });
  }

	//the ScrollView has a scrollResponder which allows us to access more methods to control the ScrollView component
	setZoomRef = (node) => {
		if (node) {
			this.zoomRef = node
			this.scrollResponderRef = this.zoomRef.getScrollResponder()
		}
	}

  render() {
    const showPreview = this.props.showLoading && !this.state.imageLoaded;
    const source = showPreview ? this.props.preview : this.props.source;
    const { width, height } = Dimensions.get('window');

    return (
      <ScrollView
        ref={this.setZoomRef}
        maximumZoomScale={4}
        contentContainerStyle={{ 
          height,
          width,
          flex: 1,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={this.onLayout}
        centerContent
      >
        <ImageProgress
          indicator={this.props.indicator}
          indicatorProps={this.props.indicatorProps}
          source={{ uri: source }}
          style={[this.props.style, { backgroundColor: 'transparent' }]}
          resizeMode="contain"
          onLoadStart={this.onLoadStart}
          onLoad={this.onLoad}
          capInsets={{left: 0.1, top: 0.1, right: 0.1, bottom: 0.1}} //on iOS, use capInsets to avoid image downsampling
        />
      </ScrollView>
    );
  }


  onLoadStart = (event) => {
    this.props.onLoadStart && this.props.onLoadStart(event);
    this.state.imageLoaded = false  //solve (react-native 0.44.3 android) multiple update views
  }

  onLoad = (event) => {
    this.props.onLoad && this.props.onLoad(event);
    this.setState({ imageLoaded: true });
  }

  onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width: width,
        height: height
      }, () => {
        this.resetZoomScale();
        this.props.onViewTransformed && this.props.onViewTransformed(event);
      });
    }
  }
}
