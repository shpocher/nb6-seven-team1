# NB6-1팀 SEVEN 프로젝트 코드 컨벤션

> 내부 코드 작성 규칙

---

## 📁 1. 프로젝트 구조

```
project-seven/
├── src/
│   ├── controllers/      # 비즈니스 로직 처리
│   ├── routes/          # 라우터 정의
│   ├── middlewares/     # 미들웨어 (에러처리, 검증 등)
│   ├── utils/           # 공통 유틸리티 함수
│   ├── validators/      # 요청 데이터 검증
│   └── app.js           # Express 앱 설정
├── prisma/
│   └── schema.prisma    # 데이터베이스 스키마
├── .env                 # 환경 변수
├── .gitignore
└── package.json
```

---

## 📝 2. 네이밍 컨벤션

### 2.1 파일명

- **kebab-case** 사용 (소문자 + 하이픈)
- 명확한 역할 표시

```javascript
✅ 좋은 예:
group-controller.js
image-upload.middleware.js
password-validator.js

❌ 나쁜 예:
GroupController.js
imageUpload.js
pwd_val.js
```

### 2.2 변수명 & 함수명

- **camelCase** 사용
- 동사 + 명사 조합 (함수)
- 명확한 의미 전달

```javascript
✅ 좋은 예:
const groupId = req.params.groupId;
const createdGroup = await createGroup(data);
function validatePassword(password) { }

❌ 나쁜 예:
const GID = req.params.groupId;
const g = await create(data);
function check(pwd) { }
```

### 2.3 상수명

- **UPPER_SNAKE_CASE** 사용

```javascript
✅ 좋은 예:
const DEFAULT_PAGE_SIZE = 10;
const MAX_IMAGE_COUNT = 3;
const BADGE_TYPES = {
  PARTICIPANT_10: 'PARTICIPANT_10',
  RECORD_100: 'RECORD_100',
  LIKE_100: 'LIKE_100'
};

❌ 나쁜 예:
const defaultPageSize = 10;
const max_image_count = 3;
```

### 2.4 클래스명

- **PascalCase** 사용

```javascript
✅ 좋은 예:
class GroupController { }
class ValidationError extends Error { }

❌ 나쁜 예:
class groupController { }
class validation_error { }
```

---

## 🎨 3. 코드 스타일

### 3.1 기본 규칙

```javascript
// ✅ 세미콜론 사용
const name = "SEVEN";

// ✅ 2칸 들여쓰기
if (condition) {
  doSomething();
}

// ✅ 싱글 쿼트 사용
const message = "Hello World";

// ✅ 화살표 함수 권장
const getGroups = async (req, res) => {
  // ...
};

// ✅ const/let 사용, var 금지
const userId = 1;
let count = 0;
```

### 3.2 코드 간격

```javascript
// ✅ 논리적 블록 사이 빈 줄 추가
const groupId = req.params.groupId;
const { password } = req.body;

const group = await prisma.group.findUnique({
  where: { id: groupId },
});

if (!group) {
  throw new NotFoundError("그룹을 찾을 수 없습니다");
}

// ✅ 연산자 앞뒤 공백
const total = page * limit;
if (count > 0) {
}

// ❌ 빈 줄 없이 빽빽하게
const groupId = req.params.groupId;
const { password } = req.body;
const group = await prisma.group.findUnique({ where: { id: groupId } });
if (!group) {
  throw new NotFoundError("그룹을 찾을 수 없습니다");
}
```

---

## 🗂️ 4. 파일 구조 패턴

### 4.1 Controller 파일

```javascript
// group-controller.js
import prisma from "../utils/prisma.js";
import {
  NotFoundError,
  UnauthorizedError,
} from "../middlewares/error-handler.js";

class GroupController {
  // ✅ 메서드는 async로 작성
  async createGroup(req, res) {
    const { name, description, password } = req.body;

    // 비즈니스 로직
    const group = await prisma.group.create({
      data: { name, description, password },
    });

    // 응답
    res.status(201).json({
      message: "그룹이 생성되었습니다",
      data: group,
    });
  }

  async getGroups(req, res) {
    // ...
  }
}

export default new GroupController();
```

### 4.2 Router 파일

