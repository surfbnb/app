import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

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
    // marginTop: 20,
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    maxWidth: 80,
    alignItems: 'center',
    paddingHorizontal: 12
  },
  joinText: {
    color: Colors.dark,
    fontSize: 16,
    fontWeight: '500'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
