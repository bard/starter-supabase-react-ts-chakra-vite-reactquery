FROM node:16-alpine AS builder
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --cache-folder /tmp/cache --frozen-lockfile && rm -rf /tmp/cache
COPY ./ ./
RUN yarn typecheck && yarn lint && yarn test && yarn build

FROM pierrezemb/gostatic as runtime
COPY --from=builder /build/dist /app/services/frontend/dist
ENTRYPOINT ["/goStatic", "-path=/app/services/frontend/dist", "-enable-health", "-fallback=/index.html", "-port=3000"]
