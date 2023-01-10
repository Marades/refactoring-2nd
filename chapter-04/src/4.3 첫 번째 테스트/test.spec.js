import assert from "assert";
import { Province, sampleProvinceData } from ".";

describe("province", function () {
  it("shortfall", function () {
    // 1. 픽스처 설정
    const asia = new Province(sampleProvinceData());

    // 2. 검증
    expect(asia.shortfall).toEqual(5);
  });
});
