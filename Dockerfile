
FROM ubuntu:15.10

RUN apt-get update

RUN apt-get install curl git build-essential -y

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash

RUN apt-get install npm -y
RUN ~/.nvm/nvm.sh install 5.0.0
RUN ~/.nvm/nvm.sh use 5.0.0

RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY . /src
RUN cd /src; npm install
RUN npm install forever -g

EXPOSE 8025
CMD ["forever", "--minUptime=1000", "--spinSleepTime=500", "--fifo", "/src/lib/cli/bang.js", "--port=8025"]
