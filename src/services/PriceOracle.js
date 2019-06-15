import BigNumber from 'bignumber.js';

const usdPrecession = 5;
const btPrecession = 5;

export default class PriceOracle {
  constructor(config) {
    if (!config || !config.conversionFactor || !config.usdPricePoint || !config.decimal) {
      return null;
    }
    this.conversionFactor = config.conversionFactor;
    this.usdPricePoint = config.usdPricePoint;
    this.decimal = config.decimal;
  }

  btToFiat(bt) {
    if (!bt) {
      return '';
    }
    bt = BigNumber(bt);
    let fiatBN = BigNumber(this.usdPricePoint);
    oneBtToFiat = fiatBN.dividedBy(this.conversionFactor);
    let result = oneBtToFiat.multipliedBy(bt);
    return this.toFiat(result);
  }

  toFiat(fiat) {
    if (!fiat) {
      return '';
    }
    fiat = String(fiat);
    fiat = BigNumber(fiat);
    return fiat.toFixed(usdPrecession);
  }

  fiatToBt(fiat) {
    if (!fiat) {
      return '';
    }
    fiat = BigNumber(fiat);
    let fiatBN = BigNumber(this.usdPricePoint);
    let totalSc = fiat.dividedBy(fiatBN);
    let totalBt = totalSc.multipliedBy(this.conversionFactor);
    return this.toBt(totalBt);
  }

  toBt(bt) {
    if (!bt) {
      return '';
    }
    bt = String(bt);
    bt = BigNumber(bt);
    return bt.toFixed(btPrecession);
  }

  toDecimal(val) {
    if (!val) return '';
    val = BigNumber(val);
    let exp = BigNumber(10).exponentiatedBy(this.decimal);
    return val.multipliedBy(exp).toString(10);
  }
}
