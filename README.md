# reservation

## 개요
네이버에서 서비스 중인 예약 페이지를 참고하여 백지에서 시작한 클론 프로젝트

<img src="https://user-images.githubusercontent.com/44011462/94556497-21c86d80-0298-11eb-88ae-685ac13fdda7.gif" width=300px>

## 기능목록

1. 메인 페이지

| <div style="width:100px">기능</div> | <div style="width:300px">참고</div> | <div style="width:300px">설명<div> | 
| --- | --- | --- |
| header | <img src="https://user-images.githubusercontent.com/44011462/95681262-c2fcdf80-0c19-11eb-92c0-7f7e6360ae59.png" width=300px>   | 페이지의 header부분이다. 로고는 m.naver.com으로 연결되며 "예약"은 새로운 예약을 진행하는 페이지로 연결되며 "예약확인"은 사용자별 예약현황을 확인하고 수정하는 페이지로 연결된다. |
| 상품 분류 탭 | <img src="https://user-images.githubusercontent.com/44011462/95675866-3f30fc00-0bf5-11eb-9e23-28fb4500c30a.gif" width=300px>   | 상품 목록을 전시, 뮤지컬 등의 category로 분류하여 보여주는 tab ui. ajax 통신을 이용하여 비동기적으로 상품을 카테고리로 분류하여 가져온다.  |
| 프로모션 슬라이더 | <img src="https://user-images.githubusercontent.com/44011462/95675481-95e90680-0bf2-11eb-831b-d3e907821bfc.gif" width=300px> | 비동기 통신으로 얻은 promotion 목록을 무한 슬라이딩 효과를 이용하여 자동으로 노출한다.  |
| 제품 목록 | <img src="https://user-images.githubusercontent.com/44011462/95680232-191a5480-0c13-11eb-950d-366bde388920.gif" width=300px> | Node.js에서 api로 제공되는 product의 list를 ajax통신으로 비동기적으로 불러와서 표현한다. 4개 단위로 api를 요청하여 표현하며 더이상 불러올 정보가 없다면 "더보기"를 없애준다. 이후 제품 분류 tab을 새롭게 선택하면 다시 "더보기"를 표시한다.  |
| footer | <img src="https://user-images.githubusercontent.com/44011462/95680723-9f846580-0c16-11eb-83e4-fb7eff87428b.png" width=300px> | 페이지 상단으로 올라가는 버튼과 페이지에 해당하는 disclaimer등의 정보등이 담겨있다. |


1. 제품 상세 페이지

| <div style="width:100px">기능</div> | <div style="width:300px">참고</div> | <div style="width:300px">설명<div> | 
| --- | --- | --- |
| 상품 상세 이미지 | <img src="https://user-images.githubusercontent.com/44011462/95680565-9777f600-0c15-11eb-90cc-61a82a42c3b2.png" width=300px>   | 상품정보가 담겨있는 이미지가 무한슬라이드 형식으로 제공된다. 슬라이드는 1.2초를 간격으로 변경된다. 제공되는 이미지가 1개인 경우는 좌우로 이동하는 기능의 버튼이 표시되지 않는다. |
| 이벤트 정보 | <img src="https://user-images.githubusercontent.com/44011462/95680619-ec1b7100-0c15-11eb-9cc9-6e651945deeb.png" width=300px>   | 이벤트 정보를 나태는 공간이다.  |
| 사용자 한줄평 | <img src="https://user-images.githubusercontent.com/44011462/95680632-048b8b80-0c16-11eb-9614-9eea61606d2b.png" width=300px>   | 사용자로부터 입력받은 코멘트를 나타내는 공간이다. 사용자는 한줄평, 이미지, 평점등을 입력할 수 있고 Node.js가 제공하는 api수준에서 평점을 계산하여 제공한다. 4개 단위로 나타나타 예매자 한줄평 더보기를 이용하면 새로운 창으로 redirection되어 더 자세한 정보를 나타낸다. |
| 상세정보 | <img src="https://user-images.githubusercontent.com/44011462/95680685-64823200-0c16-11eb-9678-f0d30b7bbdbc.png" width=300px>   | tab ui를 이용하여 상세정보와 오시는길을 비동기적으로 나타낸다. 길안내는 이미지로 대체하였지만 네이버 지도등의 open api를 이용하여 개산할 예정이다. |


## 개발환경
- macOS Catalina 10.15.6
- Git Tools: Visual Studio Code 1.50.0
- IDE: Visual Studio Code 1.50.0
- nodejs v14.12.0
- javascript ECMAScript 2015
- Mysql Ver 8.0.21 

## 기술스택
- Node.js / express
- Javscript / handlebars / ajax
- Github

## 기타
