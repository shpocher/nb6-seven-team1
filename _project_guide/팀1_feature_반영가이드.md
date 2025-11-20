# feature 최신 작업 반영 가이드

## STEP0: (사전 확인) Node.js 버전 체크

```bash
# Node.js 버전 확인 (필수!)
node --version
# v18.18.0 이상이어야 함 (v20.x 권장)

# 버전이 낮다면
# Windows: https://nodejs.org → LTS 다운로드
# Mac: brew upgrade node
# 또는: nvm install 20 && nvm use 20
```

⚠️ **Node.js 18.18.0 미만이면 npm install 실패합니다!**

## STEP1 : (git 작업) 현재 작업 저장

```
# 현재 작업중인 브랜치에서 작업 내용 커밋 (예시 브랜치명:sanghwi-api)

git add .
git commit -m "wip: sanghwi api 작업 중"

```

## STEP2 : (git 작업) feature 브랜치 최신화

```
git fetch origin
git checkout feature
git pull origin feature
```

## STEP3 : (git 작업) rebase 실행

```
git checkout sanghwi-api
git rebase feature
```

## STEP4 : (git 작업) 충돌 발생 하면 충돌 부분 해결

```
# 충돌 발생 시
git status
# → 충돌 파일 확인

# VSCode에서 충돌 해결
code .

# 해결 후
git add .
git rebase --continue

# 복잡하면 git을 다시 clone해서 아래 초기 설정을 다시 하는 것을 추천합니다.
```

## STEP5 : (터미널 작업) 의존성 재설치

```
# package.json이 변경되었음
rm -rf node_modules package-lock.json
npm install
```

## STEP6 : (터미널 작업) Prisma 마이그레이션

```
# schema.prisma가 변경되었으므로 강제 리셋 후 마이그래이션
npx prisma migrate reset --force

# 더미데이터 생성기 실행
npm run seed
```

## STEP7 : (터미널 작업) 확인 및 작업 재개

```
# Prisma studio 실행해서 더미데이터 정상 생성되었는지 확인
npx prisma studio

# 서버 실행 확인
npm run dev

```

## git 너무 어렵다 그러면 아래 방법추천

- 기존 작업한 파일을 별도 폴더에 백업해놓기
- git repo 다시 clone 해오기 (feature 브랜치)
- 초급 프로젝트 개발가이드 적용 방법에 따라 다시 수행
- 설정 완료후 아래 더미데이터 생성 명령어만 실행

```
npm run seed
```

---

**작성일**: 2025.11.06
**팀**: NB6-1팀
**작성자**: 상휘
**버전**: 1.0
