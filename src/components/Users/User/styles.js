import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  item: {
    fontSize: 15,
    flex: 1,
    fontWeight: '300',
    color: '#34445b'
  },
  expressBtn: {
    marginRight: 15,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  sendBtn: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  txtWrapper: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  imageStyleSkipFont: {
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    width: 40
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
