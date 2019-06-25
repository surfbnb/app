import BigNumber from 'bignumber.js';

const usdPrecession = 5;
const btPrecession = 5;

export default class PriceOracle {
  constructor(token, pricePoints) {
    if (!token || !token.conversion_factor || !token.decimals || !pricePoints) {
      return null;
    }
    this.conversionFactor = token.conversion_factor;
    this.decimals = token.decimals;
    this.usdPricePoint = pricePoints['USD'];
  }

  btToFiat(bt) {
    if (!bt || !this.usdPricePoint) {
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
    if (!fiat || !this.usdPricePoint) {
      return '';
    }
    fiat = BigNumber(fiat);
    let fiatBN = BigNumber(this.usdPricePoint);
    let totalSc = fiat.dividedBy(fiatBN);
    let totalBt = totalSc.multipliedBy(this.conversionFactor);
    return this.toBt(totalBt);
  }

  toBt(bt) {
    return PriceOracle.toBt(bt);
  }

  toDecimal(val) {
    if (!val) return '';
    val = BigNumber(val);
    let exp = BigNumber(10).exponentiatedBy(this.decimals);
    return val.multipliedBy(exp).toString(10);
  }

  fromDecimal(val) {
   return PriceOracle.fromDecimal(val, this.decimals)
  }

  static fromDecimal(val, decimals) {
    decimals = decimals || 18;
    if (!val) return '';
    val = BigNumber(val);
    let exp = BigNumber(10).exponentiatedBy(decimals);
    return val.dividedBy(exp).toString(10);
  }

  static toBt(bt, precession) {
    precession = precession || btPrecession;
    if (!bt) {
      return '';
    }
    bt = String(bt);
    bt = BigNumber(bt);
    return bt.decimalPlaces(precession, 1).toString(10);
  }
}
