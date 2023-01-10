import { Province, sampleProvinceData } from ".";

describe("province", function () {
  let asia;
  beforeEach(function () {
    asia = new Province(sampleProvinceData());
  });

  it("shortfall", function () {
    expect(asia.shortfall).toEqual(5);
  });

  it("profit", function () {
    expect(asia.profit).toEqual(230);
  });

  it("change production", function () {
    asia.producers[0].production = 20;

    expect(asia.shortfall).toEqual(-6);
    expect(asia.profit).toEqual(292);
  });
});