```javascript
// group-routes.js
import express from "express";
import groupController from "../controllers/group-controller.js";
import { validateGroupCreate } from "../validators/group-validator.js";

const router = express.Router();

// ✅ HTTP 메서드 순서: GET → POST → PATCH → DELETE
router.get("/", groupController.getGroups);
router.post("/", validateGroupCreate, groupController.createGroup);
router.get("/:groupId", groupController.getGroupById);
router.patch("/:groupId", groupController.updateGroup);
router.delete("/:groupId", groupController.deleteGroup);

export default router;
```

---

## 📡 5. API 응답 형식

### 5.1 성공 응답

```javascript
// ✅ 일관된 구조 사용
// 단일 데이터
res.status(200).json({
  message: "조회 성공",
  data: {
    id: 1,
    name: "SEVEN",
    // ...
  },
});

// 목록 데이터 (페이지네이션 포함)
res.status(200).json({
  message: "목록 조회 성공",
  data: [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    totalPages: 5,
  },
});

// 생성/수정/삭제
res.status(201).json({
  message: "그룹이 생성되었습니다",
  data: createdGroup,
});
```

### 5.2 에러 응답

```javascript
// ✅ Global Error Handler에서 처리
res.status(404).json({
  message: "그룹을 찾을 수 없습니다",
  error: "NOT_FOUND",
});

res.status(400).json({
  message: "입력 데이터가 올바르지 않습니다",
  error: "VALIDATION_ERROR",
  details: [{ field: "name", message: "그룹명은 필수입니다" }],
});
```

---

## ⚠️ 6. 에러 처리

### 6.1 커스텀 에러 클래스

```javascript
// middlewares/error-handler.js

// ✅ 에러 클래스 정의
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "리소스를 찾을 수 없습니다") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "비밀번호가 일치하지 않습니다") {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(message = "입력 데이터가 올바르지 않습니다") {
    super(message, 400);
  }
}
```

### 6.2 에러 사용 예시

```javascript
// ✅ Controller에서 에러 던지기
async deleteGroup(req, res) {
  const { groupId } = req.params;
  const { password } = req.body;

  const group = await prisma.group.findUnique({
    where: { id: parseInt(groupId) }
  });

  // 존재하지 않는 경우
  if (!group) {
    throw new NotFoundError('그룹을 찾을 수 없습니다');
  }

  // 비밀번호 불일치
  if (group.password !== password) {
    throw new UnauthorizedError('비밀번호가 일치하지 않습니다');
  }

  await prisma.group.delete({
    where: { id: parseInt(groupId) }
  });

  res.status(200).json({
    message: '그룹이 삭제되었습니다'
  });
}
```

### 6.3 Global Error Handler

```javascript
// ✅ app.js에 등록
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "서버 에러가 발생했습니다";

  res.status(statusCode).json({
    message,
    error: err.name || "SERVER_ERROR",
  });
});
```

---

## 💬 7. 주석 작성 규칙

```javascript
// ✅ 복잡한 로직에만 간결하게 작성
// 배지 조건 체크: 참여자 10명 이상
if (participantCount >= 10) {
  badges.push("PARTICIPANT_10");
}

// ✅ 함수 설명 (JSDoc)
/**
 * 그룹의 배지 목록을 계산합니다
 * @param {number} groupId - 그룹 ID
 * @returns {Promise<string[]>} 배지 이름 배열
 */
async function calculateBadges(groupId) {
  // ...
}

// ❌ 불필요한 주석
// 변수에 groupId 할당
const groupId = req.params.groupId;

// ❌ 코드와 불일치하는 주석
// 사용자 삭제
await prisma.group.delete({ where: { id } }); // ???
```

---

## 🔐 8. 환경 변수

```bash
# .env
# ✅ 대문자 + 언더스코어
DATABASE_URL="postgresql://user:password@localhost:5432/seven"
PORT=3000
NODE_ENV=development
DEBUG_MODE=true  # 개발 시 true, 프로덕션 시 false

# ❌ 나쁜 예
databaseUrl="..."
port=3000
```

```javascript
// ✅ 사용 시
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const DEBUG_MODE = process.env.DEBUG_MODE === "true";
```

---

## 🐛 9. 디버그 플래그 관리

