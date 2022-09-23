import {StyleSheet} from 'react-native';
import {colors} from '../../colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 8,
    flex: 1,
  },
  postContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 6,
  },
  postText: {
    color: colors.on_primary,
  },
  createPostText: {
    flex: 1,
  },
});
