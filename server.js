require("isomorphic-fetch");
const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaBody = require("koa-body");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const dotenv = require("dotenv");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
const compose = require("koa-compose");

dotenv.config();
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

const router = new KoaRouter();

const storeProducts = {};

router.get("/api/products", async (ctx) => {
  try {
    const { shop } = ctx.request.query;
    console.log(shop);
    if (!shop) {
      ctx.body = {
        status: 403,
        data: "Shop not set",
      };
      return;
    }
    ctx.body = {
      status: "success",
      data: storeProducts[shop] ? storeProducts[shop] : [],
    };
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/api/products",
  compose([KoaBody(), verifyRequest()]),
  async (ctx) => {
    try {
      const { products } = ctx.request.body;
      console.log({ products });
      const { shop } = ctx.session;
      console.log({ shop });
      if (!shop) {
        ctx.body = {
          status: 403,
          data: "Shop not set",
        };
        return;
      }
      if (!products || !products.length) {
        ctx.body = {
          status: 403,
          data: "Products not set",
        };
        return;
      }
      storeProducts[shop] = [...(storeProducts[shop] || []), ...products];
      console.log("products added", storeProducts);
      ctx.body = "Products added";
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete(
  "/api/products",
  compose([KoaBody(), verifyRequest()]),
  async (ctx) => {
    try {
      const { shop } = ctx.session;
      // const { shop } = ctx.request.query;
      if (!shop) {
        ctx.body = {
          status: 403,
          data: "Shop not set",
        };
        return;
      }
      delete storeProducts[shop];
      ctx.body = "All products deleted";
    } catch (error) {
      console.log(error);
    }
  }
);

const server = new Koa();
// Router Middleware
server.use(router.allowedMethods());
server.use(router.routes());

app.prepare().then(() => {
  server.use(session({ sameSite: "none", secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        "read_products",
        "write_products",
        "read_script_tags",
        "write_script_tags",
      ],
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        console.log({ session: ctx.session }, accessToken);
        console.log({ shop });
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        ctx.redirect("/");
      },
    })
  );

  server.use(graphQLProxy({ version: ApiVersion.October19 }));
  server.use(verifyRequest());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
