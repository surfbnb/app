import DefaultStyleGenerator from "./DefaultStyleGenerator";

let styles = {
  textInputStyle: {
    borderColor: '#E9E9E9',
    borderWidth: 1.5,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '300',
    padding: 5,
    paddingLeft: 15,
    marginTop: 10,
    color: 'rgb(0, 0, 0)',
    height: 50
  }
};

export default (TextInput = DefaultStyleGenerator.generate(styles));
