import { modalMessageList } from "./message.js";

const getCurrentDate = () => {
	return new Date(
		new Date("2023-12-25").toLocaleString("en-US", { timeZone: "Asia/Seoul" })
	);
};

const setMainImage = (imageUrl, target) => {
	const img = new Image();
	img.src = imageUrl;

	img.onload = () => {
		target.style.backgroundImage = `url(${imageUrl})`;
		target.style.width = "100%";
	};

	img.onerror = () => {
		console.log("없어요");
		target.style.flexGrow = "0";
	};
};

function showModal(imageUrl, text, subImageUrl) {
	const existingModal = document.querySelector(".modal");
	if (existingModal) existingModal.remove();

	const existingOverlay = document.querySelector(".overlay");
	if (existingOverlay) existingOverlay.remove();

	// 오버레이 생성
	const overlay = document.createElement("div");
	overlay.className = "overlay";

	// 모달 생성
	const modal = document.createElement("div");
	modal.className = "modal";

	// 모달 내용을 담는 컨테이너 생성
	const modalContent = document.createElement("div");
	modalContent.className = "modal-content zoomIn";

	// 이미지 표시할 요소 생성
	const image = document.createElement("div");
	image.className = "mainImage";
	setMainImage(imageUrl, image);

	// 서브 이미지 표시할 요소 생성
	const subImage = document.createElement("div");
	subImage.className = "subImage";
	subImage.style.backgroundImage = `url(${subImageUrl})`;
	subImage.alt = "sub-image";
	subImage.style.width = "100%";
	subImage.style.flexGrow = "1";

	// 텍스트 표시할 요소 생성
	const textElement = document.createElement("p");
	// 파라미터로 받은 text 넣어줌
	textElement.textContent = text;
	textElement.style.flexGrow = "0";

	// 모달 컨텐트에 이미지와 텍스트를 자식 요소로 추가
	modalContent.appendChild(subImage);
	modalContent.appendChild(image);
	modalContent.appendChild(textElement);

	console.log(modalContent.querySelector(".mainImage"));

	// 모달에 모달 컨텐트를 추가
	modal.appendChild(modalContent);

	// 모달에 클릭 이벤트 리스너를 추가
	// 코드 순서와 상관 없이 click 이벤트가 일어났을 경우 두번 째 인자의 콜백함수가 실행
	modal.addEventListener("click", () => {
		modal.remove();

		const overlay = document.querySelector(".overlay");
		if (overlay) {
			overlay.remove();
		}
	});

	document.body.appendChild(overlay);
	document.body.appendChild(modal);
}

// 크리스마스로 타겟 데이트 설정
const targetDate = new Date("2023-12-25T00:00:00Z");

function updateCountdown() {
	// 현재 한국 시간을 얻어오기
	const now = getCurrentDate();

	// 남은 시간 계산
	const timeRemaining = targetDate - now;

	//날짜의 차이를 ms 단위로 변환시켜서 반환 (초, 분, 시, 일)
	const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

	// 결과를 HTML에 업데이트
	const countdownElement = document.getElementById("countdown");
	countdownElement.style.color = "white";

	if (days === 0) {
		countdownElement.innerHTML = `
    <span>MERRY CHRISTMAS!</span>`;
		const title = document.getElementById("mainTitle");
		title.remove();
	} else {
		countdownElement.innerHTML = `
      <span>D-${days}♡</span>`;
	}
}

// 30분마다 업데이트
setInterval(updateCountdown, 1000 * 60 * 30);

// 페이지 로드 시에도 업데이트 수행
updateCountdown();

const days = document.querySelectorAll('[class^="day-"]');
days.forEach((day) => {
	day.addEventListener("click", (event) => {
		event.preventDefault();

		// 모달이 열려있으면 함수 종료 (중복 실행 막기 위해)
		if (document.querySelector(".modal")) return;

		// 현재 한국 시간을 얻어오기
		const now = getCurrentDate();

		// 각 day 요소에서 숫자만 가져오기 위해 가공
		const dayNumber = parseInt(day.className.split("-")[1]);

		// 각 카드를 열 수 있는 날짜 구하기
		const openDate = new Date(`2023-12-${dayNumber}`);

		// 현재 날짜가 열 수 있는 날짜 이후인지 확인
		if (now >= openDate) {
			const imageUrl = `./src/img/barcode/${dayNumber}.png`;
			const subImage = `./src/img/sub-image/${dayNumber}-sub.png`;
			// const imageUrl = `./src/img/barcode.png`;

			const text = modalMessageList[dayNumber - 15]["message"];
			showModal(imageUrl, text, subImage);
		} else {
			// 현재 날짜가 열 수 있는 날짜보다 이전인 경우 몇 일 후에 열 수 있다는 메시지를 표시
			const daysRemaining = Math.ceil((openDate - now) / (1000 * 60 * 60 * 24));
			alert(`이 카드는 ${daysRemaining}일 후에 열 수 있어요!`);
		}
	});
});
