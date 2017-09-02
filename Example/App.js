import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { 
  range,
  map,
  pipe,
} from 'ramda';
import randomColor from 'randomcolor';
import Gallery from 'react-native-image-zoom-slider';
import Styles from './styles';

const images = pipe(
  range(0),
  map((index) => {
    const color = randomColor().substring(1, 7);
    return {
      image: `http://via.placeholder.com/2000x1500/${color}`,
      preview: `http://via.placeholder.com/200x150/${color}`,
    }
  })
)(10);

export default class App extends React.Component {
  state = {
    showGallery: false,
    page: 0,
  }

  componentDidMount() {
    const all = Expo.ScreenOrientation.Orientation.ALL;
    Expo.ScreenOrientation.allow(all);
  }

  onPageSelected = (page) => {
    this.setState({ page });
  }
  
  showGallery = () => {
    this.setState({ showGallery: true });
  }

  render() {
    return (
      <View style={Styles.root}>
        <View style={Styles.count}>
          <Text style={Styles.countText}>{this.state.page+1} of {images.length}</Text>
        </View>
        <TouchableOpacity onPress={this.showGallery}><Text>Show gallery</Text></TouchableOpacity>
        {this.state.showGallery && 
          <Gallery
            images={images}
            onPageSelected={this.onPageSelected}
            style={Styles.gallery}
          />
        }
      </View>
    );
  }
}

