## 캡슐화

모듈을 분리하는 가장 중요한 기준 : 다른 모듈에 드러내지 않아야 할 비밀을 잘 숨기는 것

### 7.1 레코드 캡슐화하기

**배경**
가변 데이터 -> 객체(Class)
불변 데이터 -> 레코드(단순 객체)

**간단한 레코드 캡슐화**
단순히 class화

**복잡한 레코드 캡슐화**

1. deepClone + 사용하는 부분만 get/set 구성
2. 재귀적으로 레코드 캡슐화
   - 할 일은 많지만 확실하게 제어 가능
   - 데이터 구조 거대해지면 일이 너무 커짐
   - 게터는 데이터 구조 깊게 탐색하되 원본 대신 객체로 감싸서 반환하는 게 효과적
   - https://martinfowler.com/articles/refactoring-document-load.html

### 7.2 컬렉션 캡슐화하기

**배경**

- 컬렉션 변수로의 접근을 캡슐화하면서 게터가 컬렉션 자체 반환하게 하면 가변성 생김
- add나 remove 메소드 추가해서 컬렉션 변경은 항상 소유한 클래스를 통해서만 가능하도록
- 컬렉션이 크다면 성능 이슈 있음
  - 실제로 Node의 경우 json 직렬화/역직렬화 로직을 할 때 이벤트 루프가 점유되어 데이터가 클수록 성능에 매우 직접적인 영향.
  - 그러나 그런 경우는 드물긴 함
  - 프록시 방식 : 원본 데이터를 수정하는 과정이 겉으로는 드러나지만 복제에서는 그렇지 않음
  - 중요한 것은 일관성

### 7.3 기본형을 객체로 바꾸기

```javascript
//before
order.filter((o) => "high" === o.priority || "rush" === o.priority);

//after
orders.filter((o) => o.priority.higherThan(new Priority("normal")));
```

단순 출력 이상의 기능이 필요해지면 그것을 표현하는 전용 클래스 정의.

허용값 표현으로 legalValues 좋은 거 같다. \_index를 활용한 higherThan과 equals 방식도 배워간다.

### 7.4 임시 변수를 질의 함수로 바꾸기

- 코드의 중복을 위해 임시 변수를 쓰는 것에서 한 걸음 더 나아가 함수로 추출하는 것이 더 좋다.
- 부자연스러운 의존관계나 부수효과 찾기 좋음

### 7.5 클래스 추출하기

클래스는 반드시 명확하게 추상화하고 소수의 주어진 역할만 처리해야한다.

### Discussion

- Deep Clone 방법
- slice vs rest operator vs Array.from (vs splice)
  https://stackoverflow.com/questions/51164161/spread-syntax-vs-slice-method
