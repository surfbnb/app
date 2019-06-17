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
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  userContainer: {
    padding: 12,
    flexDirection: 'row',
    flex: 1,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgb(233,233,233)',
    // justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  txtWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
    // paddingTop: 5,
    // paddingBottom: 5
  },
  btnWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  imageStyleSkipFont: {
    backgroundColor: '#ef5566',
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    width: 40
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
