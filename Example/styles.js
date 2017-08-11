import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    backgroundColor: '#000',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  count: {
    position: 'absolute',
    top: 0,
    left: 60,
    right: 60,
    height: 60,
    zIndex: 200,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  countText: {
    textAlign: 'center',
    color: '#fff',
  },

  gallery: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000',
  }
});
