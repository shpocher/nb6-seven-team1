/**
 * 이미지 URL 변환 유틸리티
 *
 * 호성님의 image-controller와 연계하여 이미지 경로를 처리합니다.
 * - 저장 시: URL에서 "uploads/파일명.jpg" 추출
 * - 조회 시: "uploads/파일명.jpg"를 전체 URL로 변환
 *
 * 사용하는 곳:
 * - record (운동 기록 photos)
 * - group (나중에 이미지 추가 시)
 * - 기타 이미지를 사용하는 모든 기능에 적용 가능
 */

/**
 * URL에서 경로 추출
 *
 * 팀원의 image-controller는 다음 형식으로 URL을 반환:
 * - "http://localhost:3000/uploads/abc.jpg"
 *
 * DB에는 "uploads/abc.jpg" 형식으로 저장하여 BASE_URL 변경에 유연하게 대응
 *
 * @param {string} url - 전체 URL 또는 경로
 * @returns {string|null} "uploads/파일명.jpg" 형식의 경로
 *
 * @example
 * extractImagePath("http://localhost:3000/uploads/abc.jpg")
 * // → "uploads/abc.jpg"
 *
 * extractImagePath("uploads/abc.jpg")
 * // → "uploads/abc.jpg"
 *
 * extractImagePath("abc.jpg")
 * // → "uploads/abc.jpg"
 */
export function extractImagePath(url) {
  if (!url) return null;

  // 이미 "uploads/"로 시작하면 그대로 반환
  if (url.startsWith('uploads/')) {
    return url;
  }

  // URL에서 "uploads/파일명" 부분 추출
  // "http://localhost:3000/uploads/abc.jpg" → "uploads/abc.jpg"
  const match = url.match(/uploads\/[^\/]+$/);
  if (match) {
    return match[0];
  }

  // 매칭 안 되면 파일명만 추출해서 uploads/ 추가
  const filename = url.split('/').pop();
  return `uploads/${filename}`;
}

/**
 * 경로를 전체 URL로 변환
 *
 * DB에 저장된 "uploads/abc.jpg"를 환경에 맞는 전체 URL로 변환
 *
 * @param {string} path - DB에 저장된 경로
 * @returns {string|null} 전체 URL
 *
 * @example
 * // 개발 환경 (BASE_URL=http://localhost:3000)
 * buildImageUrl("uploads/abc.jpg")
 * // → "http://localhost:3000/uploads/abc.jpg"
 *
 * // 프로덕션 환경 (BASE_URL=https://api.example.com)
 * buildImageUrl("uploads/abc.jpg")
 * // → "https://api.example.com/uploads/abc.jpg"
 */
export function buildImageUrl(path) {
  if (!path) return null;

  // 이미 전체 URL이면 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // BASE_URL과 결합
  const baseUrl = process.env.BASE_URL || '';
  return `${baseUrl}/${path}`;
}

/**
 * URL 배열을 경로 배열로 변환 (저장용)
 *
 * 클라이언트가 보낸 URL 배열을 DB 저장용 경로 배열로 변환
 *
 * @param {string[]} urls - URL 배열
 * @returns {string[]} 경로 배열
 *
 * @example
 * convertUrlsToPaths([
 *   "http://localhost:3000/uploads/abc.jpg",
 *   "http://localhost:3000/uploads/def.jpg"
 * ])
 * // → ["uploads/abc.jpg", "uploads/def.jpg"]
 */
export function convertUrlsToPaths(urls) {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.map((url) => extractImagePath(url)).filter((path) => path !== null);
}

/**
 * 경로 배열을 URL 배열로 변환 (조회용)
 *
 * DB의 경로 배열을 클라이언트 응답용 URL 배열로 변환
 *
 * @param {string[]} paths - 경로 배열
 * @returns {string[]} URL 배열
 *
 * @example
 * convertPathsToUrls(["uploads/abc.jpg", "uploads/def.jpg"])
 * // → [
 * //   "http://localhost:3000/uploads/abc.jpg",
 * //   "http://localhost:3000/uploads/def.jpg"
 * // ]
 */
export function convertPathsToUrls(paths) {
  if (!paths || !Array.isArray(paths)) return [];
  return paths.map((path) => buildImageUrl(path)).filter((url) => url !== null);
}

/**
 * 단일 객체의 이미지 필드를 URL로 변환
 *
 * DB에서 조회한 객체의 이미지 필드들을 전체 URL로 변환
 *
 * @param {Object} obj - DB에서 조회한 객체
 * @param {string[]} imageFields - 변환할 이미지 필드명 배열
 * @returns {Object} 이미지가 URL로 변환된 객체
 *
 * @example
 * const record = {
 *   id: 1,
 *   photos: ["uploads/abc.jpg"],
 *   thumbnail: "uploads/thumb.jpg"
 * };
 *
 * convertImageFieldsToUrls(record, ['photos', 'thumbnail'])
 * // → {
 * //   id: 1,
 * //   photos: ["http://localhost:3000/uploads/abc.jpg"],
 * //   thumbnail: "http://localhost:3000/uploads/thumb.jpg"
 * // }
 */
export function convertImageFieldsToUrls(obj, imageFields = ['photos']) {
  if (!obj) return obj;

  const converted = { ...obj };

  for (const field of imageFields) {
    if (converted[field]) {
      // 배열인 경우
      if (Array.isArray(converted[field])) {
        converted[field] = convertPathsToUrls(converted[field]);
      }
      // 단일 값인 경우
      else if (typeof converted[field] === 'string') {
        converted[field] = buildImageUrl(converted[field]);
      }
    }
  }

  return converted;
}

/**
 * 배열 객체들의 이미지 필드를 URL로 변환
 *
 * DB에서 조회한 객체 배열의 이미지 필드들을 전체 URL로 변환
 *
 * @param {Object[]} array - DB에서 조회한 객체 배열
 * @param {string[]} imageFields - 변환할 이미지 필드명 배열
 * @returns {Object[]} 이미지가 URL로 변환된 객체 배열
 *
 * @example
 * const records = [
 *   { id: 1, photos: ["uploads/abc.jpg"] },
 *   { id: 2, photos: ["uploads/def.jpg"] }
 * ];
 *
 * convertArrayImageFieldsToUrls(records, ['photos'])
 * // → [
 * //   { id: 1, photos: ["http://localhost:3000/uploads/abc.jpg"] },
 * //   { id: 2, photos: ["http://localhost:3000/uploads/def.jpg"] }
 * // ]
 */
export function convertArrayImageFieldsToUrls(array, imageFields = ['photos']) {
  if (!array || !Array.isArray(array)) return array;
  return array.map((obj) => convertImageFieldsToUrls(obj, imageFields));
}