### 9.1 사용 예시

```javascript
// ✅ Controller에서 사용
import { debugLog, debugError } from "../utils/debug.js";

class GroupController {
  async createGroup(req, res) {
    debugLog("그룹 생성 요청 데이터:", req.body);

    try {
      const group = await prisma.group.create({
        data: req.body,
      });

      debugLog("그룹 생성 완료:", group);

      res.status(201).json({
        message: "그룹이 생성되었습니다",
        data: group,
      });
    } catch (error) {
      debugError("그룹 생성 실패:", error);
      throw error;
    }
  }
}

// ✅ 복잡한 로직 디버깅
import { debugLog, runInDebugMode } from "../utils/debug.js";

async function calculateBadges(groupId) {
  const badges = [];

  const participantCount = await getParticipantCount(groupId);
  debugLog("참여자 수:", participantCount);

  if (participantCount >= 10) {
    badges.push("PARTICIPANT_10");
    debugLog("배지 획득: PARTICIPANT_10");
  }

  // 디버그 모드에서만 배지 목록 전체 출력
  runInDebugMode(() => {
    console.table(badges);
  });

  return badges;
}

// ✅ API 응답 시간 측정 (디버그용)
import { debugLog, isDebugMode } from "../utils/debug.js";

async function getGroups(req, res) {
  const startTime = isDebugMode() ? Date.now() : null;

  const groups = await prisma.group.findMany();

  if (isDebugMode()) {
    const endTime = Date.now();
    debugLog(`조회 소요 시간: ${endTime - startTime}ms`);
  }

  res.status(200).json({ data: groups });
}
```

### 9.2 디버그 플래그 사용 시 주의 사항

```javascript
// ❌ 일반 console.log 직접 사용 금지
console.log("디버깅 중..."); // 삭제하거나 debugLog 사용!

// ❌ 프로덕션 환경에서 민감 정보 노출
debugLog("사용자 비밀번호:", password); // 절대 금지!

// ✅ 민감하지 않은 정보만 로깅
debugLog("그룹 ID:", groupId);
debugLog("요청 메서드:", req.method);
```

### 9.3 테스트 코드에서 활용

```javascript
// tests/group.test.js
import { isDebugMode, debugLog } from "../utils/debug.js";

describe("그룹 생성 테스트", () => {
  it("그룹이 정상적으로 생성되어야 한다", async () => {
    const groupData = {
      name: "Test Group",
      description: "Test Description",
    };

    debugLog("테스트 데이터:", groupData);

    const response = await request(app).post("/groups").send(groupData);

    if (isDebugMode()) {
      debugLog("응답 상태:", response.status);
      debugLog("응답 데이터:", response.body);
    }

    expect(response.status).toBe(201);
  });
});
```

### 9.4 환경별 설정

```bash
# 개발 환경 (.env.development)
DEBUG_MODE=true
NODE_ENV=development

# 프로덕션 환경 (.env.production)
DEBUG_MODE=false
NODE_ENV=production

# 테스트 환경 (.env.test)
DEBUG_MODE=true
NODE_ENV=test
```

---

## 🗄️ 10. Prisma 스키마 컨벤션

```prisma
// ✅ 모델명: PascalCase (단수형)
model Group {
  id          Int      @id @default(autoincrement())
  name        String   // camelCase
  description String?  // nullable은 ? 표시
  imageUrl    String?  @map("image_url") // DB는 snake_case
  createdAt   DateTime @default(now()) @map("created_at")

  // 관계는 복수형
  participants Participant[]
  records      Record[]

  @@map("groups") // 테이블명은 복수형 snake_case
}

// ❌ 나쁜 예
model group {  // 소문자 ❌
  ID Int  // 대문자 ❌
  Name String  // PascalCase ❌
}
```

---

## 🔄 11. Git 커밋 메시지

### 10.1 커밋 메시지 형식

```bash
<타입>: <제목>

<본문 (선택)>
```

### 10.2 타입 종류

```bash
feat:     새로운 기능 추가
fix:      버그 수정
refactor: 코드 리팩토링
style:    코드 포맷팅, 세미콜론 누락 등
docs:     문서 수정
test:     테스트 코드 추가
chore:    빌드, 패키지 등 기타 작업
```

