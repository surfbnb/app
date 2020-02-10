export const CUSTOM_TAB_Height = 56;

export const fontFamWeight = {
  fontFamily: 'AvenirNext-DemiBold',
  ...Platform.select({
    android: {
      fontWeight: '700'
    }
  })
};