FROM node:latest

WORKDIR /usr/src/smart-brain-api/

COPY ./ ./

RUN yarn install

CMD ["/bin/bash"]