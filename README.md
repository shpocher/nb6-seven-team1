# 🎓 {팀 1}

> 코드잇 노드 백엔드 6기
> 백엔드 초급 프로젝트 : SEVEN

📎 **팀 협업 문서:**
[Notion](https://www.notion.so/Node-js-6-1-2a18b40f38c3800f92cfd1f58e9c8c2f)
[Github-Issues](https://github.com/shpocher/nb6-seven-team1/issues)

---

## 👥 팀원 구성

| 이름   | 역할 (1차)                                    | 역할 (2차)               | Github                                            |
| ------ | --------------------------------------------- | ------------------------ | ------------------------------------------------- |
| 이호성 | 이미지 업로드 API (with multer) 작업          | Postman 전체 API 검증    | [이호성 Github](https://github.com/Leon97-dev)    |
| 김지선 | 그룹 추천 API (Create, Delete) 작업           | 이미지 업로드 기능 적용  | [김지선 Github](https://github.com/KimDay366)     |
| 나영준 | 참여자 API (Create, Delete) 작업              | 그룹 배지 기능 추가 구현 | [나영준 Github](https://github.com/YeongJun01)    |
| 이상휘 | 전체 프로젝트 관리, 운동 기록 API (CRUD) 작업 | 전체 프로젝트 관리       | [이상휘 Github](https://github.com/shpocher)      |
| 이지민 | 랭킹 API (Read) 작업                          | 전체 코드 및 로직 확인   | [이지민 Github](https://github.com/truely00-beep) |
| 정동원 | 그룹 API (CRUD) 작업                          | 디스코드 웹훅 기능 추가  | [정동원 Github](https://github.com/tunajjang)     |

---

## 🧩 프로젝트 소개

**목표:**  
운동 인증 커뮤니티 서비스(SEVEN)의 **백엔드 시스템 구축**을 통해 그룹, 참여자, 운동 기록 등 핵심 기능을 구현합니다.

**주요 기능:**

- 그룹 생성, 삭제, 수정, 조회
- 그룹 좋아요, 뱃지 기능 구현
- 그룹에 참여자 등록
- 그룹에 운동 기록 생성, 조회
- 그룹 내 운동 기록 랭킹 조회

---

## 🛠️ 기술 스택

| 구분          | 기술                          |
| ------------- | ----------------------------- |
| **Backend**   | Express.js, Prisma ORM        |
| **Database**  | Postgrsql                     |
| **공통 Tool** | Git & Github, Discord, Notion |

---

## 🧑‍💻 팀원별 구현 기능

### 이호성

- **이미지 업로드 API**

  - multer 활용해 이미지 업로드 구현

- **Postman 전체 API 검증**
  - Postman 활용해 전체적인 API 작동 방식 및 결과 검증

---

### 김지선

- **그룹 추천 API 구현**
  - 그룹 추천이 호출될 때 추천수가 1씩 증가
  - 그룹 추천 증가, 감소 따로 구현 (추천과 취소)
- **이미지 업로드 기능 적용**
  - 이미지 업로드 API를 활용해 필요한 곳에 적용(예: 그룹 등록 시)

---

### 나영준

- **참여자 API 구현**
  - 참여자가 닉네임과 비밀번호를 입력해 그룹에 참여
  - 비밀번호 인증을 통해 그룹 참여 취소 가능
- **그룹 배지 기능 구현**
  - 그룹이 일정 조건을 달성하면 자동으로 배지 획득 (참여자 10명, 운동기록 100개, 추천수 100 이상)
  - 달성한 조건이 미달성으로 변동될 시 배지 사라짐

---

### 이상휘

- **전체 프로젝트 관리**
  - 프로젝트 베이스 구축 (에러 처리 구문 등)
  - 팀 프로젝트 레포지토리 생성 및 PR 관리 (PR 리뷰 및 최종 merge)
  - 중간 발표 자료 준비
- **운동 기록 API 구현**
  - 운동 기록 등록, 조회 구현
  - 타이머를 통해 실제 운동한 만큼의 시간만 입력

---

### 이지민

- **랭킹 조회 API 구현**
  - 운동 기록 많은 순으로 주간, 월간 랭킹 조회
  - 닉네임, 기록 횟수 누적 시간 조회
- **전체 코드 및 로직 확인**
  - 프로젝트 전반적인 코드 및 로직의 흐름 파악, 에러 검증

---

### 정동원

- **그룹 API 구현**
  - 그룹 등록, 수정, 삭제, 조회 구현
  - 수정, 삭제 시에는 비밀번호를 입력받아 확인 후 진행
- **디스코드 웹훅 기능 추가**
  - 새로운 운동 기록 등록시 그룹에 등록된 디스코드 웹 서버로 알림 전송

---

## 📁 프로젝트 구조

```bash
NB6-SEVEN-TEAM1
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.js
├── src
│   ├── constrollers
│   │   ├── badge-controller.js
│   │   ├── group-controller.js
│   │   ├── group-like-count-controller.js
│   │   ├── health-controller.js
│   │   ├── image-controller.js
│   │   ├── participant-controller.js
│   │   ├── ranking-controller.js
│   │   └── record-controller.js
│   ├── middlewares
│   │   ├── error-handler.js
│   │   └── upload.js
│   ├── routes
│   │   ├── group-like-count-routes.js
│   │   ├── group-routes.js
│   │   ├── health-routes.js
│   │   ├── image-routes.js
│   │   ├── participant-routes.js
│   │   ├── ranking-routes.js
│   │   └── record-routes.js
│   ├── utils
│   │   ├── date-range.js
│   │   ├── debug.js
│   │   ├── discord-msg-utils.js
│   │   ├── image-utils.js
│   │   └── prisma.js
│   ├── validators
│   │   └── record-validatior.js
│   └── app.js
├── .env
├── .gitignore
├── .prettierrc
├── .prettierrc.json
├── package-lock.json
├── package.json
└── README.md
```

---

## 🌐 구현 홈페이지

[https://www.codeit.kr/](https://www.codeit.kr/)

---

## 🧠 프로젝트 회고록

> [중간 발표 자료](https://nb6-t1-middle.netlify.app/)
> 발표자료 및 회고록 링크: [프로젝트 계획서](https://www.notion.so/2a18b40f38c380e3b0f0c623169fcd37)

---

📌 **작성일:** 2025-11-17
📌 **작성자:** nb6기 Team1