### 10.3 예시

```bash
✅ 좋은 예:
feat: 그룹 생성 API 구현
fix: 그룹 목록 조회 시 페이지네이션 오류 수정
refactor: 비밀번호 검증 로직 utils로 분리

❌ 나쁜 예:
update
작업완료
기능 추가함
```

---

## 📋 12. 코드 리뷰 체크리스트

### 리뷰어 확인 사항

- [ ] 네이밍 컨벤션 준수
- [ ] 에러 처리 적절히 구현
- [ ] 응답 형식 통일
- [ ] 불필요한 주석 제거
- [ ] (권장) console.log 대신 debugLog 사용
- [ ] 민감 정보 로깅 금지
- [ ] 하드코딩된 값 없음
- [ ] async/await 일관성

---

## 💡 13. 베스트 프랙티스

### 12.1 비동기 처리

```javascript
// ✅ async/await 사용
async function getGroup(id) {
  const group = await prisma.group.findUnique({
    where: { id },
  });
  return group;
}

// ❌ .then() 체이닝 지양
function getGroup(id) {
  return prisma.group
    .findUnique({
      where: { id },
    })
    .then((group) => {
      return group;
    });
}
```

### 12.2 매직 넘버 금지

```javascript
// ✅ 상수로 정의
const MAX_IMAGE_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;

if (images.length > MAX_IMAGE_COUNT) {
  throw new ValidationError("이미지는 최대 3장까지 업로드 가능합니다");
}

// ❌ 하드코딩
if (images.length > 3) {
  // 3이 무엇을 의미하는지 불명확
  throw new ValidationError("이미지는 최대 3장까지 업로드 가능합니다");
}
```

### 12.3 Early Return 패턴

```javascript
// ✅ 조건 불만족 시 빠르게 리턴
async function deleteGroup(req, res) {
  const group = await findGroup(id);

  if (!group) {
    throw new NotFoundError();
  }

  if (group.password !== password) {
    throw new UnauthorizedError();
  }

  await prisma.group.delete({ where: { id } });
  res.status(200).json({ message: "삭제 성공" });
}

// ❌ 중첩된 if문
async function deleteGroup(req, res) {
  const group = await findGroup(id);

  if (group) {
    if (group.password === password) {
      await prisma.group.delete({ where: { id } });
      res.status(200).json({ message: "삭제 성공" });
    } else {
      throw new UnauthorizedError();
    }
  } else {
    throw new NotFoundError();
  }
}
```

---

## 🚨 14. 주의 사항

```javascript
// ❌ 일반 console.log 직접 사용 (debugLog 사용 권장)
console.log("디버깅 중..."); // ❌ debugLog로 변경!

// ✅ 디버그 유틸리티 사용
import { debugLog } from "../utils/debug.js";
debugLog("디버깅 중..."); // DEBUG_MODE=true일 때만 출력

// ❌ 비밀번호 평문 저장 (실제로는 해싱 필요하지만 이 프로젝트에서는 예외)
// ❌ SQL Injection 취약점 (Prisma 사용으로 방지)

// ❌ 하드코딩된 민감 정보
const apiKey = "abc123xyz"; // .env 사용!

// ❌ var 사용
var count = 0; // const/let 사용!

// ❌ 에러 무시
try {
  await doSomething();
} catch (error) {
  // 아무것도 안 함 ❌
}
```

---

## 📚 15. 참고 자료

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## ✅ 체크리스트 (PR 전 확인)

코드 작성 후 꼭 확인하세요!

- [ ] 네이밍 컨벤션 준수 (camelCase, PascalCase, kebab-case)
- [ ] API 응답 형식 통일 (message, data)
- [ ] 에러 처리 구현 (try-catch, 커스텀 에러)
- [ ] console.log 대신 debugLog 사용
- [ ] 민감 정보 로깅 금지 (비밀번호, API 키 등)
- [ ] 불필요한 주석 제거
- [ ] .env 변수 사용 (하드코딩 금지)
- [ ] 커밋 메시지 형식 준수
- [ ] 코드 포맷팅 (2칸 들여쓰기, 세미콜론)

---

**작성일**: 2025.11.04  
**버전**: 1.0
