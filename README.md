# how-to-solve-it

폴리아의 《어떻게 풀 것인가》(How to Solve It) 네 단계를 따라 문제를 정리하는 **정적 워크시트**.

- 사이트: https://datalater.github.io/how-to-solve-it/
- 런타임 의존성 없음 (순수 HTML / CSS / JS)
- 답변은 `localStorage`에 자동 저장
- **Print / PDF**: 브라우저 인쇄 → “PDF로 저장”

## 로컬 미리보기

```sh
npx --yes serve public
```

## 배포

`main` 브랜치 push 시 GitHub Pages로 자동 배포됩니다. (`resume`와 동일한 Actions 방식)

## 구조

```
public/
  index.html   # 워크시트 UI
  styles.css   # 화면 + 인쇄 스타일
  app.js       # 단계 이동, 저장, 인쇄
  favicon.ico
```
