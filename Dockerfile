
FROM ubuntu:15.10

RUN apt-get update

RUN apt-get install curl git build-essential -y

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN apt-get install npm -y
RUN npm cache clean -f
RUN npm install forever n -g
RUN n stable

COPY . /src
RUN cd /src; npm install

EXPOSE 8025

RUN NODE_ENV=production

CMD ["forever", "--minUptime=1000", "--spinSleepTime=500", "--fifo", "src/node_modules/bang/cli/bang.js", "--port=8025"]
