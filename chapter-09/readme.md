## 데이터 조직화

### 9.1 변수 쪼개기

- 역할이 둘 이상인 변수는 쪼개야한다. 여러 용도로 쓰인 변수는 추후 큰 혼란을 야기한다.

1. 변수 이름 정확하게 짓기
2. const로 불변으로 만들기

### 9.2 필드 이름 바꾸기

```javascript
//before
class Organization {
  get name() {}
}

//after
class Organization {
  get title() {}
}
```

### 9.3 파생 변수를 질의 함수로 바꾸기

- 피연산자 데이터가 불변이라면 계산 결과도 일정하므로 불변이다.'

**example**

```javascript
//before
get production() { return this._production; }
applyAdjustment(anAdjustment) {
    this.adjustment.push(anAdjustment);
    this.production += anAdjustment.amount
}

//after
get production() {
    return this._adjustments.reduce((sum, a) => sum + a.amount, 0)
}
applyAdjustment(anAdjustment) {
    this.adjustment.push(anAdjustment);
}
```

### 9.3 참조를 값으로 바꾸기

```javascript
//before
class Product {
  applyDiscount(arg) {
    this._price.amount -= arg;
  }
}

//after
class Product {
  applyDiscount(arg) {
    this._price = new Money(this._price.amount - arg, this._price.currentcy);
  }
}
```

- 객체(데이터 구조)를 다른 객체에 중첩하면 내부 객체를 참조하거나 값으로 취급할 수 있다.
  - 참조로 다루는 경우 : 객체의 속성만 갱신
  - 값으로 다루는 경우
    - 기존 내부 객체를 통째로 대체
    - 필드를 값으로 다룰 경우, 불변이기 때문에 자유롭게 활용하기 좋다
    - 서로 간의 참조를 관리하지 않아도 되서 분산 시스템과 동시성 시스템에서 유용

**Example**

```javascript
//before
class Person {
  constructor() {
    tis._telephoneNumber = new TelephoneNumber();
  }

  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }
  set officeAreaCode(arg) {
    this._telephoneNumber.areaCode = arg;
  }
  get officeNumber() {
    return this._telephoneNumber.number;
  }
  set officeNumber(arg) {
    this._telephoneNumber.number = arg;
  }
}

class TelephoneNumber {
  get areaCode() {
    return this.areaCode;
  }
  set areaCode(arg) {
    this.areaCode = arg;
  }
  get number() {
    return this.number;
  }
  set number(arg) {
    this.number = arg;
  }
}

//after
class Person {
  constructor() {
    tis._telephoneNumber = new TelephoneNumber();
  }

  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }
  set officeAreaCode(arg) {
    this._telephoneNumber = new TelephoneNumber(arg, this.officeNumber);
  }
  get officeNumber() {
    return this._telephoneNumber.number;
  }
  set officeNumber(arg) {
    this._telephoneNumber = new TelephoneNumber(this.officeAreaCode, arg);
  }
}

class TelephoneNumber {
  get areaCode() {
    return this.areaCode;
  }
  set areaCode(arg) {
    return (this.areaCode = arg);
  }
  get number() {
    return this.number;
  }
  set number(arg) {
    return (this.number = arg);
  }
}
```

- javascript에는 동치성 관련한 기능을 언어 차원에서 지원해주는 게 없으므로 `eqauls` 메서드를 직접 작성하자

### 9.5 값을 참조로 바꾸기

```javascript
//before
let customer = new Customer(customerData);

//after
let customer = customerRepository.get(customerData.id);
```

**배경**

- 하나의 데이터 구조 안에 논리적으로 똑같은 제3의 데이터 구조를 참조하는 레코드가 여러 개 있을 수 있음(주문 목록 안에 같은 고객 정보)
  - 고객 데이터를 값으로 다루면 각 주문에 고객 정보 복사
  - 고객 데이터를 참조로 다루면 여러 주문이 하나의 고객 정보 참조
- 수정될 일이 없다면 상관 없지만 값으로 다룰 때 갱신이 발생한다면 모든 데이터들을 갱신해줘야함
  -> 하나만 바꾸며 모든 데이터에 반영되는 참조가 유리

- 객체들을 한 군데 모아두고 클라이언트들의 접근을 관리해줄 저장소 필요
  Example

```javascript
let _repositoryData;

export function initialize() {
  _repositoryData = {};
  _repositoryData.customers = new Map();
}

export function registerCustomer(id) {
  if (!_repositoryData.customers.has(id)) {
    _repositoryData.customers.set(id, new Customer(id));
  }
  return findCustomer(id);
}

export function findCustomer(id) {
  return _repositoryData.customers.get(id);
}

/////////
class Order {
  constructor(data) {
    this._number = data.number;
    this._customer = registerCustomer(data.customer);
  }

  get customer() {
    return this._customer;
  }
}
```

- 위 예시 코드는 생성자 본문이 전역 저장소와 결합된다는 문제가 있다. 저장소를 생성자 매개변수로 전달하게끔 수정하면 이를 피할 수 있다.(DI)

### 9.6 매직 리터럴 바꾸기
