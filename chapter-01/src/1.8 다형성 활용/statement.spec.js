import invoices from "../invoices";
import plays from "../plays";
import { htmlStatement, statement } from "./statement";

describe("statement", () => {
  it("statement 리턴 결과 확인", () => {
    const result = statement(invoices[0], plays);
    expect(result).toMatchInlineSnapshot(`
"청구내역 (고객명: BigCo)
Hamlet : $650.00 (55석)
As You Like It : $580.00 (35석)
Othello : $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
"
`);
  });

  it("htmlStatement 리턴 결과 확인", () => {
    const result = htmlStatement(invoices[0], plays);
    expect(result).toMatchInlineSnapshot(`
"<h1>청구 내역 (고객명: BigCo )</h1>
<table>
<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr><tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>
<tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>
<tr><td>Othello</td><td>40</td><td>$500.00</td></tr>
</table>
<p>총액: <em>$1,730.00</em></p>
<p>적립 포인트: <em>47</em>점</p>
</table>
"
`);
  });
});
