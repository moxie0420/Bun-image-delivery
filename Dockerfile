FROM oven/bun:slim
WORKDIR /workdir
COPY . .
RUN bun install
RUN bun run compile
RUN cp out/bid /bin/bid

EXPOSE 8000

ENTRYPOINT [ "/bin/image-server" ]