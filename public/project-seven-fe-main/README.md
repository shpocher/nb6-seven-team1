# SEVEN 프론트엔드

## 준비

필요한 패키지를 설치해 주세요.

```bash
npm install
```

## 프로젝트 설정

### API Base URL 환경변수 설정
`.env` 파일 생성 후 `.env.sample` 파일을 참고하여 환경변수를 설정합니다.
예를들어서 로컬 백엔드 서버의 주소가 `http://localhost:3001`이라면 다음과 같이 설정합니다.

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

이 환경 변수는 Next.js 서버에서 Base URL로 쓰도록 구현해 둔 값입니다. `/lib/axios.ts` 파일에서 Axios 인스턴스 생성에 사용합니다.

### 이미지 주소 허용
`next.config.ts` 파일에서 이미지 주소를 허용해 주어야 합니다.
만약 백엔드 서버에 업로드한 이미지 파일이 `http://localhost:3001/.../photo.png`와 같이 제공된다면 Next.js에서 이미지를 올바로 보여주기 위해 해당 주소를 허용해 주어야 합니다. (`remotePatterns` 부분)

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/groups/:groupId((?!/new).)*',
        destination: '/groups/:groupId*/records',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
    ],
  },
};

export default nextConfig;
```

## 프로젝트 로컬에서 실행

Next.js 프로젝트를 로컬에서 실행합니다.

```bash
npm run dev
```

## API 수정 및 디버깅 하기

`/lib/api.ts` 파일을 수정하여 백엔드 API 리퀘스트를 디버깅하실 수 있습니다.

Next.js의 경우 프론트엔드 개발 프레임워크이지만 BFF(Backend For Frontend) 서버이기 때문에,
Client -> Next.js 서버 -> 백엔드 서버 순으로 리퀘스트가 흐릅니다. (리스폰스는 반대)
이때 클라이언트가 Next.js 서버에 보내는 리퀘스트는 백엔드 서버의 API 명세와 무관합니다.

따라서 기본적으로 Next.js 서버에서 백엔드로 보내는 리퀘스트가 웹 브라우저에서 노출되지 않으며, 마찬가지로 백엔드에서 주는 리스폰스도 그대로 웹 브라우저에 노출되지 않습니다.

그래서 수강생 편의를 위해 의도적으로 `api.ts` 파일에 모든 리퀘스트에 대한 함수를 분리해 두었습니다.
여기서 `logError()` 함수를 통해 에러가 발생했을 때 백엔드 서버에서 주는 리스폰스를 콘솔에 출력할 수 있습니다.
또한 엔드포인트 경로를 수정하거나, 원하는 쿼리 파라미터 혹은 바디 타입을 사용하도록 수정하시면 됩니다.

아래는 페이지네이션 요청을 수정하는 예시입니다.

### 원본 코드
```ts
export const DEFAULT_RECORDS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

export const getRecords = async (
  groupId: number,
  query: PaginationQuery
): Promise<PaginationResponse<Record>> => {
  try {
    const response = await axios.get(`/groups/${groupId}/records`, {
      params: {
        ...DEFAULT_RECORDS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};
```


### 수정한 코드

이상적으로는 프론트엔드 코드를 수정하는 것이 바람직하지만,
실습 편의를 위해 `api.ts` 파일에서만
아래처럼 데이터 형식을 내가 구현한 백엔드에 맞게 바꿀 수도 있습니다.
리퀘스트 주소 `/groups/${groupId}/records`에서 `/groups/${groupId}/logs`로 바꾸고, 쿼리 파라미터를 `page`, `pageSize`, `order`, `orderBy`, `keyword`를 사용하도록 했고, 리스폰스 바디의 프로퍼티 이름도 `data`, `total`이 아닌 `items`, `count`로 사용했습니다.


```ts
export const DEFAULT_RECORDS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

export const getRecords = async (
  groupId: number,
  query: PaginationQuery
): Promise<PaginationResponse<Record>> => {
  const convertedQuery = {
    page: query.page,
    pageSize: query.limit,
    order: query.order,
    orderBy: query.orderBy,
    keyword: query.search,
  };
  try {
    const response = await axios.get(`/groups/${groupId}/logs`, {
      params: {
        page: 1,
        pageSize: 6,
        order: 'desc',
        orderBy: 'createdAt',
        keyword: '',
        ...convertedQuery,
      },
    });
    const { items, count } = response.data;
    return { data: items, total: count };
  } catch (error) {
    logError(error);
    throw error;
  }
};
```