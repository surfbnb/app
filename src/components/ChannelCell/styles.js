import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  header: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.5
  },

  channelDesc: {
    color: '#fff',
    letterSpacing: 0.2,
    fontWeight: '500',
    minHeight: 40,
    marginTop: 2
  },
  channelCellWrapper: {
    minHeight:130,
    backgroundColor: '#a77c7d',
    margin:10,
    // padding: 15,
    borderRadius: 4,
  },
  bottomView: {
    marginTop: 20,
    flexDirection: 'row'
  },

  memberText: {
    flex: 1,
    color: '#fff'
  },

  videoText: {
    flex: 1,
    color: '#fff'
  },

  joinViewWrapper: {
    flex: 1,
    alignItems: 'flex-end'
  },

  joinView: {
    backgroundColor: '#fff',
    opacity:0.8,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  joinText: {
    fontWeight: '500'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
