script = document.createElement("script");

script.onload = function () {
  const body = $("body");
  body.css({
    position: "relative",
  });
  const shop = Shopify.shop;
  const makeApp = (products) => {
    const bestSellerContainer = $(
      `<div style="overflow-y: scroll;">
            <h4>Our bestsellers</h4>
            ${products
              .map((product) => {
                return `
                <a href="/products/${product.handle}"
                    style="display: flex; align-items: center; padding: 20px 10px; border: 1px solid #000000;"
                > 
                <img src="${product.images[0].originalSrc}" style="width:75px;"/>
                <div style="display: flex; justify-content: space-between; align-items: start; width: 100%;">
                    <p style="padding: 0 10px;">${product.title}</p>
                    <p>${product.variants[0].price}</p>
                </div>
                </a>
                `;
              })
              .join("")}
        </div>`
    ).css({
      position: "fixed",
      "background-color": "#ffffff",
      border: "1px solid #000000",
      bottom: "80px",
      right: "25px",
      height: "400px",
      width: "350px",
      padding: "10px",
      display: "none",
      "z-index": 100,
    });

    const bestSellerButton = $("<img />")
      .attr(
        "src",
        "https://img.icons8.com/cute-clipart/64/000000/show-property.png"
      )
      .css({
        position: "fixed",
        width: "50px",
        bottom: "20px",
        right: "20px",
        cursor: "pointer",
      });

    body.append(bestSellerButton);
    body.append(bestSellerContainer);
    bestSellerButton.click(() => {
      bestSellerContainer.slideToggle();
    });
  };

  fetch(
    `https://cors-anywhere.herokuapp.com/https://7909f0466743.ngrok.io/api/products?shop=${shop}`
  )
    .then((res) => res.json())
    .then((data) => {
      makeApp(data.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

script.type = "text/javascript";
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js";
const head = document.getElementsByTagName("head")[0];
head.appendChild(script);
