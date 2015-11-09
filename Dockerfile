
FROM ubuntu:15.10

RUN apt-get update

RUN apt-get install curl git build-essential -y

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN apt-get install npm -y
RUN npm cache clean -f
RUN npm install n -g
RUN n stable

RUN /bin/echo $(node --version)
RUN npm install forever -g

COPY . /src
RUN cd /src; npm install

EXPOSE 8025
CMD ["forever", "--minUptime=1000", "--spinSleepTime=500", "--fifo", "/src/lib/cli/bang.js", "--port=8025"]
