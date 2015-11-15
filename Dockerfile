
FROM ubuntu:15.10

RUN apt-get update && apt-get install -y \
	npm \
	curl \
	git \
	build-essential && \
	rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm cache clean -f
RUN npm install -g \
	forever \
	n





RUN n stable





COPY . /src

WORKDIR /src
RUN npm install --production

EXPOSE 8025

CMD ["forever", "--minUptime=1000", "--spinSleepTime=500", "--fifo", "node_modules/bang/cli/bang.js", "--port=8025"]
