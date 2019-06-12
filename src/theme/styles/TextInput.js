import DefaultStyleGenerator from "./DefaultStyleGenerator";

let styles = {
  textInputStyle: {
    borderColor: '#afafaf',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 17,
    fontWeight: '300',
    padding: 5,
    paddingLeft: 15,
    marginTop: 10,
    color: '#484848',
    height: 46
  }
};

export default (TextInput = DefaultStyleGenerator.generate(styles));
