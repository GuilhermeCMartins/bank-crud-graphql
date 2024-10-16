import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

app.use(logger());

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404, 'Not found');
    }
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
      status: ctx.status,
    };
    console.error('Erro capturado:', err.message);
  }
});

app.app.use(bodyParser());

router.get('/', (ctx) => {
  ctx.body = 'ping';
});

router.get('/erro', (ctx) => {
  throw new Error('Error example!');
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
