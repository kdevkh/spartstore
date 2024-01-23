document.addEventListener("DOMContentLoaded", function () {
  // 상품 등록 모달 속성
  const createProductBtn = document.getElementById("createProductBtn");
  const createProductModal = document.getElementById("createProductModal");
  const closeBtn = document.getElementById("closeBtn");

  createProductBtn.addEventListener("click", function () {
    createProductModal.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    createProductModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === createProductModal) {
      createProductModal.style.display = "none";
    }
  });

  // 작성하기 버튼 클릭 시 서버로 데이터 전송
  const saveChangesBtn = document.getElementById("saveChangesBtn");

  saveChangesBtn.addEventListener("click", async function () {
    const name = document.getElementById("productName").value;
    const thumbnailUrl = document.getElementById("productThumbnailUrl").value;
    const price = document.getElementById("productPrice").value;
    const description = document.getElementById("productDescription").value;
    const seller = document.getElementById("productSeller").value;
    const password = document.getElementById("productPassword").value;

    // 서버로 데이터 전송
    try {
      const response = await fetch("/api/goods", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          thumbnailUrl,
          price,
          description,
          seller,
          password,
        }),
      });

      const data = await response.json();
      console.log(data); // 확인

      createProductModal.style.display = "none";
    } catch (error) {
      console.error(error);
    }
  });

  //   상품 상세조회
  const productDetailModal = document.getElementById("productDetailModal");
  const productDetailContent = document.getElementById("productDetailContent");
  const closeProductModalBtn = document.getElementById("closeDetailModalBtn");

  document.body.addEventListener("click", function (event) {
    const target = event.target;

    // product클래스 갖고옴
    if (target.classList.contains("product")) {
      // 클릭된 상품의 아이디 가져옴
      const productId = target.getAttribute("data-product-id");

      // 서버에서 상세 정보 가져옴
      fetch(`/api/goods/${productId}`)
        .then((response) => response.json())
        .then((data) => {
          const product = data.product;

          // 상세 정보를 모달창에 표시
          productDetailContent.innerHTML = `
                    <h2>${product.name}</h2>
                    <img src="${product.thumbnailUrl}" alt="${product.name}" style="max-width: 100%">
                    <p>판매자: ${product.seller}</p>
                    <p>가격: ${product.price} 원</p>
                    <p>설명: ${product.description}</p>
                 `;

          productDetailModal.style.display = "block";
        })
        .catch((error) => console.error(error));
    }
  });

  // 모달창 닫기 버튼에 대한 클릭 이벤트 핸들러
  closeProductModalBtn.addEventListener("click", function () {
    productDetailModal.style.display = "none";
  });
});
