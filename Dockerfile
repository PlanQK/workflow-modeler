FROM node:18-alpine

LABEL maintainer = "Martin Beisel <martin.beisel@iaas.uni-stuttgart.de>"
COPY "components/bpmn-q" /tmp
WORKDIR /tmp

RUN npm install 

EXPOSE 8080

CMD npm run dev
