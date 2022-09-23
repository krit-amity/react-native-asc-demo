import {StyleSheet} from 'react-native';
import {colors} from '../../colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginVertical: 8,
    marginHorizontal: 8,
  },

  headerContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerBody: {
    paddingLeft: 8,
    justifyContent: 'space-evenly',
  },
  headerTitle: {},
  headerSubTitle: {
    color: colors.on_surface_secondary,
  },

  bodyText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bodyImage: {
    aspectRatio: 1,
  },

  footerCountContainer: {
    flexDirection: 'row',
  },
  footerCountText: {
    color: colors.on_surface_secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },

  likedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
