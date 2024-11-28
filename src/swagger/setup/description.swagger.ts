export const SwaggerDescription = `
## 1. 사용방법

<details>
<summary>1. swagger 사용 방법</summary>

1. 해당 API를 클릭한다.
2. Try it out을 누른다.
3. Execute를 누른다.
4. 결과를 본다.

</details>


</br>


---

## 2. 공통 사항 (error output에 대한 정보)

#### API 호출 공통적으로 아래 결과가 첨부되어 보내진다. (statusCode는 확인 후 삭제 예정, HTTP Response로 대체)

example)
| 변수명 | 타입 | 설명 |
| - | - | - |
| code | string | 상태 정보
| error | string | 상세 에러 코드 ( 에러 시에만 리턴 됨)
| message | string | 실행 관련 메시지
| Data | T | 요청에 대한 데이터

## 3. 에러 코드 정보 - 미완성
<details>
<summary>**[ 5xx ]**  서버 에러</summary>

</details>

`;
