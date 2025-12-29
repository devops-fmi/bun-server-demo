FROM oven/bun:alpine as builder

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

COPY src ./src
COPY tsconfig.json ./

RUN bun run build

FROM oven/bun:alpine

USER library-server

WORKDIR /home/library-server/app

# Copy only necessary files from builder
COPY --from=builder /app/dist/server .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run /app/src/index.ts || exit 1

# Start the application
CMD ["./server"]
