
FROM ubuntu:15.10

RUN apt-get update && apt-get install -y \
	npm \
	curl \
	git \
	build-essential

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm cache clean -f
RUN npm install -g \
	forever \
	n \

RUN n stable

COPY . /src
RUN cd /src; npm install

EXPOSE 8025

RUN NODE_ENV=production

CMD ["forever", "--minUptime=1000", "--spinSleepTime=500", "--fifo", "src/node_modules/bang/cli/bang.js", "--port=8025"]
